import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

// POST /api/stability
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🎨 Generating image with Stability AI (SDXL)...");

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Stability API error: ${response.status} ${errText}`);
    }

    const result = await response.json();

    // Stability returns Base64 images
    const imageBase64 = result.artifacts[0].base64;

    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("❌ Error generating image:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;