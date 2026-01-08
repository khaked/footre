// src/utils/replicate.ts
import axios from 'axios';

// Déterminer l'URL de base dynamiquement
const getApiBaseUrl = () => {
  // En développement, utilisez localhost:3000 pour l'API
  // En production, utilisez l'URL du site
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api';
  }
  // Pour Vercel, utilisez l'URL actuelle
  return '/api';
};

export const replicate = {
  async generateImage(prompt: string, style?: string) {
    console.log('🔄 Génération image pour:', prompt, 'Style:', style || 'default');
    
    // Construire le prompt final
    const basePrompt = `football player, ${prompt}, professional sports photography`;
    const finalPrompt = style 
      ? `${basePrompt}, ${style} style`
      : basePrompt;
    
    try {
      const apiUrl = getApiBaseUrl();
      console.log('📤 Envoi à l\'API:', `${apiUrl}/generate-image`);
      
      const response = await axios.post(`${apiUrl}/generate-image`, {
        prompt: finalPrompt
      }, {
        timeout: 90000, // 90 secondes timeout pour la génération
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Réponse API reçue');
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur API:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config?.url
      });
      
      // Fallback avec images Unsplash
      const getFallbackImage = () => {
        const images = [
          'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80',
          'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80',
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80',
          'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80',
          'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80',
        ];
        return images[Math.floor(Math.random() * images.length)];
      };
      
      return {
        success: true,
        url: getFallbackImage(),
        prompt: finalPrompt,
        revised_prompt: `${finalPrompt} - fallback image`,
        provider: 'demo',
        isDemo: true,
        error: error.message,
        note: 'Mode démo activé'
      };
    }
  }
};

export const openai = replicate;