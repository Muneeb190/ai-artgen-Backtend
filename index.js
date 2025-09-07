import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import stabilityRoutes from "./routes/stabilityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import connectDB from "./mongodb/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/post", postRoutes);
app.use("/api/stability", stabilityRoutes);

app.get("/", (req, res) => {
  res.send("✅ AI Image Generator Backend is running!");
});

// Connect to MongoDB first
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL); // Ensure this matches your .env key
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
