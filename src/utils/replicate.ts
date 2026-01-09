// src/utils/replicate.ts - VERSION AVEC REPLICATE
import axios from 'axios';

export const replicate = {
  async generateImage(prompt: string, style?: string) {
    console.log("⚽ Génération avec Replicate:", prompt);
    
    // Construire le prompt final
    const basePrompt = `football scene, ${prompt}, professional sports photography`;
    const finalPrompt = style 
      ? `${basePrompt}, ${style} style`
      : basePrompt;
    
    try {
      // URL dynamique selon l'environnement
      const API_BASE_URL = import.meta.env.DEV 
        ? "http://localhost:3000/api"
        : "/api"; // Relatif au domaine actuel
      
      console.log("📤 Appel API:", `${API_BASE_URL}/generate-image`);
      
      const response = await axios.post(
        `${API_BASE_URL}/generate-image`,
        { 
          prompt: finalPrompt,
          style: style || 'default'
        },
        { 
          timeout: 60000, // 60 secondes timeout
          headers: { 
            "Content-Type": "application/json" 
          } 
        }
      );
      
      console.log("✅ Réponse Replicate reçue");
      return response.data;
      
    } catch (error: any) {
      console.error("❌ Erreur API:", error.message);
      
      // Fallback local avec Unsplash
      const images = {
        default: [
          "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
          "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=800&q=80",
        ],
        artistic: [
          "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
        ],
        cartoon: [
          "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80",
        ]
      };
      
      const styleKey = style as keyof typeof images;
      const fallbackImages = images[styleKey] || images.default;
      const fallbackUrl = fallbackImages[0] + '&t=' + Date.now();
      
      return {
        success: true,
        url: fallbackUrl,
        prompt: prompt,
        revised_prompt: `${prompt}, ${style || 'default'} football scene`,
        provider: 'fallback',
        isAI: false,
        isDemo: true,
        error: error.message,
        note: 'Mode démo suite à une erreur'
      };
    }
  },
};

export const openai = replicate;