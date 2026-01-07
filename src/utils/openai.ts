import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Proxy via Vercel
const API_BASE_URL = 'https://your-app.vercel.app/api'; // À remplacer avec votre URL Vercel

export const openai = {
  async generateImage(prompt: string, style?: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt,
        style,
        size: '1024x1024'
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur génération image:', error);
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
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur génération vidéo:', error);
      throw error;
    }
  }
};