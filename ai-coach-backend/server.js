import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received request with image:', !!req.body.image);
    console.log('Message:', req.body.message);
    
    const messages = [
      { role: "system", content: "You are a helpful AI study coach. When you receive an image, carefully analyze it for any math problems, equations, diagrams, or text. Solve any problems you find step-by-step. Use LaTeX for math: $x^2$ for inline, $$\\int x^2 dx = \\frac{x^3}{3} + C$$ for display." }
    ];
    
    if (req.body.image && req.body.hasImage) {
      console.log('Processing image request...');
      messages.push({
        role: "user",
        content: [
          { type: "text", text: req.body.message || "Please analyze this image and solve any math problems you see step by step." },
          { type: "image_url", image_url: { url: req.body.image } }
        ]
      });
    } else {
      messages.push({ role: "user", content: req.body.message });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages
    });
    
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

