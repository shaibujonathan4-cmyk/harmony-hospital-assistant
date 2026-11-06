const {
  normalize,
  tokenize,
  fuzzyTokenMatch
} = require("./normalizer");

const intentDefinitions = {
  emergency: {
    phrases: [
      "medical emergency",
      "difficulty breathing",
      "cannot breathe",
      "cannot breath",
      "not breathing",
      "chest pain",
      "severe bleeding",
      "unconscious",
      "someone collapsed",
      "heart attack",
      "stroke symptoms",
      "seizure",
      "overdose",
      "poisoning",
      "severe allergic reaction"
    ],
    keywords: [
      "emergency", "unconscious", "collapse",
      "bleeding", "seizure", "overdose",
      "poisoning", "breathing"
    ],
    priority: 100
  },

  visiting: {
    phrases: [
      "visiting hours",
      "when can i visit",
      "what time can i visit",
      "when can i see my patient",
      "when can i see my mother",
      "when can i see my father",
      "when can i see my loved one",
      "when can i come and see my mother",
      "what time are visitors allowed",
      "when do you allow visitors",
      "can i visit a patient",
      "can i come and see a patient"
    ],
    keywords: [
      "visit", "visiting", "visitor", "visitors"
    ],
    supporting: [
      "time", "when", "hour", "hours",
      "allow", "period", "mother", "father",
      "patient", "loved", "come", "see"
    ]
  },

  location: {
    phrases: [
      "where are you located",
      "where is the hospital",
      "where can i find your hospital",
      "where can i find the hospital",
      "what is your hospital address",
      "hospital address",
      "how do i get there",
      "how can i get to the hospital",
      "directions to the hospital",
      "how do i locate your hospital",
      "what is your location"
    ],
    keywords: [
      "location", "address", "direction",
      "directions", "located"
    ],
    supporting: [
      "where", "hospital", "find",
      "reach", "get", "come"
    ]
  },

  contact: {
    phrases: [
      "hospital phone number",
      "contact information",
      "contact details",
      "how can i call the hospital",
      "what is your phone number",
      "how can i contact you",
      "how do i reach the hospital",
      "give me your phone number"
    ],
    keywords: [
      "phone", "telephone", "email",
      "contact", "call", "number"
    ],
    supporting: [
      "hospital", "reach", "speak", "staff"
    ]
  },

  cardFees: {
    phrases: [
      "how much is the hospital card",
      "hospital card price",
      "hospital card fee",
      "how much does registration cost",
      "registration fee",
      "how much to register",
      "how much is a patient card",
      "how much do you charge for a hospital card",
      "price of hospital card"
    ],
    keywords: [
      "card", "registration", "register"
    ],
    supporting: [
      "price", "cost", "fee", "fees",
      "much", "pay", "payment", "charge"
    ]
  },

  fees: {
    phrases: [
      "how much does it cost",
      "what are your charges",
      "how much do you charge",
      "what is the consultation fee",
      "how much is consultation",
      "what is the price",
      "how much do i need to pay before seeing a doctor",
      "how much do i pay to see a doctor",
      "what is the fee for seeing a doctor",
      "how much does it cost to see a doctor",
      "how much will treatment cost",
      "what is the hospital consultation charge"
    ],
    keywords: [
      "cost", "price", "fee", "fees",
      "charge", "charges", "payment", "pay"
    ],
    supporting: [
      "much", "consultation", "doctor",
      "treatment", "service", "hospital",
      "how", "what", "seeing"
    ]
  },

  appointment: {
    phrases: [
      "book an appointment",
      "make an appointment",
      "schedule an appointment",
      "i want to see a doctor",
      "i need to see a doctor",
      "how do i book",
      "appointment booking",
      "i want to book a consultation",
      "can i book a visit",
      "how can i make an appointment"
    ],
    keywords: [
      "appointment", "booking", "book",
      "schedule"
    ],
    supporting: [
      "doctor", "specialist", "see",
      "visit", "want", "need"
    ]
  },

  specialist: {
    phrases: [
      "do you have a cardiologist",
      "do you have a heart specialist",
      "is there a cardiologist",
      "i want to see a cardiologist",
      "i need a cardiologist",
      "which specialists do you have",
      "what specialists are available",
      "do you have specialist doctors",
      "i want to see a specialist",
      "is a specialist available"
    ],
    keywords: [
      "cardiologist", "neurologist", "paediatrician",
      "pediatrician", "gynaecologist", "gynecologist",
      "orthopaedic", "ophthalmologist", "urologist",
      "psychiatrist", "dermatologist", "gastroenterologist",
      "nephrologist", "pulmonologist", "haematologist",
      "endocrinologist", "surgeon", "nutritionist",
      "physiotherapist", "specialist"
    ],
    supporting: [
      "doctor", "clinic", "available",
      "hospital", "see", "have"
    ]
  },

  services: {
    phrases: [
      "what services do you offer",
      "what services are available",
      "what facilities do you have",
      "what does the hospital offer",
      "tell me about your services",
      "what medical services do you provide"
    ],
    keywords: [
      "services", "facilities", "offer",
      "provide", "available"
    ],
    supporting: [
      "hospital", "medical", "health",
      "treatment", "department"
    ]
  },

  laboratory: {
    phrases: [
      "laboratory services",
      "do you have a laboratory",
      "can i do a blood test",
      "where can i get tested",
      "laboratory test",
      "can i run a medical test",
      "do you carry out blood tests",
      "can i check my blood"
    ],
    keywords: [
      "laboratory", "lab", "test",
      "testing", "blood"
    ],
    supporting: [
      "result", "results", "sample",
      "medical", "check", "do"
    ]
  },

  pharmacy: {
    phrases: [
      "do you have a pharmacy",
      "can i buy medicine",
      "where can i get medication",
      "hospital pharmacy",
      "can i buy drugs at the hospital",
      "do you sell medicines"
    ],
    keywords: [
      "pharmacy", "medicine", "medication",
      "drug", "drugs"
    ],
    supporting: [
      "buy", "purchase", "get",
      "hospital", "prescription"
    ]
  },

  portal: {
    phrases: [
      "patient portal",
      "check my laboratory results",
      "view my medical report",
      "check my appointment online",
      "how do i access my patient account",
      "how can i log in to the patient portal"
    ],
    keywords: [
      "portal", "account", "records"
    ],
    supporting: [
      "patient", "medical", "laboratory",
      "appointment", "login", "check",
      "online", "results", "report"
    ]
  },

  feedback: {
    phrases: [
      "i want to make a complaint",
      "how do i complain",
      "i want to give feedback",
      "i have a complaint",
      "where can i report a problem",
      "i want to report an issue",
      "how can i make a complaint"
    ],
    keywords: [
      "complaint", "complain", "feedback",
      "suggestion", "experience"
    ],
    supporting: [
      "staff", "service", "hospital",
      "treatment", "problem", "issue"
    ]
  },

  greeting: {
    phrases: [
      "hello", "good morning",
      "good afternoon", "good evening",
      "hi there", "hey there"
    ],
    keywords: ["hello", "hi", "hey", "greetings"]
  },

  thanks: {
    phrases: [
      "thank you",
      "thank you very much",
      "i appreciate your help"
    ],
    keywords: ["thanks", "thank", "appreciate"]
  },

  goodbye: {
    phrases: [
      "goodbye", "see you later", "talk to you later"
    ],
    keywords: ["goodbye", "bye", "farewell"]
  }
};

function phraseScore(text, phrase) {
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return 0;

  if (` ${text} `.includes(` ${normalizedPhrase} `)) {
    return 1;
  }

  const inputWords = tokenize(text);
  const phraseWords = tokenize(normalizedPhrase);

  let matched = 0;

  for (const word of phraseWords) {
    if (inputWords.some(inputWord =>
      fuzzyTokenMatch(inputWord, word)
    )) {
      matched++;
    }
  }

  const coverage = matched / phraseWords.length;
  const precision = matched / Math.max(inputWords.length, 1);

  return coverage * 0.75 + precision * 0.25;
}

function scoreDefinition(text, definition) {
  let bestPhraseScore = 0;

  for (const phrase of definition.phrases || []) {
    bestPhraseScore = Math.max(
      bestPhraseScore,
      phraseScore(text, phrase)
    );
  }

  const words = tokenize(text);

  const keywordMatches = (definition.keywords || []).filter(keyword =>
    words.some(word =>
      word === keyword || fuzzyTokenMatch(word, keyword)
    )
  ).length;

  const supportingMatches = (definition.supporting || []).filter(keyword =>
    words.some(word =>
      word === keyword || fuzzyTokenMatch(word, keyword)
    )
  ).length;

  const keywordScore = Math.min(
    keywordMatches / Math.max((definition.keywords || []).length, 1),
    1
  );

  const supportScore = Math.min(supportingMatches / 2, 1);

  return Math.min(
    1,
    bestPhraseScore * 0.70 +
    keywordScore * 0.20 +
    supportScore * 0.10
  );
}

function detectIntent(message) {
  const text = normalize(message);

  if (!text) {
    return { intent: "empty", confidence: 1, scores: {} };
  }

  const scores = {};

  for (const [name, definition] of Object.entries(intentDefinitions)) {
    scores[name] = scoreDefinition(text, definition);
  }

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const [bestIntent, bestScore] = ranked[0];
  const secondScore = ranked[1]?.[1] || 0;
  const wordCount = tokenize(text).length;

  if (scores.emergency >= 0.50) {
    return {
      intent: "emergency",
      confidence: scores.emergency,
      scores
    };
  }

  if (["greeting", "thanks", "goodbye"].includes(bestIntent)) {
    if (bestScore >= 0.55 && wordCount <= 6) {
      return { intent: bestIntent, confidence: bestScore, scores };
    }
  }

  if (bestScore < 0.34) {
    return { intent: "unknown", confidence: bestScore, scores };
  }

  if (
    bestScore < 0.58 &&
    secondScore >= bestScore - 0.05
  ) {
    return {
      intent: "ambiguous",
      confidence: bestScore,
      scores,
      alternatives: ranked.slice(0, 3).map(
        ([intent, confidence]) => ({ intent, confidence })
      )
    };
  }

  return {
    intent: bestIntent,
    confidence: bestScore,
    scores
  };
}

module.exports = {
  detectIntent,
  intentDefinitions
};
