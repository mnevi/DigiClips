# Troubleshooting Guide

Quick solutions for common issues.

## Problems by Symptom

### "Scrape Button Doesn't Work"

**Symptom:** Click button, nothing happens or error message appears.

**Cause:** Usually Ollama not running.

**Fix:**
```bash
# Terminal 1: Make sure Ollama is running
ollama serve

# Should see: "listening on 127.0.0.1:11434"
```

Then click button again.

---

### "Connection Refused" / "Unable to connect to AI backend"

**Symptom:** Error message when clicking button.

**Causes:**
1. Ollama not running
2. Port 11434 blocked
3. Wrong machine

**Fix:**
```bash
# 1. Check Ollama is running
ollama serve

# 2. Check port is listening
curl http://localhost:11434/api/tags

# 3. If that doesn't work, restart Ollama
killall ollama  # Kill Ollama
ollama serve    # Restart it
```

---

### "Model Not Found" / "Error: model not available"

**Symptom:** Error when trying to scrape.

**Cause:** AI model not downloaded.

**Fix:**
```bash
# Download the model
ollama pull mistral

# Check what's installed
ollama list

# Should show: mistral (or other model)
```

---

### Very Slow Responses (30+ seconds)

**Symptom:** Takes forever to generate events.

**Causes:**
1. Using larger model (Llama2, Dolphin)
2. Computer running other heavy processes
3. Not enough RAM
4. First request (model loading)

**Fixes:**

Option 1: Use smaller, faster model
```bash
ollama pull neural-chat
export OLLAMA_MODEL=neural-chat
npm run dev  # Restart backend
```

Option 2: Close other applications
- Close browser tabs
- Close IDEs
- Close media players
- Close Slack, Teams, etc.

Option 3: Use smallest model
```bash
ollama pull orca-mini
export OLLAMA_MODEL=orca-mini
npm run dev
```

Tip: First request always takes longer (model loads into memory).

---

### "Out of Memory" / Computer Freezes

**Symptom:** Computer becomes unresponsive, crashes, or exits.

**Causes:**
1. Model too large for your RAM
2. Other apps consuming RAM
3. Not enough available memory

**Fixes:**

Option 1: Use smaller model
```bash
ollama pull orca-mini    # Only 1.5GB
ollama rm mistral        # Remove large one
export OLLAMA_MODEL=orca-mini
npm run dev
```

Option 2: Close other applications
- Browsers
- IDEs (VSCode, etc.)
- Docker
- Virtual machines
- Large files

Option 3: Check your RAM
```bash
# macOS
memory_pressure

# Linux
free -h

# Windows
Task Manager → Memory
```

Need at least: 4GB + model size (e.g., 4GB + 4GB for mistral = 8GB needed)

---

### "Port Already in Use" / "Port 3000 is already in use"

**Symptom:** Backend won't start.

**Cause:** Something else using the port.

**Fix:**

macOS/Linux:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace <PID> with the process ID)
kill -9 <PID>

# Then restart
npm run dev
```

Windows:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F

# Then restart
npm run dev
```

Or use different port:
```bash
PORT=3001 npm run dev  # Use 3001 instead
```

---

### "Cannot find module axios"

**Symptom:** Backend crashes with "Cannot find module 'axios'".

**Cause:** Dependencies not installed.

**Fix:**
```bash
cd email-service/server
npm install
npm run dev
```

---

### Button Appears Then Disappears

**Symptom:** Button shows briefly then vanishes, or email form not rendering.

**Cause:** Frontend build issue.

**Fix:**
```bash
# In Terminal 3 (frontend)
Ctrl+C  # Stop the server

cd email-service
npm install
ng serve --proxy-config ./proxy.conf.json
```

---

### "Cannot find type definition file for 'node'"

**Symptom:** TypeScript error in VSCode.

**Cause:** @types/node not installed.

**Fix:**
```bash
cd email-service/server
npm install --save-dev @types/node
```

---

### Can't Access http://localhost:4200

**Symptom:** Browser won't load the website.

**Causes:**
1. Frontend not running
2. Wrong URL
3. Firewall blocking

**Fix:**

1. Check correct URL: `http://localhost:4200` (not `localhost:3000` or other port)

2. Check frontend is running (Terminal 3):
   ```bash
   cd email-service
   ng serve --proxy-config ./proxy.conf.json
   ```

3. Check firewall isn't blocking

4. Try different browser

---

### "Cannot POST /api/send-email"

**Symptom:** Email won't send.

**Cause:** Backend not running or not reachable.

**Fix:**
```bash
# Check backend is running (Terminal 2)
npm run dev

# Check it's working
curl http://localhost:3000/api/scrape-event

# Should return JSON with event data
```

---

### Everything Runs But Nothing Works

**Symptom:** Services running but app doesn't function.

**Causes:**
1. Old data cached in browser
2. Multiple instances running
3. Configuration conflict

**Fixes:**

1. Clear browser cache:
   - Open DevTools (F12)
   - Right-click refresh button
   - Click "Empty cache and hard refresh"

2. Kill all Node processes:
   ```bash
   # macOS/Linux
   killall node
   killall ollama
   
   # Windows - restart OR:
   taskkill /F /IM node.exe
   ```

3. Start fresh:
   - Close all 3 terminals
   - Open new terminals
   - Run services again

---

## Diagnostic Checklist

Run this if you're stuck:

```bash
# 1. Check Node.js installed
node --version        # Should show 18+
npm --version          # Should show 8+

# 2. Check Ollama installed
ollama --version       # Should show version

# 3. Check model downloaded
ollama list            # Should show mistral (or model)

# 4. Check Ollama running
curl http://localhost:11434/api/tags
# Should return JSON (not error)

# 5. Check ports not in use
lsof -i :11434         # Should be empty or show ollama
lsof -i :3000          # Should be empty or show node
lsof -i :4200          # Should be empty or show ng

# 6. Check backend can reach Ollama
curl http://localhost:3000/api/scrape-event
# Should return event JSON

# 7. Check frontend loads
open http://localhost:4200
# Should show email UI
```

---

## Getting More Help

### Check Browser Console
1. Open http://localhost:4200
2. Press F12 (DevTools)
3. Click "Console" tab
4. Look for red error messages
5. Screenshot it

### Check Terminal Output
Look at what's printed in each terminal:
- Terminal 1 (Ollama): Any errors?
- Terminal 2 (Backend): Any red output?
- Terminal 3 (Frontend): Compilation errors?

### Check Logs
```bash
# See detailed backend logs
npm run dev 2>&1 | tee backend.log

# Open in editor
cat backend.log
```

---

## Still Stuck?

1. Check all 3 services running (3 terminals)
2. Verify ports: 11434 (Ollama), 3000 (Backend), 4200 (Frontend)
3. Try restarting everything
4. Check browser console (F12)
5. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

📖 **Documentation:** [README.md](./README.md) | [SETUP.md](./SETUP.md) | [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)
