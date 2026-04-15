import axios from 'axios';

export class WebSearchService {
  private searchApiKey: string;
  private apiEndpoint = 'https://google.serper.dev/search';

  constructor() {
    this.searchApiKey = process.env.SERPER_API_KEY || '';
  }

  async searchWeb(query: string, numResults: number = 5): Promise<string> {
    // If no API key, return empty (graceful fallback)
    if (!this.searchApiKey) {
      console.warn('SERPER_API_KEY not configured - web search unavailable');
      return '';
    }

    try {
      const response = await axios.post(
        this.apiEndpoint,
        {
          q: query,
          num: numResults,
          gl: 'us',
          hl: 'en'
        },
        {
          headers: {
            'X-API-KEY': this.searchApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      // Format search results
      if (response.data.organic && response.data.organic.length > 0) {
        const results = response.data.organic
          .slice(0, 3)
          .map(
            (result: any, index: number) =>
              `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}`
          )
          .join('\n\n');

        return results;
      }

      return '';
    } catch (error) {
      console.error('Web search failed:', error);
      return '';
    }
  }

  isConfigured(): boolean {
    return !!this.searchApiKey;
  }
}
