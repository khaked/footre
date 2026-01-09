// src/utils/replicate.ts - VERSION OPTIMISÉE
import axios from 'axios';

// Configuration
const CONFIG = {
  timeout: 90000, // 90 secondes pour la génération IA
  maxRetries: 2,
  retryDelay: 1000
};

// Fallback images par style
const FALLBACK_IMAGES = {
  default: [
    "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
    "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  ],
  artistic: [
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1024&q=80",
  ],
  cartoon: [
    "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80",
  ],
  '3d-render': [
    "https://images.unsplash.com/photo-1594736797933-d0e49e6bf5ad?w=1024&q=80",
    "https://images.unsplash.com/photo-1511882150382-421056c89033?w=1024&q=80",
  ],
  'oil-painting': [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1024&q=80",
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1024&q=80",
  ]
};

export const replicate = {
  async generateImage(prompt: string, style: string = 'default') {
    console.log("⚽ Lancement génération IA:", { prompt, style });
    
    // Validation
    if (!prompt || prompt.trim().length < 2) {
      console.warn("❌ Prompt trop court");
      return this.getFallbackImage(prompt, style, "Prompt trop court");
    }
    
    const cleanPrompt = prompt.trim().slice(0, 500);
    
    try {
      // URL dynamique
      const isDev = import.meta.env.DEV;
      const API_BASE_URL = isDev 
        ? "http://localhost:3000/api"
        : "/api";
      
      console.log(`📤 Envoi à ${API_BASE_URL}/generate-image`);
      
      // Essayer avec retry
      let lastError;
      for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/generate-image`,
            { 
              prompt: cleanPrompt,
              style: style
            },
            { 
              timeout: CONFIG.timeout,
              headers: { 
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              } 
            }
          );
          
          console.log(`✅ Réponse reçue (tentative ${attempt + 1}/${CONFIG.maxRetries + 1})`);
          
          // Vérifier la réponse
          if (response.data?.success && response.data?.url) {
            console.log("🎉 Génération réussie:", {
              provider: response.data.provider,
              time: response.data.generation_time_ms,
              isDemo: response.data.isDemo
            });
            
            return response.data;
          } else {
            throw new Error('Réponse API invalide');
          }
          
        } catch (error: any) {
          lastError = error;
          console.warn(`⚠️ Tentative ${attempt + 1} échouée:`, error.message);
          
          if (attempt < CONFIG.maxRetries) {
            console.log(`⏳ Nouvelle tentative dans ${CONFIG.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
          }
        }
      }
      
      // Toutes les tentatives ont échoué
      throw lastError || new Error('Échec de toutes les tentatives');
      
    } catch (error: any) {
      console.error("❌ Échec de la génération IA:", {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });
      
      return this.getFallbackImage(cleanPrompt, style, error.message);
    }
  },
  
  getFallbackImage(prompt: string, style: string, errorMsg: string) {
    console.log("🔄 Activation du mode fallback...");
    
    const styleKey = style as keyof typeof FALLBACK_IMAGES;
    const images = FALLBACK_IMAGES[styleKey] || FALLBACK_IMAGES.default;
    const imageUrl = `${images[Math.floor(Math.random() * images.length)]}&t=${Date.now()}`;
    
    const styleNames = {
      default: 'photographie professionnelle',
      artistic: 'style artistique',
      cartoon: 'style dessin animé',
      '3d-render': 'rendu 3D',
      'oil-painting': 'peinture à l\'huile'
    };
    
    const styleName = styleNames[styleKey] || 'réaliste';
    const revisedPrompt = `${prompt}, scène de football, ${styleName}, lumière cinématographique, stade, 4K`;
    
    return {
      success: true,
      url: imageUrl,
      prompt: prompt,
      revised_prompt: revisedPrompt,
      provider: 'fallback',
      isAI: false,
      isDemo: true,
      error: errorMsg,
      note: 'Mode démo - Configurez Replicate pour des vraies images IA'
    };
  }
};

export const openai = replicate;