const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'mistral';

function normalizeOllamaBaseUrl(rawUrl?: string): string {
  const fallbackUrl = rawUrl?.trim() || DEFAULT_OLLAMA_BASE_URL;

  return fallbackUrl
    .replace(/\/api\/generate\/?$/, '')
    .replace(/\/$/, '');
}

export function getOllamaBaseUrl(): string {
  return normalizeOllamaBaseUrl(process.env.OLLAMA_URL || process.env.OLLAMA_API_URL);
}

export function getOllamaGenerateUrl(): string {
  return `${getOllamaBaseUrl()}/api/generate`;
}

export function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
}
