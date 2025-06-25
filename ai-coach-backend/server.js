import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Study Coach"
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Request received:', req.body.message);
    
    const messages = [
      { role: "system", content: "You are a helpful AI study coach for math, physics, and chemistry. Keep responses clear and concise." },
      { role: "user", content: req.body.message || "Hello" }
    ];
    
    const completion = await openai.chat.completions.create({
  model: "mistral/mistral-small-3.2-24b-instruct:free", // FREE + IMAGES!
  messages: messages,
  max_tokens: 500
});

    
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000 with FREE model!');
});
