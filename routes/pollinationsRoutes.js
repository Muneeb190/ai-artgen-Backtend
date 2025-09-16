import express from "express";
import fetch from "node-fetch"; // ✅ install with: npm install node-fetch

const router = express.Router();

// GET /api/pollinations (for quick test in browser)
router.get("/", (req, res) => {
  res.send("✅ Pollinations route is working! Use POST to generate images.");
});

// POST /api/pollinations
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🎨 Generating image with Pollinations...");

    // ✅ Build Pollinations URL
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    // ✅ Fetch image
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch image from Pollinations");
    }

    // ✅ Convert to base64
    const buffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(buffer).toString("base64");

    // ✅ Send back as JSON (same format you had with Gemini)
    res.json({ imageBase64 });
  } catch (err) {
    console.error("❌ Error generating image with Pollinations:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
