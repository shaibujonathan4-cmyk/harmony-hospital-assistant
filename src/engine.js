const hospital = require("../data/hospital.json");
const { detectIntent } = require("./intent-engine");
const { findSpecialist, extractEntities } = require("./entity-engine");
const { generateResponse } = require("./response-engine");

function respond(message, context = {}) {
  const detected = detectIntent(message);
  const entities = extractEntities(message);

  // Always handle emergencies first.
  if (detected.intent === "emergency") {
    return {
      intent: "emergency",
      priority: "critical",
      text: `I'm sorry you're facing an urgent situation. Please don't wait for an online response. Call Harmony Hospital immediately on ${hospital.emergency.phone} or proceed directly to the emergency department.`
    };
  }

  const result = generateResponse(detected, entities, context);

  // Preserve specialist information for conversation follow-ups.
  if (entities.specialist) {
    result.data = entities.specialist;
  }

  return result;
}

module.exports = {
  respond,
  detectIntent,
  findSpecialist,
  hospital
};
