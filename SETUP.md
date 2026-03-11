# Setup & Installation Guide

Get DigiClips running in 15 minutes.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org)
- **Ollama** - [Download here](https://ollama.ai) (Free, open-source)

Verify installation:
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
ollama version  # Should show version
```

## Step 1: Install Ollama

1. Visit [ollama.ai](https://ollama.ai)
2. Download for your operating system
3. Install (drag to Applications on macOS, run installer on Windows/Linux)
4. Verify: Open terminal and type `ollama --version`

## Step 2: Download an AI Model

```bash
ollama pull mistral
```

This downloads the AI model (~4GB, one-time setup).

**Alternative models:**
```bash
ollama pull neural-chat    # Faster (3GB)
ollama pull llama2         # Higher quality (7GB)
ollama pull orca-mini      # Smallest/fastest (1.5GB)
```

## Step 3: Start the Services

You need **3 terminal windows** open simultaneously.

### Terminal 1: Ollama AI Server

```bash
ollama serve
```

Expected output:
```
time=2026-02-25T... level=INFO msg="listening on 127.0.0.1:11434"
```

✅ **Keep this running.** Don't close this terminal.

### Terminal 2: Backend API Server

```bash
cd /home/mnevi/Projects/DigiClips/email-service/server
npm install
npm run dev
```

Expected output:
```
Mail backend (TS) listening on http://localhost:3000
```

### Terminal 3: Frontend Angular App

```bash
cd /home/mnevi/Projects/DigiClips/email-service
npm install
ng serve --proxy-config ./proxy.conf.json
```

Expected output:
```
✔ Compiled successfully
Application bundle generation complete
```

## Step 4: Open in Browser

```
http://localhost:4200
```

You should see the email application.

## Step 5: Test the AI Feature

1. Click "✎ New Message" (or navigate to Compose)
2. Scroll to "Message" section
3. Click **"🌐 Scrape Current Event"** button
4. Wait 2-5 seconds...
5. Event text appears in email body ✨

## ✅ Verification Checklist

- [ ] Ollama installed and running (`ollama serve`)
- [ ] Model downloaded (`ollama pull mistral`)
- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend running on `http://localhost:4200`
- [ ] Browser shows email UI
- [ ] "Scrape Event" button visible
- [ ] Clicking button generates event

## 🔧 Troubleshooting

### "Connection refused" / Button doesn't work
→ Make sure Terminal 1 (`ollama serve`) is running

### Model not found
```bash
ollama pull mistral  # Download the model
ollama list          # Check installed models
```

### Slow responses (30+ seconds)
→ Use smaller model: `ollama pull neural-chat`

### Out of memory / Computer freezing
→ Close other apps or use smaller model: `ollama pull orca-mini`

### Can't find npm or node
→ Node.js not installed. Download from nodejs.org

### Port already in use
```bash
# macOS/Linux:
lsof -i :11434   # Find process using port 11434
kill -9 <PID>    # Kill it

# Windows:
netstat -ano | findstr :11434
taskkill /PID <PID> /F
```

## 📊 What Each Terminal Does

| Terminal | Purpose | Port | Must Keep Running? |
|----------|---------|------|---|
| 1 | Ollama AI server | 11434 | ✅ Yes |
| 2 | Backend API | 3000 | ✅ Yes |
| 3 | Frontend website | 4200 | ✅ Yes |

All three must be running simultaneously for the app to work.

## 🎯 Next Steps

- 📖 Read [CONFIGURATION.md](./CONFIGURATION.md) to customize models
- 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how it works
- 📱 Read [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for feature details

---

**Stuck?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or check browser console (F12 → Console tab).
