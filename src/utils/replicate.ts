import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5173/api'
  : 'https://footre.vercel.app/api';


export const replicate = {
  async generateImage(prompt: string, style?: string) {
    console.log('🔄 Génération image pour:', prompt, 'Style:', style || 'default');
    
    // Utiliser le style si fourni, sinon default
    const enhancedPrompt = style 
      ? `${prompt}, ${style} style`
      : prompt;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt: enhancedPrompt  // Inclure le style dans le prompt
      }, {
        timeout: 45000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
      
    } catch (error: any) {
      console.error('Erreur API:', error.message);
      
      // Fallback avec style
      const getFallbackImage = (style?: string) => {
        const images = {
          realistic: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80',
          artistic: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80',
          cartoon: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80',
          default: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80'
        };
        
        return images[style as keyof typeof images] || images.default;
      };
      
      return {
        success: true,
        url: getFallbackImage(style),
        prompt: prompt,
        style: style,
        isDemo: true,
        error: error.message
      };
    }
  }
};

export const openai = replicate;