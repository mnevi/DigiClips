import axios from 'axios';

export class WebSearchError extends Error {
  constructor(
    public readonly code: 'INVALID_QUERY' | 'UNCONFIGURED' | 'UPSTREAM_FAILURE',
    message: string,
  ) {
    super(message);
    this.name = 'WebSearchError';
  }
}

export class WebSearchService {
  private searchApiKey: string;
  private apiEndpoint = 'https://google.serper.dev/search';

  constructor() {
    this.searchApiKey = (process.env.SERPER_API_KEY || '').trim();
  }

  async searchWeb(query: string, numResults: number = 5): Promise<string> {
    const normalizedQuery = query.trim();
    const normalizedResultCount = Number.isFinite(numResults)
      ? Math.min(Math.max(Math.trunc(numResults), 1), 10)
      : 5;

    if (!normalizedQuery) {
      throw new WebSearchError('INVALID_QUERY', 'Search query is required');
    }

    if (normalizedQuery.length > 500) {
      throw new WebSearchError('INVALID_QUERY', 'Search query must be 500 characters or fewer');
    }

    // If no API key, raise a typed error so API endpoints can report configuration issues.
    if (!this.searchApiKey) {
      throw new WebSearchError('UNCONFIGURED', 'SERPER_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        this.apiEndpoint,
        {
          q: normalizedQuery,
          num: normalizedResultCount,
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
          .slice(0, normalizedResultCount)
          .map(
            (result: any, index: number) =>
              `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}`
          )
          .join('\n\n');

        return results;
      }

      return '';
    } catch (error) {
      if (error instanceof WebSearchError) {
        throw error;
      }

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Unknown web search failure';

      console.error('Web search failed:', error);
      throw new WebSearchError('UPSTREAM_FAILURE', message);
    }
  }

  isConfigured(): boolean {
    return !!this.searchApiKey;
  }
}
