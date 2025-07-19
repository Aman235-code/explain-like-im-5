const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // ✅ Load .env variables

const app = express();
const PORT = 5000;

// ✅ Load key from .env
const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/explain", async (req, res) => {
  const { topic, level } = req.body;

  const prompt =
    `Explain "${topic}" in a ${level} way.` +
    (level === "kid"
      ? " Use simple language suitable for a 5-year-old."
      : level === "expert"
      ? " Use technical terms and assume deep knowledge."
      : " Keep it clear and understandable for a beginner.");

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt,
        max_tokens: 1000,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const output = response.data.generations[0].text;
    res.json({ explanation: output.trim() });
  } catch (error) {
    console.error("Cohere API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
