import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import stabilityRoutes from "./routes/stabilityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import connectDB from "./mongodb/connect.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/post", postRoutes);
app.use("/api/stability", stabilityRoutes);

app.get("/", (req, res) => {
  res.send("✅ AI Image Generator Backend is running!");
});

await connectDB(process.env.MONGODB_URL);

export default app; // this is what Vercel uses