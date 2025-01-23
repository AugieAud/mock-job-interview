# AI Mock Interview Application

## Overview

This application helps staff members practice job interviews through an AI-powered interview simulation. It's designed to support employees transitioning to new roles by providing a safe, interactive environment to practice interview skills.

## Features

- Dynamic job-specific interviews based on user input
- AI-powered interviewer that adapts questions based on responses
- Real-time conversation interface
- Performance feedback and improvement suggestions
- Customized questions for any job role
- Minimum 6-question interview flow

## Technical Requirements

- Node.js
- Express.js
- Google Gemini API (API key required)
- Modern web browser

## Installation

1. Clone the repository

```bash
git clone https://github.com/AugieAud/mock-job-interview.git
cd M3-mockInterview
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory and add your Gemini API key:

```
GEMINI_API_KEY=AIzaSyBvqIrS0FLOpkmDXJqCmUJAPPAA98Zd49A
```

4. Start the application

```bash
npm start
```

## Usage

1. Open the application in your web browser
2. Enter the job title you want to practice interviewing for
3. Start with the initial "Tell me about yourself" question
4. Respond naturally to each question
5. Receive AI-generated follow-up questions based on your responses
6. Get feedback and improvement suggestions at the end of the interview

## Features in Detail

### Interview Flow

- Initial question: "Tell me about yourself"
- Minimum 6 dynamic questions based on responses
- Job-specific questions tailored to the entered role
- Adaptive questioning based on previous answers
- Final feedback and improvement suggestions

### User Interface

- Job title input field
- Conversation display area
- Response input field
- Submit button for responses
- Real-time conversation updates

## Security

- API keys are stored securely in environment variables
- No personal data is stored or retained

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

