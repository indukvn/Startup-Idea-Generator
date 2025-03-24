const fetch = require('node-fetch');  // Ensure node-fetch is included

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
    // Replace with your RapidAPI key and correct endpoint
    const response = await fetch('https://ai-based-business-ideas-generator.p.rapidapi.com/business-idea', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'ai-based-business-ideas-generator.p.rapidapi.com',
        'X-RapidAPI-Key': 'c29d47f4b9msh6ebec8fa6f238e0p17013cjsn061f400df469', // Add your API key here
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Log the full response to understand its structure
      console.log('API Response:', data);

      // Check if the response contains the expected idea field
      if (data && data.idea) {
        const ideaText = data.idea.trim(); // Extract the idea text
        res.status(200).json({ idea: ideaText });
      } else {
        res.status(500).json({ error: 'API response does not contain an idea' });
      }
