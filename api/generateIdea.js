import fetch from 'node-fetch';  // Using ES Module import

export default async function handler(req, res) {
  // Ensure we handle only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extracting domain and audience from the request body
  const { domain, audience } = req.body;
  
  // Check if required fields are present
  if (!domain || !audience) {
    return res.status(400).json({ error: 'Domain and Audience are required' });
  }

  const prompt = `Generate a random startup idea for a ${domain} product targeting ${audience}. Include a two-liner pitch, MVP idea, and monetization strategy.`;

  try {
    // Fetch data from the API
    const response = await fetch('https://ai-based-business-ideas-generator.p.rapidapi.com/business-idea', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'ai-based-business-ideas-generator.p.rapidapi.com',
        'X-RapidAPI-Key': '86ec47eecemsh94a0559ea11aae4p141c3djsn880f08deaa89', // Add your API key here
      },
    });

    // If the response is successful, proceed
    if (response.ok) {
      const data = await response.json();
      
      // Log the full response data to debug
      console.log('Full API Response:', data);

      // Check if 'idea' exists in the response data
      if (data && data.business_idea) {
        const ideaText = data.business_idea.trim(); // Get the idea text
        res.status(200).json({ idea: ideaText });
      } else {
        // If 'idea' is missing or undefined, send a proper error message
        console.error('API response does not contain "idea" field:', data);
        res.status(500).json({ error: 'API response does not contain an idea' });
      }
    } else {
      // If the API response is not successful, return the error status
      console.error('Error fetching data from API:', response.statusText);
      res.status(500).json({ error: 'Error fetching data from the API' });
    }
  } catch (error) {
    // Handle network errors or issues with fetching data
    console.error('Error during API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Export the handler function using CommonJS syntax
module.exports = handler;
