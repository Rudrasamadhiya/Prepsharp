export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rudrasamadhiya.github.io',
        'X-Title': 'PrepSharp AI Coach'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-small-3.2-24b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a JEE preparation AI tutor. Give concise, helpful answers about Physics, Chemistry, and Math. Keep responses under 150 words.' },
          { role: 'user', content: req.body.message }
        ],
        max_tokens: 300
      })
    });
    
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    res.status(500).json({ error: 'API Error' });
  }
}