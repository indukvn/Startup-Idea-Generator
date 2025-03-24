const fetch = require('node-fetch');  // Make sure to install node-fetch

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
    // Replace your API key here
    const response = await fetch('https://ai-based-business-ideas-generator.p.rapidapi.com/business-idea', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'ai-based-business-ideas-generator.p.rapidapi.com',
        'X-RapidAPI-Key': 'c29d47f4b9msh6ebec8fa6f238e0p17013cjsn061f400df469', // Ensure you have the correct API key here
      },
    });

    if (response.ok) {
      const data = await response.json();
      const ideaText = data.idea.trim();
      res.status(200).json({ idea: ideaText });
    } else {
      res.status(500).json({ error: 'Failed to fetch idea from API' });
    }
  } catch (error) {
    console.error('Error generating idea:', error);
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
