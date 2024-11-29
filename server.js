const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta3/models/text-bison:generate";

app.post("/interview", async (req, res) => {
  const { jobTitle, userResponse, conversationHistory } = req.body;

  const prompt = `
    You are a professional interviewer for the job title: ${jobTitle}.
    The interview so far:
    ${conversationHistory}
    The user just responded: "${userResponse}"
    Please provide the next question to ask the user, and adjust to their responses. 
    Conclude with an overall assessment and feedback after 6 questions.
    `;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        prompt: { text: prompt }, // Corrected prompt structure
        maxOutputTokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.output ||
      "AI did not provide a valid response.";
    res.json({ aiResponse });
  } catch (error) {
    console.error("Error occurred during API call:", error); // Log the error details

    if (error.response) {
      // If there's a response from Gemini API
      console.error("Google Gemini API response error:", error.response.data);
      res.status(500).json({ error: error.response.data }); // Log the response error
    } else if (error.request) {
      // If no response is received
      console.error(
        "No response received from Google Gemini API:",
        error.request
      );
      res.status(500).json({ error: "No response from AI service" });
    } else {
      // General error logging
      console.error("Unknown error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
