const express = require("express");
const bodyParser = require("body-parser"); // parses incoming JSON request bodies and makes them available under req.body
const axios = require("axios"); //makes http requests to external APIs
const dotenv = require("dotenv");

dotenv.config();

const app = express(); //creates express app
app.use(bodyParser.json()); //parse incoming JSON request bodies

//google gemini API endpoint
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta3/models/text-bison:generate";

app.post("/interview", async (req, res) => {
  const { jobTitle, userResponse, conversationHistory } = req.body;
});

//AI prompt
const prompt = `You are a professional interviewer for the job title: ${jobTitle}. The interview so far: ${conversationHistory}. The user just responded: "${userResponse}". Please provide the next question to ask the user, and adjust to their responses. Conslude with an overall assessmemnt and feedback after 6 questions.`;

//send request to google gemini API
try {
  const response = await axios.post(
    GEMINI_URL,
    {
      prompt,
      maxOutputTokens: 200, //control the length of the response
      temperature: 0.7, // adjust the creativity of the response
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
    }
  );

  //extract API response
  const aiResponse = response.data.candidates[0].output;
  res.json([aiResponse]);
} catch (error) {
  console.error("Error calling Google Gemini:", error);
  res.status(500).json({ error: "Failed to generate a response" });
}

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
