document.getElementById("submitButton").addEventListener("click", async () => {
  const jobTitle = document.getElementById("jobTitle").value;
  const userResponse = document.getElementById("userResponse").value;
  const chatDisplay = document.getElementById("chatDisplay");

  // Display user input
  chatDisplay.innerHTML += `<p><strong>You:</strong> ${userResponse}</p>`;
  document.getElementById("userResponse").value = ""; // Clear input field

  try {
    const response = await fetch("http://localhost:3000/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle,
        userResponse,
        conversationHistory: chatDisplay.innerText,
      }),
    });

    const data = await response.json();
    chatDisplay.innerHTML += `<p><strong>Interviewer:</strong> ${data.aiResponse}</p>`;
    chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll
  } catch (error) {
    chatDisplay.innerHTML += `<p style="color: red;"><strong>Error:</strong> Unable to connect to AI.</p>`;
  }
});
