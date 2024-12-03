//load environment variables from a .env file into process.env
const dotenv = require("dotenv");
dotenv.config();
// Load the required libraries
const express = require("express"); //web framework used to build APIS and web applications
const bodyParser = require("body-parser"); //middleware to parse incoming JSON request bodies
const path = require("path"); //Node.js module for handling file and directory paths
const { GoogleGenerativeAI } = require("@google/generative-ai"); //library for interacting with Google Generative AI

//if the api key is not found, log an error and exit the process
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//initialize the express app
const app = express();
//middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//defines a POST endpoint at /interview
app.post("/interview", async (req, res) => {
  // Extract the job title, user response, and conversation history from the request body
  const {
    jobTitle,
    userResponse,
    conversationHistory: clientHistory,
  } = req.body;

  // If no conversation history is provided, initialize an empty array
  const conversationHistory = clientHistory || [];

  // Add the user's response to the conversation history
  conversationHistory.push({
    role: "user",
    parts: [{ text: userResponse }],
  });

  //count how many questions the user has answered, in order to stop at 6
  const aiResponses = conversationHistory.filter(
    (msg) => msg.role === "model"
  ).length;

  //declare prompt variable
  let prompt;

  if (aiResponses < 6) {
    //continue with the interview
    // Construct the prompt for the AI
    //conversation history- joins the conversation history array into a string
    prompt = `
  You are a professional interviewer. Your role is to interview the user for the job title: "${jobTitle}".
  The conversation history so far is as follows:
  ${conversationHistory
    .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
    .join("\n")}
  Please respond with the next interview question based on the user's responses so far.
`;
  } else {
    prompt = `
    You are a professional interviewer. The user has completed their interview for the job title: "${jobTitle}".
    The conversation history is as follows:
    ${conversationHistory
      .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
      .join("\n")}
    Please provide feedback on the user's answers, highlighting their strengths and areas for improvement.
  `;
  }

  try {
    // Use the `gemini-1.5-flash` model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the model and based on the prompt
    const result = await model.generateContent(prompt);

    //extract AI's response
    const aiResponse = result.response.text();

    // Add the AI's response to the conversation history
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });

    // Send back the AI's response and updated conversation history
    //error handling
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
