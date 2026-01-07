import axios from 'axios';

// Utilisez cette URL pour le développement
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3000/api'
  : 'https://footre-app.vercel.app/api';

export const replicate = {
  async generateImage(prompt: string, style?: string) {
    console.log('Generating image with prompt:', prompt);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-image`, {
        prompt,
        style: style || 'realistic-vision',
        size: '1024x1024'
      }, {
        timeout: 60000  // 60 secondes pour Replicate
      });
      
      console.log('Replicate response:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('Replicate API Error:', error);
      
      // Fallback images
      const fallbackImages = [
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=800&q=80',
      ];
      
      const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      
      return {
        url: randomImage,
        prompt: prompt,
        revised_prompt: `${prompt} - football scene`,
        isDemo: true,
        error: error.message
      };
    }
  },

  async generateVideo(prompt: string) {
    // Replicate a aussi des modèles vidéo
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-video`, {
        prompt,
        size: '1024x576'
      });
      return response.data;
    } catch (error: any) {
      console.error('Video API Error:', error);
      
      return {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        message: 'Demo video',
        isMock: true
      };
    }
  }
};

// Pour compatibilité avec l'ancien code
export const openai = replicate;
