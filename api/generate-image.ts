import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurer CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    
    const { prompt, style, size } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('Generating image for prompt:', prompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${style ? `${style} style: ` : ''}${prompt}`,
      size: size || "1024x1024",
      quality: "standard",
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      return res.status(500).json({ error: 'No image generated' });
    }

    const imageData = response.data[0];
    
    return res.status(200).json({
      url: imageData.url || '',
      revised_prompt: imageData.revised_prompt || prompt
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to generate image',
      message: error.message 
    });
  }
}
