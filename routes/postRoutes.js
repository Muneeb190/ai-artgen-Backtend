import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

dotenv.config();
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* GET all posts with optional sorting* 
Example: /api/post?sort=likes OR ?sort=views OR ?sort=newest*/
router.get("/", async (req, res) => {
  try {
    const { sort } = req.query;

    let sortQuery = {};
    switch (sort) {
      case "likes":
        sortQuery = { likes: -1 };
        break;
      case "views":
        sortQuery = { views: -1 };
        break;
      case "newest":
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const posts = await Post.find().sort(sortQuery);
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// GET a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, message: "Failed to fetch post" });
  }
});



/* CREATE a new post*/
router.post("/", async (req, res) => {
  try {
    const { name, prompt, title, photo } = req.body;

    if (!name || !prompt || !title || !photo) {
      return res.status(400).json({
        success: false,
        message: "Name, title, prompt, and photo are required",
      });
    }

    // Upload image to Cloudinary
    const uploadedPhoto = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
      title,
      name,
      prompt,
      photo: uploadedPhoto.secure_url,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create post, please try again",
    });
  }
});

/**
 * Increment likes for a post
 */
router.patch("/:id/like", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
});

/**
 * Increment views for a post
 */
router.patch("/:id/view", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ success: false, message: "Failed to update views" });
  }
});

export default router;