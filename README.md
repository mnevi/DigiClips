# DigiClips - AI-Powered Email Service

A modern email application with **AI-powered event scraping** using Ollama (free, open-source LLM).

## ✨ Features

- 📧 Full-featured email client (compose, inbox, labels)
- 🤖 **AI event scraping** - Click a button, get AI-generated event summaries
- 🦙 **Ollama integration** - Local AI (no cloud, no API keys)
- 💾 Draft auto-save
- 🏷️ Email labels & organization
- 📎 File attachments
- 🎨 Modern Angular UI

## 🚀 Quick Start (10 minutes)

### Prerequisites
- Node.js 18+
- Ollama (free, from ollama.ai)

### Setup

```bash
# 1. Install Ollama & download model (one-time)
# Visit: https://ollama.ai → Download → Install
ollama pull mistral

# 2. Start Ollama (Terminal 1)
ollama serve

# 3. Start Backend (Terminal 2)
cd email-service/server
npm install
npm run dev

# 4. Start Frontend (Terminal 3)
cd email-service
npm install
ng serve --proxy-config ./proxy.conf.json

# 5. Open browser
# http://localhost:4200
```

That's it! You now have a full email app with AI-powered event scraping.

## 🎯 How to Use

1. **Create Email** - Click "New Message"
2. **Scrape Event** - Click "🌐 Scrape Current Event" button
3. **AI Generates** - Ollama AI creates event summary locally
4. **Auto-Insert** - Event text inserted into email body
5. **Send** - Compose and send your email

## 🔧 What's This AI Button?

The "Scrape Current Event" button:
- ✅ Connects to **local Ollama AI** (not cloud)
- ✅ Generates unique event information each time
- ✅ Inserts formatted text into your email
- ✅ Takes 2-5 seconds
- ✅ Works completely offline (after setup)
- ✅ Zero cost

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
