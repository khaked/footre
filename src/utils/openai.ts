import axios from 'axios';

// Détermine l'URL de base selon l'environnement
const getApiBaseUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3000/api';
  }
  return 'https://ton-app.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();

export const openai = {
  async generateImage(prompt: string, style?: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt,
        style,
        size: '1024x1024'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur génération image:', error);
      
      if (import.meta.env.MODE === 'development' && error.code === 'ECONNREFUSED') {
        return {
          url: `https://placehold.co/1024x1024/1e40af/ffffff?text=${encodeURIComponent(prompt)}`,
          revised_prompt: prompt,
          isMock: true
        };
      }
      
      throw error;
    }
  },

  async generateVideo(prompt: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-video`, {
        prompt,
        size: '1024x576'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur génération vidéo:', error);
      
      if (import.meta.env.MODE === 'development' && error.code === 'ECONNREFUSED') {
        return {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          message: 'Mode développement: vidéo exemple',
          prompt: prompt,
          isMock: true
        };
      }
      
      throw error;
    }
  }
};
