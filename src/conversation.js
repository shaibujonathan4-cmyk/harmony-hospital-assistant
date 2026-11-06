const { randomUUID } = require("crypto");
const { respond } = require("./engine");
const hospital = require("../data/hospital.json");

const sessions = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000;

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function handleConversation(message, session = {}) {
  const text = normalize(message);
  const result = respond(message, session);

  if (result.intent === "emergency") return result;

  const previousIntent = session.lastIntent;
  const specialist = session.lastSpecialist;

  const positive = [
    "yes", "yes please", "please", "sure", "okay", "ok",
    "of course", "that would be helpful"
  ];

  const negative = ["no", "no thanks", "not now", "no thank you"];

  if (specialist && ["specialist", "appointment"].includes(previousIntent)) {
    if (positive.includes(text)) {
      session.lastIntent = "appointment";
      return {
        intent: "appointment",
        text: `Certainly! 😊 To arrange an appointment with the ${specialist.name}, please contact Harmony Hospital's front desk on ${hospital.hospital.phone}. Ask them to confirm the clinic schedule and appointment requirements.`
      };
    }

    if (negative.includes(text)) {
      session.lastIntent = "specialist";
      return {
        intent: "specialist",
        text: "No problem! 😊 Is there anything else you'd like to know about the specialist?"
      };
    }

    if (/\b(book|booking|appointment|arrange|schedule)\b/.test(text)) {
      session.lastIntent = "appointment";
      return {
        intent: "appointment",
        text: `Certainly! 😊 To arrange an appointment with the ${specialist.name}, please contact Harmony Hospital's front desk on ${hospital.hospital.phone}. Ask them to confirm the clinic schedule and appointment requirements.`
      };
    }

    if (/\b(when|what day|which day|schedule|clinic time|available|availability|what time)\b/.test(text)) {
      return {
        intent: "specialist",
        text: `The published clinic schedule for the ${specialist.name} is ${specialist.schedule}. Please call the front desk on ${hospital.hospital.phone} to confirm it is still current.`
      };
    }

    if (/\b(treat|treats|treatment|condition|conditions|specialize|specialises|specializes)\b/.test(text)) {
      return {
        intent: "specialist",
        text: `The ${specialist.name} handles ${specialist.description.toLowerCase()} Would you like help with appointment information?`
      };
    }
  }

  if (previousIntent === "appointment") {
    if (positive.includes(text)) {
      return {
        intent: "appointment",
        text: `I'd be happy to help. 😊 Please contact the hospital on ${hospital.hospital.phone} to confirm the appointment process and available times.`
      };
    }

    if (negative.includes(text)) {
      return {
        intent: "appointment",
        text: "That's perfectly fine. 😊 Let me know whenever you need help with an appointment."
      };
    }
  }

  if (result.data && result.data.name) {
    session.lastSpecialist = result.data;
  }

  session.lastIntent = result.intent;
  return result;
}

function getSession(sessionId) {
  const now = Date.now();

  for (const [id, entry] of sessions.entries()) {
    if (now - entry.updatedAt > SESSION_TIMEOUT) {
      sessions.delete(id);
    }
  }

  let id = sessionId;

  if (typeof id !== "string" || !id || id.length > 100 || !sessions.has(id)) {
    id = randomUUID();
  }

  let entry = sessions.get(id);

  if (!entry) {
    entry = { context: {}, updatedAt: now };
  }

  entry.updatedAt = now;
  sessions.set(id, entry);

  return { sessionId: id, context: entry.context };
}

function saveSession(sessionId, context) {
  const entry = sessions.get(sessionId);

  if (entry) {
    entry.context = context;
    entry.updatedAt = Date.now();
  }
}

module.exports = {
  handleConversation,
  getSession,
  saveSession
};
