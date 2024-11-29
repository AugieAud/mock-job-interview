const express = require("express");
const bodyParser = require("body-parser");
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

// Initialize the GoogleGenerativeAI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    // Generate AI response using GoogleGenerativeAI
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text(); // Get the text response from the AI

    res.json({ aiResponse });
  } catch (error) {
    console.error("Error occurred during API call:", error); // Log the error details

    if (error.response) {
      // If there's a response from the AI API
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

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
