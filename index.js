import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import pollinationsRoutes from "./routes/pollinationsRoutes.js"
import postRoutes from "./routes/postRoutes.js";
import connectDB from "./mongodb/connect.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/post", postRoutes);
app.use("/api/pollinations", pollinationsRoutes);

app.get("/", (req, res) => {
  res.send("✅ AI Image Generator Backend is running!");
});

await connectDB(process.env.MONGODB_URL);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app; // this is what Vercel uses
