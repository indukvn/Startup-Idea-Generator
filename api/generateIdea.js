const fetch = require('node-fetch');  // Make sure to require node-fetch

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { domain, audience } = req.body;
  if (!domain || !audience) {
    return res.status(400).json({ error: 'Domain and Audience are required' });
  }

  const prompt = `Generate a random startup idea for a ${domain} product targeting ${audience}. Include a one-liner pitch, MVP idea, and monetization strategy.`;

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // Fetch API Key from environment
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API Key is missing' });
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const ideaText = data.choices[0].text.trim();
    res.status(200).json({ idea: ideaText });

  } catch (error) {
    console.error('Error generating idea:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
