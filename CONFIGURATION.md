# Configuration Guide

Customize DigiClips for your needs.

## Model Selection

Ollama supports multiple AI models. Choose based on your hardware.

### Quick Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **Mistral** | 4GB | 3-5s | Good | Default choice |
| **Neural-Chat** | 3GB | 2-3s | OK | Speed priority |
| **Llama2** | 7GB | 5-8s | Excellent | Quality priority |
| **Orca-Mini** | 1.5GB | 1-2s | Basic | Low memory |

### Switch Models

```bash
# 1. Download new model (one-time)
ollama pull neural-chat

# 2. Set it as default
export OLLAMA_MODEL=neural-chat

# 3. Restart backend
npm run dev
```

### Available Models

```bash
# Download additional models
ollama pull mistral           # 4GB (default)
ollama pull neural-chat       # 3GB (faster)
ollama pull llama2            # 7GB (better quality)
ollama pull dolphin-mixtral   # 26GB (powerful)
ollama pull orca-mini         # 1.5GB (smallest)

# List installed models
ollama list

# Remove a model (free up space)
ollama rm mistral
```

## Environment Variables

Configure backend behavior via environment variables.

### Method 1: Command Line

```bash
export OLLAMA_MODEL=llama2
export OLLAMA_API_URL=http://localhost:11434
npm run dev
```

### Method 2: .env File

Create `email-service/server/.env`:

```env
OLLAMA_MODEL=neural-chat
OLLAMA_API_URL=http://localhost:11434
PORT=3000
NODE_ENV=development
```

Then start backend:
```bash
npm run dev
```

### Available Variables

```env
# AI Model to use
OLLAMA_MODEL=mistral

# Ollama server URL (change if running remote Ollama)
OLLAMA_API_URL=http://localhost:11434

# Backend port
PORT=3000

# Environment
NODE_ENV=development
```

## Performance Tuning

### Make It Faster

1. **Use smaller model**
   ```bash
   ollama pull neural-chat
   export OLLAMA_MODEL=neural-chat
   ```

2. **Keep Ollama running**
   - Don't close Terminal 1 (ollama serve)
   - Model stays loaded in memory
   - Faster subsequent requests

3. **Close background apps**
   - Close browser tabs
   - Quit Slack/Teams
   - Quit IDEs
   - Free up RAM

4. **Enable GPU** (if available)
   - Ollama auto-detects NVIDIA/AMD GPU
   - 10x+ faster with GPU
   - No configuration needed

### Make It Use Less Memory

1. **Use smallest model**
   ```bash
   ollama pull orca-mini
   export OLLAMA_MODEL=orca-mini
   ```

2. **Unload model from memory**
   ```bash
   # Just restart terminal
   Ctrl+C  # Stop ollama serve
   ollama serve
   ```

3. **Monitor memory**
   ```bash
   # macOS
   top -o %MEM
   
   # Linux
   free -h
   
   # Windows
   Task Manager → Memory tab
   ```

## Network Configuration

### Default Setup (Local Only)

```
Ollama: localhost:11434
Backend: localhost:3000
Frontend: localhost:4200
```

All on your computer.

### Remote Ollama (Advanced)

If Ollama runs on different machine:

```bash
# Set remote Ollama server
export OLLAMA_API_URL=http://192.168.1.100:11434
npm run dev
```

For example: Run Ollama on powerful server, frontend on laptop.

## Email Configuration

### Sender Address

Edit `email-service/server/index.ts`:

```typescript
from: `"Your Name" <your.email@example.com>`,
```

### Email Server

Current: Nodemailer test accounts (for development)

To use real email:

1. Update transporter settings in index.ts
2. Use Gmail, SendGrid, AWS SES, etc.
3. Add credentials to environment variables

### Attachments

Current: Supports file attachments from compose form.

Max file size: 10MB (configurable in index.ts)

```typescript
app.use(express.json({ limit: '10mb' }));  // Change this
```

## Frontend Customization

### Change Angular Port

```bash
ng serve --port 5000 --proxy-config ./proxy.conf.json
```

Then visit: http://localhost:5000

### Change Proxy Target

Edit `email-service/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3001",  // Change port here
    "secure": false,
    "changeOrigin": true
  }
}
```

## Backend Customization

### Customize AI Prompt

Edit `email-service/server/index.ts`, find:

```typescript
const prompt = `Generate a current trending event...`
```

Modify the prompt to change how AI generates events.

### Add More Event Categories

Modify mock fallback data in index.ts.

### Add Logging

```typescript
console.log('Event generated:', eventData);
```

Output appears in Terminal 2.

## Database (Optional)

Current app doesn't use database (everything in memory).

To add database:

1. Install: `npm install mongoose` (or other)
2. Store emails in collection
3. Query emails from database

See [ARCHITECTURE.md](./ARCHITECTURE.md) for more details.

## SSL/HTTPS (Production)

Current: Development mode (no SSL)

For production:

1. Get SSL certificate (Let's Encrypt)
2. Configure Express with HTTPS
3. Update frontend CORS
4. Configure Ollama with HTTPS

---

📖 **Documentation:** [README.md](./README.md) | [SETUP.md](./SETUP.md) | [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
