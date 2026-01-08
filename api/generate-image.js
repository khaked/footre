import Replicate from "replicate";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt manquant" });

  if (!process.env.REPLICATE_API_TOKEN) {
    const fallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    return res.status(500).json({ success: true, url: fallback, isDemo: true, note: "Clé Replicate non configurée" });
  }

  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const enhancedPrompt = `professional football scene, ${prompt}, cinematic, 4k, stadium`;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input: { prompt: enhancedPrompt, width: 512, height: 512, num_outputs: 1, num_inference_steps: 20 } }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    return res.status(200).json({ success: true, url: imageUrl, prompt, revised_prompt: enhancedPrompt, provider: "replicate", isAI: true });
  } catch (err) {
    console.error("Erreur Replicate:", err.message);
    const fallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    return res.status(500).json({ success: true, url: fallback, prompt, isDemo: true, error: err.message });
  }
}
