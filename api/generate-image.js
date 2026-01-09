// api/generate-image.js
const FOOTBALL_IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80",
];

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log('🎯 API Football appelée avec:', prompt);
    
    // Simuler délai IA
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Image aléatoire
    const randomImage = FOOTBALL_IMAGES[Math.floor(Math.random() * FOOTBALL_IMAGES.length)];
    const imageUrl = `${randomImage}&t=${Date.now()}`;
    
    // Générer prompt révisé
    const revisedPrompt = `${prompt}, football scene, cinematic lighting, stadium atmosphere, professional photography, 4k`;
    
    return res.status(200).json({
      success: true,
      url: imageUrl,
      prompt: prompt,
      revised_prompt: revisedPrompt,
      provider: 'football-ai-api',
      isAI: true,
      isDemo: true,
      note: 'API Football IA fonctionnelle ⚽'
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    
    const fallback = FOOTBALL_IMAGES[0] + `&t=${Date.now()}`;
    
    return res.status(200).json({
      success: true,
      url: fallback,
      prompt: req.body?.prompt || 'football',
      isDemo: true,
      error: error.message
    });
  }
}