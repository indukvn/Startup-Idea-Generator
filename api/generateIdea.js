const fetch = require('node-fetch'); // Make sure this is required for Node.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get domain and audience from request body
  const { domain, audience } = req.body;

  if (!domain || !audience) {
    return res.status(400).json({ error: 'Domain and Audience are required' });
  }

  // Create the prompt based on domain and audience
  const prompt = `Generate a random startup idea for a ${domain} product targeting ${audience}. Include a one-liner pitch, MVP idea, and monetization strategy.`;

  try {
    // Fetch the OpenAI API Key from environment variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Get from GitHub Secrets

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API Key is missing' });
    }

    // Call the OpenAI API to get the idea
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

    // Check for errors from the OpenAI API
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Parse the returned idea and send it back to the frontend
    const ideaText = data.choices[0].text.trim();
    res.status(200).json({ idea: ideaText });

  } catch (error) {
    console.error('Error generating idea:', error);  // Log the error for debugging
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
