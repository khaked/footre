const Replicate = require('replicate');

// Images de fallback
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80',
  'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80',
];

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    // Parse body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body || '{}');
        const { prompt } = parsedBody;

        if (!prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Prompt is required' }));
        }

        // Si pas de token Replicate, utiliser fallback
        if (!process.env.REPLICATE_API_TOKEN) {
          console.log('No Replicate token, using fallback');
          const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: true,
            url: fallbackImage,
            prompt: prompt,
            isDemo: true,
            note: 'Using demo image (Replicate not configured)'
          }));
        }

        // Initialiser Replicate
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        });

        console.log('Calling Replicate API for prompt:', prompt);
        
        // CORRECTION ICI : Remplacez les backslashes par des guillemets
        // Ancienne ligne (avec erreur) :
        // const enhancedPrompt = \professional football scene, \, cinematic, detailed, 4k, stadium, players\;
        
        // Nouvelle ligne (corrigée) :
        const enhancedPrompt = `professional football scene, ${prompt}, cinematic, detailed, 4k, stadium, players`;
        
        // Utiliser Stable Diffusion
        const output = await replicate.run(
          'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
          {
            input: {
              prompt: enhancedPrompt,
              width: 1024,
              height: 1024,
              num_outputs: 1,
              guidance_scale: 7.5,
              num_inference_steps: 25
            }
          }
        );

        const imageUrl = Array.isArray(output) ? output[0] : output;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          url: imageUrl,
          prompt: prompt,
          revised_prompt: enhancedPrompt,
          provider: 'replicate',
          isAI: true
        }));

      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Fallback en cas d'erreur
    const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      url: fallbackImage,
      prompt: 'football',
      isDemo: true,
      error: error.message,
      note: 'Using fallback due to API error'
    }));
  }
};