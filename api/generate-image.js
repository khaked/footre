// api/generate-image.js - VERSION OPTIMISÉE REPLICATE
import Replicate from 'replicate';

// Cache pour éviter les doublons de génération
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 secondes

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80",
];

export default async function handler(req, res) {
  // CORS étendu
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { prompt, style = 'default' } = req.body;
    
    if (!prompt || prompt.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Prompt is required and must be at least 2 characters',
        note: 'Exemple: "joueur de football marquant un but"'
      });
    }
    
    const cleanPrompt = prompt.trim().slice(0, 500); // Limiter la taille
    
    console.log('🎯 Replicate API appelée:', { 
      prompt: cleanPrompt, 
      style,
      timestamp: new Date().toISOString() 
    });
    
    // Vérifier le cache
    const cacheKey = `${cleanPrompt}-${style}`;
    const cached = requestCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('♻️ Utilisation du cache');
      return res.status(200).json(cached.data);
    }
    
    // Vérifier la clé API
    const apiToken = process.env.REPLICATE_API_TOKEN;
    
    if (!apiToken || apiToken.length < 20) {
      console.log('⚠️ Mode démo - Clé Replicate invalide ou manquante');
      const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      const fallbackData = {
        success: true,
        url: `${fallbackImage}&t=${Date.now()}`,
        prompt: cleanPrompt,
        revised_prompt: `${cleanPrompt}, football scene, ${style} style, cinematic`,
        provider: 'demo',
        isAI: true,
        isDemo: true,
        note: 'Configurez REPLICATE_API_TOKEN sur Vercel. Allez dans Settings > Environment Variables'
      };
      
      requestCache.set(cacheKey, {
        timestamp: Date.now(),
        data: fallbackData
      });
      
      return res.status(200).json(fallbackData);
    }
    
    console.log('🔑 Clé Replicate valide détectée');
    
    // Initialiser Replicate
    const replicate = new Replicate({
      auth: apiToken,
      userAgent: 'footre-football-ai/1.0'
    });
    
    // Améliorer le prompt selon le style
    const styleEnhancers = {
      default: 'professional sports photography, cinematic lighting, sharp focus, 8k',
      artistic: 'artistic style, creative composition, painterly, dramatic lighting',
      cartoon: 'cartoon style, animated, comic book, vibrant colors, cel shading',
      '3d-render': '3D render, CGI, digital art, blender render, octane render',
      'oil-painting': 'oil painting style, brush strokes, classical art, masterpiece'
    };
    
    const styleEnhancer = styleEnhancers[style] || styleEnhancers.default;
    const enhancedPrompt = `football scene, ${cleanPrompt}, ${styleEnhancer}, stadium atmosphere, detailed, high quality`;
    
    console.log('🔄 Début génération avec prompt amélioré:', enhancedPrompt);
    
    // Choix du modèle (SDXL pour qualité, FLUX pour rapidité)
    const USE_FLUX = true; // Changez à false pour SDXL
    
    const modelConfig = USE_FLUX 
      ? {
          model: "black-forest-labs/flux-schnell",
          version: "0542a5448c9d9c0b2fe50f7d3748f5b0f8ab4ea7b7c5c4c8b9e6f9a8d7c6b5a",
          input: {
            prompt: enhancedPrompt,
            num_outputs: 1,
            num_inference_steps: 4, // Très rapide
            guidance_scale: 3.5,
            output_format: "webp"
          }
        }
      : {
          model: "stability-ai/sdxl",
          version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          input: {
            prompt: enhancedPrompt,
            width: 768,
            height: 768,
            num_outputs: 1,
            num_inference_steps: 25,
            guidance_scale: 7.5,
            scheduler: "DPMSolverMultistep",
            negative_prompt: "blurry, distorted, text, watermark, ugly, deformed, bad quality, low resolution"
          }
        };
    
    console.log(`🤖 Utilisation du modèle: ${modelConfig.model}`);
    
    const startTime = Date.now();
    const output = await replicate.run(
      `${modelConfig.model}:${modelConfig.version}`,
      { input: modelConfig.input }
    );
    const generationTime = Date.now() - startTime;
    
    console.log(`✅ Génération terminée en ${generationTime}ms`);
    
    const imageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('URL image invalide reçue de Replicate');
    }
    
    console.log('🖼️ Image générée avec succès:', imageUrl);
    
    const resultData = {
      success: true,
      url: imageUrl,
      prompt: cleanPrompt,
      revised_prompt: enhancedPrompt,
      provider: 'replicate',
      model: USE_FLUX ? 'flux-schnell' : 'sdxl',
      isAI: true,
      isDemo: false,
      generation_time_ms: generationTime,
      cost_estimate: USE_FLUX ? '$0.004' : '$0.01',
      style: style,
      note: `Généré avec Replicate en ${Math.round(generationTime/1000)}s ⚽`
    };
    
    // Mettre en cache
    requestCache.set(cacheKey, {
      timestamp: Date.now(),
      data: resultData
    });
    
    // Nettoyer le cache ancien
    cleanupCache();
    
    return res.status(200).json(resultData);
    
  } catch (error) {
    console.error('🔥 Erreur Replicate:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0]
    });
    
    // Fallback avec image de football
    const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    const fallbackData = {
      success: true,
      url: `${fallbackImage}&t=${Date.now()}`,
      prompt: req.body?.prompt || 'football',
      revised_prompt: `${req.body?.prompt || 'football'}, football scene, cinematic`,
      provider: 'fallback',
      isAI: false,
      isDemo: true,
      error: error.message,
      note: 'Erreur Replicate, image de secours activée'
    };
    
    return res.status(200).json(fallbackData);
  }
}

function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 2) {
      requestCache.delete(key);
    }
  }
}