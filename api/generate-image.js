// api/generate-image.js - VERSION AVEC REPLICATE RÉELLE
import Replicate from 'replicate';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
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
    
    console.log('🎯 Appel Replicate avec prompt:', prompt);
    
    // Vérifiez si la clé API est configurée
    if (!process.env.REPLICATE_API_TOKEN) {
      console.log('⚠️ Mode démo - Pas de clé Replicate');
      const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      
      return res.status(200).json({
        success: true,
        url: `${fallbackImage}&t=${Date.now()}`,
        prompt: prompt,
        revised_prompt: `${prompt} - football scene (demo)`,
        provider: 'demo',
        isAI: true,
        isDemo: true,
        note: 'Clé Replicate non configurée'
      });
    }
    
    console.log('🔑 Clé Replicate détectée');
    
    // Initialiser Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    
    // Améliorer le prompt pour le football
    const enhancedPrompt = `football scene, ${prompt}, cinematic lighting, stadium atmosphere, professional sports photography, 4k, sharp focus, action shot`;
    
    console.log('🔄 Lancement de la génération Replicate...');
    
    // Utiliser un modèle gratuit ou peu coûteux
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: enhancedPrompt,
          width: 512,           // Plus petit = moins cher
          height: 512,
          num_outputs: 1,       // Une seule image
          num_inference_steps: 20,  // Moins de steps = moins cher
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
          negative_prompt: "blurry, distorted, text, watermark, ugly, deformed"
        },
        wait: {
          interval: 1000,
        },
      }
    );
    
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    console.log('✅ Image Replicate générée:', imageUrl);
    
    return res.status(200).json({
      success: true,
      url: imageUrl,
      prompt: prompt,
      revised_prompt: enhancedPrompt,
      provider: 'replicate',
      isAI: true,
      isDemo: false,  // ← VRAIE IA maintenant !
      note: 'Généré avec Replicate AI ⚽'
    });
    
  } catch (error) {
    console.error('🔥 Erreur Replicate:', error.message);
    
    // Fallback avec image Unsplash
    const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    
    return res.status(200).json({
      success: true,
      url: `${fallbackImage}&t=${Date.now()}`,
      prompt: req.body?.prompt || 'football',
      revised_prompt: `${req.body?.prompt || 'football'} - football scene`,
      provider: 'fallback',
      isAI: false,
      isDemo: true,
      error: error.message,
      note: 'Erreur Replicate, fallback activé'
    });
  }
}