import mongoose from "mongoose";

const Post = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },

    likes: { type: Number, default: 0 },   // for most liked
    views: { type: Number, default: 0 },   // for most viewed
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const PostSchema = mongoose.model("Post", Post);

export default PostSchema;
