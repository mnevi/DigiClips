# DigiClips - AI-Powered Email Service

A modern email application with Ollama-powered content generation, Serper-backed web search, and PostgreSQL persistence for drafts and sent mail.

## ✨ Features

- 📧 Full-featured email client (compose, inbox, labels)
- 🤖 **AI event scraping and RAG search** - Query Ollama directly or augment answers with live web results
- 🦙 **Ollama integration** - Local AI (no cloud, no API keys)
- 🌐 **Serper web search** - Optional modern web search for time-sensitive prompts
- 🗄️ **PostgreSQL persistence** - Drafts and sent mail sync through Prisma
- 💾 Draft auto-save
- 🏷️ Email labels & organization
- 📎 File attachments
- 🎨 Modern Angular UI

## 🚀 Quick Start (10 minutes)

### Prerequisites
- Node.js 18+
- Ollama (free, from ollama.ai)

### Setup

NOTE: SQL Database implementations may change depending on your setup. Read prisma docs.
Currently connects to server with name `postgres` and password `postgres`. Database is named `digiclips_db`.

```bash
# 1. Install Ollama & download model (one-time)
# Visit: https://ollama.ai → Download → Install
ollama pull mistral

# 2. Start Ollama (Terminal 1)
ollama serve

# 3. Start PostgreSQL Server
pg_ctl start
... or some other chosen method compatible with prisma -- DATABASE_URL is defined in .env

# 4. Configure backend environment
cd email-service/server
cp .env.example .env

# 5. Start Backend (Terminal 2)
cd email-service/server
npx prisma generate
npx prisma migrate dev
npm install
npm run dev

# 6. Start Frontend (Terminal 3)
cd email-service
npm install
ng serve --proxy-config ./proxy.conf.json

or
npm run ng -- serve --proxy-config ./proxy.conf.json

# 7. Open browser
# http://localhost:4200
```

The backend expects `DATABASE_URL`, SMTP credentials, and the canonical `OLLAMA_URL` setting in `email-service/server/.env`.

## 🎯 How to Use

1. **Create Email** - Click "New Message"
2. **Scrape Event** - Click "🌐 Scrape Current Event" button
3. **AI Generates** - Ollama AI creates event summary locally
4. **Auto-Insert** - Event text inserted into email body
5. **Send** - Compose and send your email

## 🔧 AI Search Modes

The compose view now supports two paths:
- `Scrape Current Event` uses the legacy Ollama endpoint, which is still supported.
- `Modern Search` uses `POST /api/query` for RAG responses and `POST /api/web-search` for web-only results.
- Drafts and sent mail are cached in the browser but persisted through the backend.

## 📚 Documentation

| Topic | File |
|-------|------|
| **Setup & Installation** | [SETUP.md](./SETUP.md) |
| **How It Works** | [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) |
| **Troubleshooting** | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| **Configuration** | [CONFIGURATION.md](./CONFIGURATION.md) |
| **Architecture** | [ARCHITECTURE.md](./ARCHITECTURE.md) |

## 📁 Project Structure

```
DigiClips/
├── email-service/           # Angular frontend + Node backend
│   ├── src/                # Frontend code
│   │   └── app/
│   │       └── mail/compose/  # Email compose (with AI button)
│   │
│   └── server/             # Backend API
│       └── index.ts        # Ollama integration
│
└── Documentation files     # Setup guides, etc.
```

## 🌐 Tech Stack

- **Frontend:** Angular 21 (standalone components)
- **Backend:** Express.js (Node.js)
- **AI:** Ollama (local LLM)
- **Email:** Nodemailer
- **Language:** TypeScript

## 🦙 Why Ollama?

| Feature | Ollama | Cloud AI (OpenAI) |
|---------|--------|---|
| **Cost** | Free | $50-500/month |
| **Privacy** | Local | Cloud-stored |
| **Speed** | 2-5s | 1-2s |
| **Setup** | 5 min | 5 min |
| **Internet** | After setup | Always |
| **Open Source** | ✅ | ❌ |

## 🎓 Key Commands

```bash
# Start all services (open 3 terminals)
ollama serve                              # Terminal 1
cd email-service/server && npm run dev     # Terminal 2
cd email-service && ng serve --proxy-config ./proxy.conf.json  # Terminal 3
```

## 🐛 Issues?

**Button doesn't work?**
→ Make sure `ollama serve` is running in Terminal 1

**Slow responses?**
→ Try smaller model: `ollama pull neural-chat`

**Need help?**
→ See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📄 License

MIT

---

📖 **Next:** Read [SETUP.md](./SETUP.md) for detailed installation instructions.
