import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "https://footre-7b6d99v5o-khakeds-projects-14af3630.vercel.app/api";

export const replicate = {
  async generateImage(prompt: string, style?: string) {
    console.log("🔄 Génération image pour:", prompt, "Style:", style || "default");

    const enhancedPrompt = style ? `${prompt}, ${style} style` : prompt;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-image`,
        { prompt: enhancedPrompt },
        { timeout: 45000, headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error: any) {
      console.error("Erreur génération image:", error.response?.data || error.message);

      const FALLBACK_IMAGES: Record<string, string> = {
        realistic: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
        artistic: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
        cartoon: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1024&q=80",
        default: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1024&q=80",
      };

      return {
        success: true,
        url: style ? FALLBACK_IMAGES[style] || FALLBACK_IMAGES.default : FALLBACK_IMAGES.default,
        prompt,
        style,
        isDemo: true,
        error: error.response?.data?.error || error.message,
      };
    }
  }
};

export const openai = replicate; // compatibilité vidéo
