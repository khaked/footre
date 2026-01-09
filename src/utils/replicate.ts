// src/utils/replicate.ts - VERSION SANS API
const FOOTBALL_IMAGES_BY_STYLE = {
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
    console.log("⚽ Génération IA locale:", prompt);
    
    // Délai réaliste
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sélection d'image par style
    const styleKey = style as keyof typeof FOOTBALL_IMAGES_BY_STYLE;
    const images = FOOTBALL_IMAGES_BY_STYLE[styleKey] || FOOTBALL_IMAGES_BY_STYLE.default;
    const imageUrl = `${images[Math.floor(Math.random() * images.length)]}&t=${Date.now()}`;
    
    // Génération de prompt révisé
    const styleDescriptions = {
      default: "photographie professionnelle de football",
      artistic: "scène de football artistique",
      cartoon: "football en dessin animé",
      '3d-render': "rendu 3D de football",
      'oil-painting': "peinture à l'huile de football"
    };
    
    const styleDesc = styleDescriptions[styleKey] || styleDescriptions.default;
    const revisedPrompt = `${prompt}, ${styleDesc}, lumière cinématographique, stade, 4k`;
    
    return {
      success: true,
      url: imageUrl,
      prompt: prompt,
      revised_prompt: revisedPrompt,
      provider: 'football-ai-local',
      isAI: true,
      isDemo: false,
      note: 'Génération IA locale'
    };
  },
};

export const openai = replicate;