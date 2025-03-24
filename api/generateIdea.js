const fetch = require('node-fetch');  // Use fetch in Node.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the domain and audience from the body of the request
  const { domain, audience } = req.body;

  // Create the prompt based on the selected domain and audience
  const prompt = `Generate a random startup idea for a ${domain} product targeting ${audience}. Include a one-liner pitch, MVP idea, and monetization strategy.`;

  try {
    // Get the OpenAI API key from GitHub Secrets
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // GitHub Secret imported into Vercel

    // Call OpenAI API (with the secret API key) to generate the startup idea
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const ideaText = data.choices[0].text.trim();

    // Send the AI response back to the frontend
    res.status(200).json({ idea: ideaText });
  } catch (error) {
    res.status(500).json({ error: 'Error generating idea from OpenAI API', details: error.message });
  }
}
