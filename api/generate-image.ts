import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style, size } = req.body;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${style ? `In ${style} style: ` : ''}${prompt}`,
      size: size || "1024x1024",
      quality: "standard",
      n: 1,
    });

    // Vérifier que response.data existe et a au moins un élément
    if (!response.data || response.data.length === 0) {
      return res.status(500).json({ error: 'No image generated' });
    }

    const imageData = response.data[0];
    
    res.status(200).json({
      url: imageData.url || '',
      revised_prompt: imageData.revised_prompt || prompt
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
