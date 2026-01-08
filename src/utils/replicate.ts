import axios from "axios";

const API_BASE_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";

export const replicate = {
  async generateImage(prompt: string, style?: string) {
    const enhancedPrompt = style ? `${prompt}, ${style} style` : prompt;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-image`,
        { prompt: enhancedPrompt },
        { timeout: 45000, headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error: any) {
      console.error("Erreur génération image:", error.message);
      return {
        success: true,
        url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80", // fallback
        prompt,
        style,
        isDemo: true,
        error: error.message,
      };
    }
  },
};

