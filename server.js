const express = require("express");
const helmet = require("helmet");
const path = require("path");

const {
  handleConversation,
  getSession,
  saveSession
} = require("./src/conversation");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    application: "Harmony Hospital Assistant"
  });
});

app.post("/api/chat", (req, res) => {
  const { message, sessionId } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      status: "error",
      message: "Please enter a message."
    });
  }

  try {
    const session = getSession(sessionId);
    const result = handleConversation(message, session.context);

    saveSession(session.sessionId, session.context);

    res.json({
      status: "success",
      reply: result.text,
      intent: result.intent,
      priority: result.priority || "normal",
      sessionId: session.sessionId
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      status: "error",
      message: "I'm having difficulty responding right now. Please contact the hospital directly."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Harmony Assistant running at http://127.0.0.1:${PORT}`);
});
