// server/src/index.ts
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateEmailField(field?: string): boolean {
  if (!field) return true;
  const emails = field.split(',').map(e => e.trim()).filter(Boolean);
  return emails.every(isValidEmail);
}

app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { to, cc, bcc, subject, body } = req.body || {};

    if (!to || !body) {
      return res.status(400).json({ error: 'to and body are required' });
    }
    if (!validateEmailField(to)) return res.status(400).json({ error: 'Invalid to address' });
    if (!validateEmailField(cc)) return res.status(400).json({ error: 'Invalid cc address' });
    if (!validateEmailField(bcc)) return res.status(400).json({ error: 'Invalid bcc address' });

    // Nodemailer test account (Ethereal) - dev only
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const info = await transporter.sendMail({
      from: `"Angular Test" <${testAccount.user}>`,
      to,
      cc,
      bcc,
      subject: subject || '(no subject)',
      text: body
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    return res.json({ ok: true, messageId: info.messageId, previewUrl });
  } catch (err: any) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err?.message });
  }
});

/**
 * AI Content Generation with Ollama
 * Accepts custom prompts to generate email content, articles, etc.
 * Falls back to mock data if Ollama is not available
 */
app.get('/api/scrape-event', async (req: Request, res: Response) => {
  try {
    const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
    
    // Get custom prompt from query parameter
    const userPrompt = (req.query.prompt as string) || '';

    // Build the prompt for Ollama
    let ollamaPrompt: string;
    
    if (userPrompt) {
      // Use user's custom prompt
      ollamaPrompt = `${userPrompt}

Please provide a well-structured, professional response that can be used in an email. Keep it concise but informative.`;
    } else {
      // Default to generating a current event
      ollamaPrompt = `Generate a current trending event or news topic. Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "title": "event title",
  "description": "2-3 sentence description",
  "date": "today's date and time",
  "source": "news source name",
  "relevance": "high",
  "category": "category name"
}

Categories can be: Technology, Science, Business, Health, Entertainment, Sports, Politics, Environment, or Other.
Relevance should be: high, medium, or low.
Make it realistic and informative.`;
    }

    console.log(`Attempting to connect to Ollama at ${OLLAMA_URL} with model: ${OLLAMA_MODEL}`);
    console.log(`User prompt: ${userPrompt ? userPrompt.substring(0, 100) + '...' : '(default event generation)'}`);

    try {
      // Call Ollama to generate content
      const response = await axios.post(
        `${OLLAMA_URL}/api/generate`,
        {
          model: OLLAMA_MODEL,
          prompt: ollamaPrompt,
          stream: false,
          temperature: 0.7
        },
        { timeout: 30000 } // 30 second timeout
      );

      // Get the generated response
      const generatedContent = response.data.response || '';
      console.log('Ollama raw response:', generatedContent.substring(0, 200));

      // If user provided a custom prompt, return the content directly
      if (userPrompt) {
        return res.json({
          success: true,
          response: generatedContent.trim(),
          timestamp: new Date().toISOString()
        });
      }

      // Otherwise parse as JSON event (backward compatibility)
      try {
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Could not extract JSON from Ollama response');
        }

        const eventData = JSON.parse(jsonMatch[0]);

        // Validate the response structure
        if (!eventData.title || !eventData.description) {
          throw new Error('Invalid event structure from Ollama');
        }

        console.log('Generated event:', eventData);

        return res.json({
          success: true,
          event: {
            title: eventData.title,
            description: eventData.description,
            date: eventData.date || new Date().toLocaleString(),
            source: eventData.source || 'Ollama AI',
            relevance: eventData.relevance || 'medium',
            category: eventData.category || 'Technology'
          },
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        // If can't parse as JSON, return as raw generated content
        return res.json({
          success: true,
          response: generatedContent.trim(),
          timestamp: new Date().toISOString()
        });
      }
    } catch (ollamaError: any) {
      console.warn('Ollama connection failed, using fallback:', ollamaError.message);

      // Fallback: If user provided prompt, apologize and suggest retry
      if (userPrompt) {
        return res.json({
          success: false,
          error: 'Could not connect to AI backend. Make sure Ollama is running with: ollama serve',
          timestamp: new Date().toISOString()
        });
      }

      // Otherwise fall back to mock events (for backward compatibility)
      const fallbackEvents = [
        {
          title: 'Technology Conference 2026 - AI Ethics Panel',
          description: 'Leading experts discuss the future of ethical AI development, regulation, and industry standards. Key topics include transparency, bias detection, and responsible AI deployment.',
          date: new Date().toLocaleString(),
          source: 'TechConf.io',
          relevance: 'high',
          category: 'Technology'
        },
        {
          title: 'Open Source AI Summit',
          description: 'Major open-source AI projects showcase their latest developments. Ollama, LLaMA, and other free alternatives gaining significant traction in the developer community.',
          date: new Date().toLocaleString(),
          source: 'OSS Weekly',
          relevance: 'high',
          category: 'Technology'
        },
        {
          title: 'Global Climate Summit Updates',
          description: 'Latest developments from international climate negotiations including carbon reduction targets, renewable energy investments, and climate adaptation strategies.',
          date: new Date().toLocaleString(),
          source: 'ClimateNews.org',
          relevance: 'high',
          category: 'Environment'
        },
        {
          title: 'Innovation in Local Computing',
          description: 'Renewed focus on local AI inference without cloud dependency. Users benefit from privacy, speed, and cost savings with edge computing solutions.',
          date: new Date().toLocaleString(),
          source: 'TechDaily',
          relevance: 'medium',
          category: 'Technology'
        },
        {
          title: 'Space Exploration Milestone',
          description: 'New advancements in lunar mission preparations. International space agencies announce collaborative projects for sustainable lunar settlements.',
          date: new Date().toLocaleString(),
          source: 'SpaceWeekly.net',
          relevance: 'medium',
          category: 'Science'
        }
      ];

      const randomEvent = fallbackEvents[Math.floor(Math.random() * fallbackEvents.length)];

      return res.json({
        success: true,
        event: randomEvent,
        timestamp: new Date().toISOString(),
        note: 'Using fallback data - Ollama not available. Start Ollama with: ollama serve'
      });
    }
  } catch (err: any) {
    console.error('scrape-event error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: err?.message,
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Mail backend (TS) listening on http://localhost:${PORT}`);
});
