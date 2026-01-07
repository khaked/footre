export interface Creation {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;  // Rendre optionnel avec ?
  videoUrl?: string;  // Déjà optionnel
  type: 'image' | 'video';
  createdAt: string;
  prompt?: string;
}

export interface GenerationRequest {
  prompt: string;
  type: 'image' | 'video';
  style?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  creations: Creation[];
}
