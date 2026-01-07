import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log('Test API called');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY);
  
  return res.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  });
}
