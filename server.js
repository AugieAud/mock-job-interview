const dotenv = require("dotenv");
dotenv.config(); // Load environment variables at the start

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Loaded API Key:", process.env.GEMINI_API_KEY);

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/interview", async (req, res) => {
  const {
    jobTitle,
    userResponse,
    conversationHistory: clientHistory,
  } = req.body;

  // Use the client-supplied conversation history if provided
  const conversationHistory = clientHistory || [];

  // Add the user's response to the conversation history
  conversationHistory.push({
    role: "user",
    parts: [{ text: userResponse }],
  });

  const prompt = `
    You are a professional interviewer. Your role is to interview the user for the job title: "${jobTitle}".
    The conversation history so far is as follows:
    ${conversationHistory
      .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
      .join("\n")}
    Please respond with the next interview question based on the user's responses so far.
    After the sixth question, provide feedback on the user's answers, highlighting their strengths and areas for improvement.
  `;

  try {
    // Use the `gemini-1.5-flash` model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the model
    const result = await model.generateContent(prompt);

    const aiResponse = result.response.text(); // Extract the AI's response

    // Add the AI's response to the conversation history
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });

    // Send back the AI's response and updated conversation history
    res.json({ aiResponse, conversationHistory });
  } catch (error) {
    console.error("Error occurred during API call:", error.message);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
