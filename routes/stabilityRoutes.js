import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const router = express.Router();

// Initialize Gemini client with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // put your key in .env
});

// POST /api/gemini
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🎨 Generating image with Google Gemini (Nano Banana)...");

    // Call Gemini image model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview", // image generation model
      contents: prompt,
    });

    // Gemini returns candidates with parts
    const parts = response.candidates?.[0]?.content?.parts || [];

    let imageBase64 = null;
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      throw new Error("No image returned from Gemini");
    }

    // Return as Base64-encoded PNG
    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (err) {
    console.error("❌ Error generating image with Gemini:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
