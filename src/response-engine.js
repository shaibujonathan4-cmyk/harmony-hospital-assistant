const hospital = require("../data/hospital.json");

function phone() {
  return hospital.hospital.phone;
}

function respondToSpecialist(specialist, entities = {}) {
  if (!specialist) return null;

  const name = specialist.name;
  const article = /^[aeiou]/i.test(name) ? "an" : "a";

  if (entities.appointment) {
    return {
      intent: "appointment",
      data: specialist,
      text: `Of course! 😊 You can request an appointment with ${article} ${name}. Please call our front desk on ${phone()} so we can confirm the clinic time and availability.`
    };
  }

  return {
    intent: "specialist",
    data: specialist,
    text: `Yes, we have ${article} ${name} listed among our specialists. ${specialist.description} The clinic is listed for ${specialist.schedule}. Please give us a call on ${phone()} before coming so we can confirm the doctor's availability. Would you like help with an appointment?`
  };
}

function generateResponse(intentResult, entities = {}, context = {}) {
  const intent = intentResult.intent;

  if (entities.specialist) {
    const specialistResponse = respondToSpecialist(
      entities.specialist,
      entities
    );

    if (specialistResponse) return specialistResponse;
  }

  const responses = {
    greeting: {
      text: "Hello! 👋 Welcome to Harmony Hospital. It's lovely to have you here. How can I help you today?"
    },

    location: {
      text: `We're located at ${hospital.hospital.address.replace(/[.!?]+$/, "")}. If you need help finding us, you can call our front desk on ${phone()}.`
    },

    contact: {
      text: `You can reach us by phone on ${phone()} or send us an email at ${hospital.hospital.email}. We'll be happy to assist you.`
    },

    visiting: {
      text: `Our visiting hours begin at ${hospital.hospital.visitingHours.split(" to ")[0]} and end at ${hospital.hospital.visitingHours.split(" to ")[1]}. You're welcome to visit your loved ones during this time. 😊 Please call us on ${phone()} if you'd like to confirm before coming.`
    },

    cardFees: {
      text: `I'd be happy to help with that. Our current hospital card fee hasn't been confirmed in the information I have. Please call our front desk on ${phone()} and they'll give you the correct amount.`
    },

    fees: {
      text: `The cost depends on the type of consultation or treatment you need. I don't have the confirmed price list at the moment, but our front desk can give you the current charges. You can reach them on ${phone()}.`
    },

    appointment: {
      text: `Certainly! 😊 Are you looking to see a general doctor, or would you like to see a particular specialist? I can help you with the information you need.`
    },

    specialist: {
      text: "Of course! Which specialist would you like to see? Tell me what kind of doctor you're looking for, and I'll help you check."
    },

    services: {
      text: `We offer a range of services, including ${hospital.services.join(", ")}. Is there a particular service you're interested in? I'll be happy to help.`
    },

    laboratory: {
      text: `Yes, we have laboratory services. 😊 If you need a blood test or another laboratory investigation, please call us on ${phone()} so we can confirm whether the specific test is available and let you know the cost.`
    },

    pharmacy: {
      text: `We have pharmacy services available. If you're looking for a particular medicine, please call us on ${phone()} so the team can confirm whether it's currently in stock.`
    },

    portal: {
      text: `You can use the patient portal to access services such as appointments, laboratory results, visit history, prescription requests and medical reports. Please visit our website for portal access.`
    },

    feedback: {
      text: `I'm sorry to hear that you may have had an unpleasant experience. We'd really appreciate the opportunity to look into it. Please contact our team on ${phone()} so we can direct your feedback to the right people.`
    },

    thanks: {
      text: "You're very welcome! 😊 I'm glad I could help. Is there anything else I can assist you with?"
    },

    goodbye: {
      text: "Thank you for reaching out to Harmony Hospital. We appreciate your time. Take care, and we wish you good health! ❤️"
    },

    unknown: {
      text: `I'd be glad to help. Could you tell me a little more about what you need? I'll do my best to point you in the right direction. You can also reach our team on ${phone()}.`
    },

    ambiguous: {
      text: "I'm happy to help. 😊 Could you explain a little more so I can understand exactly what you need?"
    }
  };

  return {
    intent,
    text: (responses[intent] || responses.unknown).text
  };
}

module.exports = { generateResponse };
