import axios from 'axios';
import { WebSearchService } from './webSearch';

export interface RAGOptions {
  model?: string;
  useWebSearch?: boolean;
  temperature?: number;
}

export class RAGQueryService {
  private ollamaUrl: string;
  private model = process.env.OLLAMA_MODEL || 'mistral';
  private webSearch = new WebSearchService();
  private temperature = 0.7;

  constructor() {
    // Ensure the URL ends with /api/generate
    let url = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    if (!url.includes('/api/generate')) {
      url = url.replace(/\/$/, '') + '/api/generate';
    }
    this.ollamaUrl = url;
  }

  async queryWithContext(userQuery: string, options?: RAGOptions): Promise<string> {
    const model = options?.model || this.model;
    const useWebSearch = options?.useWebSearch !== false;
    this.temperature = options?.temperature || 0.7;

    try {
      // Step 1: Check if we should search the web
      const shouldSearch = useWebSearch && this.needsWebSearch(userQuery);

      if (shouldSearch && this.webSearch.isConfigured()) {
        console.log(`[RAG] Query needs web search: "${userQuery}"`);

        // Step 2: Fetch web results
        const webResults = await this.webSearch.searchWeb(userQuery);

        if (webResults) {
          // Step 3: Augment prompt with search results
          const augmentedPrompt = `You are a helpful assistant with access to current web information.

User Question: ${userQuery}

Recent Web Search Results:
${webResults}

Please provide an accurate, well-informed answer based on the search results above. If the search results don't contain relevant information, use your training knowledge while noting any limitations.`;

          // Step 4: Re-query Ollama with context
          console.log('[RAG] Re-querying Ollama with augmented context');
          const finalResponse = await this.queryOllama(augmentedPrompt, model);
          return finalResponse;
        }
      }

      // Fallback: Direct query without web search
      const response = await this.queryOllama(userQuery, model);
      return response;
    } catch (error) {
      console.error('[RAG] Query failed:', error);
      throw new Error(`RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async queryOllama(prompt: string, model: string): Promise<string> {
    try {
      const response = await axios.post(
        this.ollamaUrl,
        {
          model,
          prompt,
          stream: false,
          temperature: this.temperature
        },
        {
          timeout: 120000 // 2 minute timeout for long queries
        }
      );

      return response.data.response?.trim() || '';
    } catch (error) {
      console.error('[Ollama] Query error:', error);
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error('Ollama server not running on ' + this.ollamaUrl);
      }
      throw error;
    }
  }

  private needsWebSearch(query: string): boolean {
    // List of keywords that indicate time-sensitive queries
    const timeKeywords = [
      '2024',
      '2025',
      '2026',
      'latest',
      'recent',
      'current',
      'today',
      'now',
      'new',
      'breaking',
      'just released',
      'just announced',
      'coming soon',
      'trending',
      'live',
      'real-time',
      'updated'
    ];

    const lowerQuery = query.toLowerCase();
    const needsSearch = timeKeywords.some(keyword => lowerQuery.includes(keyword));

    if (needsSearch) {
      console.log(`[RAG] Detected time-sensitive query keywords`);
    }

    return needsSearch;
  }

  // Check if Ollama server is available
  async isOllamaAvailable(): Promise<boolean> {
    try {
      const baseUrl = this.ollamaUrl.replace('/api/generate', '');
      await axios.get(baseUrl, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // Get available models from Ollama
  async getAvailableModels(): Promise<string[]> {
    try {
      const baseUrl = this.ollamaUrl.replace('/api/generate', '');
      const response = await axios.get(baseUrl + '/api/tags', {
        timeout: 5000
      });
      return response.data.models?.map((m: any) => m.name) || [];
    } catch {
      return [];
    }
  }
}
