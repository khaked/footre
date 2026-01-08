// api/generate-image.js
import Replicate from "replicate";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1024&q=80",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e5?w=1024&q=80",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1024&q=80",
];

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    if (!process.env.REPLICATE_API_TOKEN) {
      console.warn("⚠️ Clé Replicate API non configurée");
      const fallbackImage =
        FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      return res.status(200).json({
        success: true,
        url: fallbackImage,
        prompt,
        isDemo: true,
        note: "Clé Replicate non configurée",
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const enhancedPrompt = `professional football scene, ${prompt}, cinematic, 4k, stadium`;

    console.log("🔄 Appel à Replicate API...");
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: enhancedPrompt,
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 20,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    console.log("✅ Image générée avec Replicate");

    return res.status(200).json({
      success: true,
      url: imageUrl,
      prompt,
      revised_prompt: enhancedPrompt,
      provider: "replicate",
      isAI: true,
    });
  } catch (error) {
    console.error("🔥 Erreur Replicate:", error.message);
    const fallbackImage =
      FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

    return res.status(200).json({
      success: true,
      url: fallbackImage,
      prompt: req.body?.prompt || "football",
      isDemo: true,
      error: error.message,
      note: "Erreur, fallback activé",
    });
  }
}
