import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

// Initialize OpenAI with your organization and API key
const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to check if the server is up and running
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

// Endpoint to generate a letter based on the provided prompt
app.post("/generate-letter", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Create a chat completion request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or 'gpt-4', based on your access
      messages: [
        {
          role: "system",
          content:
            "You help write personalised letters from Santa Clause. Your response is only the letter and nothing else. Do not start or end your reply with comments or additional text. Put your reply the letter inside these special characters: @@ the letter $$ Your response will be interpreted by an application logic and it will take whatever you put after @@ and before $$.",
        },
        { role: "user", content: prompt },
      ],
    });

    const generatedLetter = completion.choices[0].message.content;
    res.json({ letter: generatedLetter });
  } catch (error) {
    console.error("Error generating letter:", error);
    res.status(500).json({ error: "Failed to generate letter" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});