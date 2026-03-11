# How It Works - Technical Overview & Architecture

Understand the architecture, data flow, and technical implementation of DigiClips.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Your Computer                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │   Frontend Layer (Port 4200)                 │   │
│  │                                              │   │
│  │   ┌─────────────────────────────────────┐   │   │
│  │   │  Angular Application                │   │   │
│  │   │  ├─ Email Compose                   │   │   │
│  │   │  ├─ Inbox                           │   │   │
│  │   │  ├─ AI Scraping Service             │   │   │
│  │   │  └─ Labels & Settings               │   │   │
│  │   └─────────────────────────────────────┘   │   │
│  │                                              │   │
│  │   Proxy: /api → http://localhost:3000       │   │
│  └──────────────────────────────────────────────┘   │
│                       ↑                              │
│                       │ HTTP                         │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │   Backend Layer (Port 3000)                  │   │
│  │                                              │   │
│  │   ┌─────────────────────────────────────┐   │   │
│  │   │  Express.js API Server              │   │   │
│  │   │  ├─ POST /api/send-email            │   │   │
│  │   │  ├─ GET /api/scrape-event           │   │   │
│  │   │  ├─ Error Handling                  │   │   │
│  │   │  └─ CORS Configuration              │   │   │
│  │   └─────────────────────────────────────┘   │   │
│  │                                              │   │
│  │   Nodemailer Integration                    │   │
│  └──────────────────────────────────────────────┘   │
│                       ↑                              │
│                       │ axios HTTP POST             │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │   AI Layer (Port 11434)                      │   │
│  │                                              │   │
│  │   ┌─────────────────────────────────────┐   │   │
│  │   │  Ollama - Local LLM                 │   │   │
│  │   │  ├─ Mistral Model (default)         │   │   │
│  │   │  ├─ Or other models                 │   │   │
│  │   │  ├─ Event Generation                │   │   │
│  │   │  └─ JSON Response                   │   │   │
│  │   └─────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## High-Level Data Flow

```
┌──────────────────┐
│  Your Browser    │  http://localhost:4200
│  (Angular App)   │  • Email UI
│  • Compose       │  • Scrape button
│  • Inbox         │  • Results display
└────────┬─────────┘
         │
         │ HTTP GET /api/scrape-event
         ↓
┌──────────────────┐
│  Backend API     │  http://localhost:3000
│  (Node.js)       │  • Express server
│  • Routes        │  • Connects to Ollama
│  • Email sending │  • Error handling
└────────┬─────────┘
         │
         │ axios POST /api/generate
         ↓
┌──────────────────┐
│  Ollama AI       │  http://localhost:11434
│  (Local LLM)     │  • Mistral model (default)
│  • Event gen     │  • Runs on your computer
│  • JSON response │  • Private, fast
└──────────────────┘
```

## Feature: AI Event Scraping

### What Happens When You Click "Scrape Current Event"

```
1. User clicks button in browser
                    ↓
2. Frontend sends: GET /api/scrape-event
                    ↓
3. Backend receives request
                    ↓
4. Backend sends to Ollama:
   POST /api/generate with prompt:
   "Generate a current trending event..."
                    ↓
5. Ollama AI processes prompt
   (runs on your computer locally)
                    ↓
6. AI generates JSON response:
   {
     "title": "Event Title",
     "description": "...",
     "date": "...",
     "source": "...",
     "category": "..."
   }
                    ↓
7. Backend receives JSON
                    ↓
8. Backend formats and returns to frontend
                    ↓
9. Frontend displays loading state: "🔄 Scraping..."
                    ↓
10. Event text inserted into email body:
    "=== Current Event Information ===
     Title: Event Title
     Description: ...
     Date: ...
     Source: ..."
                    ↓
11. Subject auto-populated: "RE: Event Title"
                    ↓
12. User can now edit and send email
```

**Total time:** 2-5 seconds (depending on AI model and computer specs)

### Code Flow

**Frontend (Angular Component):**
```typescript
// User clicks button
scrapeCurrentEvent() {
  this.isScraping.set(true);  // Show loading state
  this.aiService.fetchCurrentEvent()
}

// Service makes HTTP request
fetchCurrentEvent() {
  return this.http.get('/api/scrape-event')
}

// Result received and inserted
next: (response) => {
  if (response.success && response.event) {
    const formatted = this.formatEventForEmail(response.event);
    draft.body += formatted;  // Insert into email
    draft.subject ||= `RE: ${response.event.title}`;  // Auto-fill subject
  }
},
error: (err) => {
  this.scrapingError.set('Connection failed');
}
```

**Backend (Node.js + Express):**
```typescript
// Receive request
app.get('/api/scrape-event', async (req, res) => {
  try {
    // Connect to local Ollama
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'mistral',
        prompt: 'Generate a current trending event...',
        stream: false
      },
      { timeout: 30000 }  // 30-second timeout
    );
    
    // Parse Ollama response
    const eventData = JSON.parse(response.data.response);
    
    // Return to frontend
    res.json({ success: true, event: eventData });
  } catch (error) {
    // Fall back to mock data if Ollama unavailable
    res.json({ success: true, event: mockEvent });
  }
});
```

**Ollama (Local AI):**
```
1. Receive POST /api/generate request
2. Route to loaded model (Mistral by default)
3. Process prompt with attention mechanism
4. Generate event information
5. Return JSON in response.data field
```

## Component Breakdown

### 1. Frontend (Angular 21)

**Location:** `/email-service/src/app`

**Key Files:**
- `mail/compose/compose.ts` - Main compose component with scraping logic
- `mail/compose/compose.html` - Template with AI button UI
- `core/services/ai.ts` - AI service layer for backend communication
- `app/app.routes.ts` - Route configuration

**Dependencies:**
- Angular 21
- RxJS (reactive programming)
- Standalone components
- TypeScript 5.9+

**Key Features:**
- Compose emails with templates
- Auto-save drafts
- Label management
- File attachments
- **AI event scraping button** ← Custom feature

**State Management:**
- `isScraping` signal - Loading state
- `scrapingError` signal - Error messages
- Draft auto-save via signals

### 2. Backend (Node.js + Express)

**Location:** `/email-service/server/index.ts`

**API Endpoints:**

```typescript
// Send email via Nodemailer
POST /api/send-email
Body: {
  to: string,
  cc?: string,
  bcc?: string,
  subject: string,
  body: string
}
Response: { success: bool, message: string }

// Scrape event via Ollama
GET /api/scrape-event
Response: {
  success: bool,
  event: {
    title: string,
    description: string,
    date: string,
    source: string,
    category: string,
    relevance: string
  }
}
```

**Features:**
- Express.js routing
- CORS enabled (localhost only)
- Nodemailer integration (test accounts)
- **Ollama API integration** ← Custom feature
- Error handling with fallbacks
- 30-second timeout on Ollama requests
- Automatic fallback to mock data if Ollama unavailable

**Default Configuration:**
```typescript
const OLLAMA_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'mistral';
const TIMEOUT = 30000; // 30 seconds
```

### 3. AI Layer (Ollama)

**Service:** Ollama (localhost:11434)

**What it does:**
- Runs LLM (Large Language Model) locally
- No API keys needed
- No data sent to cloud
- Processes requests privately

**Models Available:**
- **Mistral** (4GB, default) - Balanced speed/quality
- **Neural-Chat** (3GB) - Fast responses
- **Llama2** (7GB) - Highest quality
- **Orca-Mini** (1.5GB) - Fastest / lowest resource

**Process Flow:**
```
1. Receives POST to /api/generate
2. Loads model into memory (if not already)
3. Tokenizes prompt
4. Generates response using attention mechanisms
5. Formats as JSON
6. Returns response immediately
```

## File Structure

```
/home/mnevi/Projects/DigiClips/

Root Documentation:
├── README.md                    # Main overview & quick start
├── SETUP.md                     # Installation guide
├── HOW_IT_WORKS.md             # This file (architecture & flow)
├── CONFIGURATION.md             # Customization guide
├── TROUBLESHOOTING.md          # Problem solving

Application Code:
└── email-service/
    ├── server/
    │   ├── index.ts             # Express API + Ollama integration
    │   ├── package.json         # Backend dependencies
    │   └── tsconfig.json        # Backend TS config
    │
    └── src/
        ├── main.ts              # App entry point
        └── app/
            ├── core/services/
            │   └── ai.ts        # ← AI service (new)
            │
            └── mail/compose/
                ├── compose.ts   # ← Component with button (modified)
                ├── compose.html # ← Template with button (modified)
                └── compose.scss # ← Styling (modified)
```

## Technology Stack

### Frontend
- **Framework:** Angular 21.1.2
- **Language:** TypeScript 5.9
- **Styling:** SCSS
- **HTTP:** RxJS Observables + HttpClient
- **State:** Angular Signals (modern pattern)
- **Build:** Vite (via Angular CLI)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **HTTP Client:** Axios
- **Email:** Nodemailer (test accounts)
- **Environment:** TypeScript strict mode

### AI
- **Framework:** Ollama (open-source LLM runner)
- **Models:** Mistral, Llama2, Neural-Chat, etc.
- **API:** REST endpoints (JSON)
- **Protocol:** HTTP
- **License:** Open Source (MIT-like)

## API Response Formats

### Scrape Event Request
```http
GET /api/scrape-event
```

### Success Response
```json
{
  "success": true,
  "event": {
    "title": "Technology Conference 2026",
    "description": "Leading experts discuss AI ethics and safety...",
    "date": "2026-02-25 14:30",
    "source": "TechConf.io",
    "relevance": "high",
    "category": "Technology"
  },
  "timestamp": "2026-02-25T14:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to connect to Ollama",
  "timestamp": "2026-02-25T14:30:00Z"
}
```

## Error Handling Strategy

### Frontend Error Handling
```typescript
this.aiService.fetchCurrentEvent().subscribe({
  next: (response) => {
    if (response.success && response.event) {
      // Success path: insert event
      this.insertEventIntoEmail(response.event);
      this.isScraping.set(false);
    }
  },
  error: (err) => {
    // Error path: show message to user
    this.scrapingError.set('Unable to connect to AI backend');
    this.isScraping.set(false);
  }
});
```

### Backend Error Handling
```typescript
try {
  // Try to connect to Ollama
  const response = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    { model: OLLAMA_MODEL, prompt: ... },
    { timeout: 30000 }
  );
  
  // Success
  return res.json({ success: true, event: JSON.parse(response.data.response) });
  
} catch (error) {
  // Fallback: use mock data (feature still works!)
  return res.json({
    success: true,
    event: {
      title: "Mock Event",
      description: "Ollama unavailable, showing sample data",
      ...
    }
  });
}
```

## Performance Characteristics

### Response Times
- **Ollama startup:** 1-2 seconds (first request, model loading)
- **Ollama generation (Mistral):** 2-5 seconds
- **Ollama generation (Neural-Chat):** 1-3 seconds
- **Network round-trip:** <100ms (localhost)
- **Total user-perceived time:** 2-5 seconds

### Memory Usage
- **Frontend:** ~50MB
- **Backend:** ~100MB
- **Ollama + Model:** 4-7GB+ (depends on model)
- **Total minimum:** 4-8GB RAM recommended

### Concurrent Requests
- Current: Sequential (one at a time)
- Each button click: One AI generation per request

## Security Considerations

### Data Privacy ✅
- All data stays on your computer
- No cloud transmission
- No external API calls
- No user authentication required (local dev)

### Network Security ✅
- CORS properly configured
- Localhost only (no internet exposure)
- No sensitive credentials in code

### For Production Use
- Add authentication layer
- Enable HTTPS/TLS
- Implement rate limiting
- Validate all user inputs
- Use environment variables for secrets
- Run behind firewall
- Consider load balancing

## Scalability Notes

### Current Limitations
- Single user, single machine
- No database (in-memory only)
- No persistent storage
- No user accounts
- No concurrent AI requests

### To Scale Up
- Add database (MongoDB, PostgreSQL, etc.)
- Implement user authentication
- Add request queuing for concurrent AI calls
- Deploy to server/cloud
- Use production AI API if needed
- Add caching layer
- Implement webhook system for async processing

## Dependencies Chain

```
Frontend (Angular)
    │
    ├─ Uses HttpClient (built-in)
    │
    ├─ Uses AIService
    │   └─ Makes HTTP GET /api/scrape-event
    │
    └─ Displays results with Angular templates

Backend (Express)
    │
    ├─ Listens on port 3000
    │
    ├─ Uses axios (HTTP client)
    │   └─ Makes POST to Ollama localhost:11434
    │
    ├─ Uses Nodemailer (email)
    │   └─ Connects to test email service
    │
    └─ Uses TypeScript compiler

Ollama (AI)
    │
    ├─ Runs on localhost:11434
    │
    ├─ Uses loaded model (Mistral/Llama2/etc)
    │
    └─ Processes API requests
```

---

**Next:** [CONFIGURATION.md](./CONFIGURATION.md) - Learn how to customize settings.

