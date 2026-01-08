// api/generate-image.js - VERSION CORRIGÉE
const Replicate = require('replicate');

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80',
  'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80',
];

export default async function handler(req, res) {
  // CORS plus permissif pour le développement
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

    console.log('API Replicate appelée avec prompt:', prompt);

    // Vérifiez si la clé API est configurée
    if (!process.env.REPLICATE_API_TOKEN) {
      console.log('⚠️  Mode démo - Pas de clé Replicate dans l\'environnement');
      console.log('Clés disponibles:', Object.keys(process.env).filter(k => k.includes('REPLICATE')));
      
      const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      
      return res.status(200).json({
        success: true,
        url: fallbackImage,
        prompt: prompt,
        isDemo: true,
        note: 'Clé Replicate API non configurée dans les variables d\'environnement'
      });
    }

    console.log('🔑 Clé Replicate détectée, initialisation...');
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log('🔄 Appel à Replicate API avec prompt:', prompt);

    // Prompt amélioré pour le football
    const enhancedPrompt = `football scene, ${prompt}, cinematic lighting, stadium atmosphere, 4k, professional photography, sport action shot`;
    
    try {
      const output = await replicate.run(
        'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        {
          input: {
            prompt: enhancedPrompt,
            width: 512,
            height: 512,
            num_outputs: 1,
            num_inference_steps: 20,
            guidance_scale: 7.5,
            scheduler: "DPMSolverMultistep"
          },
          wait: {
            interval: 1000,
          },
        }
      );

      const imageUrl = Array.isArray(output) ? output[0] : output;
      
      console.log('✅ Image générée avec succès:', imageUrl);

      return res.status(200).json({
        success: true,
        url: imageUrl,
        prompt: prompt,
        revised_prompt: enhancedPrompt,
        provider: 'replicate',
        isAI: true
      });

    } catch (replicateError) {
      console.error('❌ Erreur Replicate:', replicateError.message);
      
      // Fallback avec une image Unsplash thématique
      const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      
      return res.status(200).json({
        success: true,
        url: fallbackImage,
        prompt: prompt,
        isDemo: true,
        error: replicateError.message,
        note: 'Erreur Replicate, fallback activé'
      });
    }

  } catch (error) {
    console.error('🔥 Erreur générale:', error.message);
    
    const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    
    return res.status(200).json({
      success: true,
      url: fallbackImage,
      prompt: req.body?.prompt || 'football',
      isDemo: true,
      error: error.message,
      note: 'Erreur générale, fallback activé'
    });
  }
}