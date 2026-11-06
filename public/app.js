const chatContent = document.getElementById("chatContent");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const quickQuestions = document.getElementById("quickQuestions");

let sessionId = localStorage.getItem("harmony_session_id");

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function scrollToBottom() {
  chatContent.scrollTop = chatContent.scrollHeight;
}

function addMessage(message, sender, priority = "normal") {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}-message`;

  if (sender === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "H";
    wrapper.appendChild(avatar);
  }

  const body = document.createElement("div");
  body.className = "message-body";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  if (priority === "critical") {
    bubble.classList.add("emergency-bubble");
  }

  // Use textContent to prevent HTML injection.
  bubble.textContent = message;

  const time = document.createElement("span");
  time.className = "message-time";
  time.textContent = getTime();

  body.appendChild(bubble);
  body.appendChild(time);
  wrapper.appendChild(body);

  chatContent.appendChild(wrapper);
  scrollToBottom();
}

function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.className = "message assistant-message";
  wrapper.id = "typingMessage";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "H";

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = "<span></span><span></span><span></span>";

  wrapper.appendChild(avatar);
  wrapper.appendChild(indicator);
  chatContent.appendChild(wrapper);

  scrollToBottom();
}

function removeTyping() {
  document.getElementById("typingMessage")?.remove();
}

async function sendMessage(message) {
  const cleanMessage = message.trim();

  if (!cleanMessage || sendBtn.disabled) return;

  addMessage(cleanMessage, "user");
  messageInput.value = "";
  sendBtn.disabled = true;
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: cleanMessage,
        sessionId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to send your message.");
    }

    sessionId = data.sessionId;
    localStorage.setItem("harmony_session_id", sessionId);

    removeTyping();
    addMessage(
      data.reply,
      "assistant",
      data.priority || "normal"
    );

  } catch (error) {
    removeTyping();

    addMessage(
      "I'm sorry, I'm having trouble connecting right now. Please try again shortly. If you need urgent assistance, contact the hospital directly.",
      "assistant"
    );

    console.error("Chat request failed:", error);

  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

messageForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

quickQuestions.addEventListener("click", event => {
  const button = event.target.closest("button[data-message]");

  if (button) {
    sendMessage(button.dataset.message);
  }
});

newChatBtn.addEventListener("click", () => {
  sessionId = null;
  localStorage.removeItem("harmony_session_id");

  chatContent.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-icon">✦</div>
      <h2>Welcome back!</h2>
      <p>How may I assist you today?</p>
    </div>
  `;

  addMessage(
    "Hello! 👋 Welcome to Harmony Hospital. How may I assist you today?",
    "assistant"
  );

  messageInput.focus();
});
