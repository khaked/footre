import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, size } = req.body;
    
    // Note: OpenAI n'a pas encore d'API vidéo publique
    // Pour l'instant, retournons une réponse simulée
    // À remplacer quand l'API vidéo sera disponible
    
    // Vidéos d'exemple football
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    ];
    
    const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    
    res.status(200).json({
      url: randomVideo,
      message: 'Video generation coming soon. Using sample video for now.',
      prompt: prompt,
      isMock: true
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
}
