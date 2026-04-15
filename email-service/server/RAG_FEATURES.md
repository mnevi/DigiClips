# Modern AI Query Features - Setup & Usage

Your DigiClips backend now supports modern AI queries with automatic web search capabilities using the RAG (Retrieval-Augmented Generation) pattern.

## Features

✨ **Smart Web Integration** - Automatically fetches current web results for time-sensitive queries  
🔍 **Flexible Search** - Manual web search endpoint available  
🏥 **Health Monitoring** - Check service status and available models  
📚 **Backward Compatible** - Legacy endpoints still work  

## Setup

### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cd /home/mnevi/Projects/DigiClips/email-service/server
cp .env.example .env
```

Default `.env` has Ollama configured locally. No changes needed unless you're using a different setup.

### 2. (Optional) Enable Web Search

To enable web search capabilities:

1. Visit [https://serper.dev](https://serper.dev)
2. Sign up for free (100 searches/month included)
3. Copy your API key
4. Edit `.env` and add:

```env
SERPER_API_KEY=your_api_key_here
```

### 3. Start the Backend

```bash
npm run dev
```

The server will log all available endpoints.

## API Endpoints

### 1. Modern AI Query (RAG)

Automatically uses web search for time-sensitive queries.

**Endpoint:** `POST /api/query`

**Request:**
```json
{
  "query": "What are the latest developments in AI in 2026?",
  "useWebSearch": true,
  "model": "mistral"
}
```

**Response:**
```json
{
  "success": true,
  "query": "What are the latest developments in AI in 2026?",
  "response": "Based on recent web research...",
  "timestamp": "2026-04-08T12:34:56.789Z"
}
```

**Parameters:**
- `query` (required): Your question or request
- `useWebSearch` (optional): Enable/disable automatic web search (default: true)
- `model` (optional): Override the model (default: "mistral")

**Automatic Web Search Triggers:**
Keywords that trigger automatic web search:
- Time references: 2024, 2025, 2026, latest, recent, current, today, now
- News terms: new, breaking, just released, just announced, trending, live

### 2. Pure Web Search

Get raw web results without AI processing.

**Endpoint:** `POST /api/web-search`

**Request:**
```json
{
  "query": "AI breakthroughs 2026",
  "numResults": 5
}
```

**Response:**
```json
{
  "success": true,
  "query": "AI breakthroughs 2026",
  "results": "[1] Title\nSnippet...\nSource: example.com\n\n[2] ...",
  "timestamp": "2026-04-08T12:34:56.789Z"
}
```

### 3. Health Check

Check if Ollama and web search are available.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "services": {
    "ollama": {
      "available": true,
      "url": "http://localhost:11434",
      "models": ["mistral", "neural-chat"]
    },
    "webSearch": {
      "available": true,
      "configured": true
    }
  },
  "timestamp": "2026-04-08T12:34:56.789Z"
}
```

### 4. Legacy Event Generation

Still available for backward compatibility.

**Endpoint:** `GET /api/scrape-event?prompt=Your+custom+prompt`

---

## Usage Examples

### Example 1: Query with Automatic Web Search

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the latest breakthroughs in quantum computing in 2026?"
  }'
```

The system will:
1. Detect the time-sensitive nature (2026)
2. Query the web for current results
3. Feed results to Ollama
4. Return an informed answer

### Example 2: Direct Web Search

```bash
curl -X POST http://localhost:3000/api/web-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest climate news",
    "numResults": 3
  }'
```

### Example 3: Query Without Web Search

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain how neural networks work",
    "useWebSearch": false
  }'
```

### Example 4: Check Service Health

```bash
curl http://localhost:3000/api/health
```

---

## Integration with Angular Frontend

To use the new endpoints from your Angular component:

```typescript
// In your service
queryAI(query: string) {
  return this.http.post('/api/query', { query });
}

webSearch(query: string) {
  return this.http.post('/api/web-search', { query });
}

checkHealth() {
  return this.http.get('/api/health');
}
```

---

## Troubleshooting

**Q: Web search returns empty results**  
A: Make sure `SERPER_API_KEY` is set in `.env` and you haven't exceeded your monthly quota.

**Q: "Ollama server not running" error**  
A: Ensure Ollama is running: `ollama serve` in another terminal.

**Q: Query takes 30+ seconds**  
A: This is normal with web search + Ollama processing. Use faster model: `OLLAMA_MODEL=neural-chat`

**Q: Make sure Ollama is running with correct model**  
A: Check available models: `ollama list`  
Pull a model: `ollama pull mistral`

---

## Architecture

The RAG system works as follows:

```
User Query
    ↓
[Check for time-sensitive keywords]
    ↓
  NO ╱─────────────────╲ YES
    ↓                  ↓
[Direct Query]    [Fetch Web Results]
    ↓                  ↓
    └─────────┬────────┘
              ↓
       [Augment Prompt]
              ↓
      [Query Ollama Model]
              ↓
        [Return Response]
```

---

## API Key Security

**Development:** `.env` file is safe for development only.

**Production:** Never commit `.env` to git. Use environment variables instead:

```bash
export SERPER_API_KEY="your_key_here"
export OLLAMA_URL="production_ollama_url"
# Then run your server
npm run dev
```

---

## Switching Models

Edit `.env`:

```env
OLLAMA_MODEL=llama2
```

Or pull a different model:

```bash
ollama pull neural-chat
ollama pull orca-mini  # Lightweight option
ollama pull llama2     # High quality
```

Then update `.env`:

```env
OLLAMA_MODEL=neural-chat
```

---

For more info, see [SETUP.md](../SETUP.md)
