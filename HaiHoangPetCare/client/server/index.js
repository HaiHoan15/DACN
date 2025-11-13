import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Lấy key từ biến môi trường
const key = process.env.GEMINI_KEY;

if (!key) {
  console.error("❌ Missing GEMINI_KEY environment variable!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// API proxy
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ text });
  } catch (error) {
    console.error("🔴 Server AI Error:", error);
    return res.status(500).json({ error: "AI error", detail: String(error) });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Proxy server running at http://localhost:${PORT}`));
