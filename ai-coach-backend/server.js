import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI study coach. For math, use proper LaTeX: $x^2$ for inline, $$\\int x^2 dx = \\frac{x^3}{3} + C$$ for display. Always show step-by-step solutions. Keep responses clear and concise." },
        { role: "user", content: req.body.message }
      ]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
