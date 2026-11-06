const hospital = require("../data/hospital.json");
const { normalize, tokenize, fuzzyTokenMatch } = require("./normalizer");

const specialistAliases = {
  cardiologist: [
    "heart", "heart doctor", "heart specialist",
    "heart problems", "cardiology"
  ],
  neurologist: [
    "brain", "brain doctor", "nerve specialist",
    "brain problems", "neurology"
  ],
  paediatrician: [
    "pediatrician", "children doctor",
    "child specialist", "baby doctor"
  ],
  gynaecologist: [
    "gynecologist", "women doctor",
    "female reproductive specialist"
  ],
  "orthopaedic surgeon": [
    "bone", "bones", "bone doctor",
    "bone specialist", "bone problems",
    "joint specialist", "joint problems",
    "bone pain", "orthopaedics"
  ],
  ophthalmologist: ["eye doctor", "eye specialist"],
  urologist: ["urinary doctor", "urine specialist"],
  psychiatrist: ["mental health doctor", "mental health specialist"],
  dermatologist: ["skin doctor", "skin specialist"],
  gastroenterologist: ["stomach doctor", "digestive specialist"],
  nephrologist: [
    "kidney", "kidneys", "kidney doctor",
    "kidney specialist", "kidney problems"
  ],
  pulmonologist: ["lung doctor", "lung specialist"],
  haematologist: ["blood doctor", "blood specialist"],
  endocrinologist: ["hormone doctor", "hormone specialist"],
  "ent specialist": [
    "ear doctor", "nose doctor", "throat doctor"
  ],
  "general surgeon": ["surgeon", "surgery specialist"],
  nutritionist: ["dietitian", "diet specialist"],
  physiotherapist: [
    "physio", "physical therapist", "rehabilitation specialist"
  ]
};

function containsPhrase(text, phrase) {
  const normalizedPhrase = normalize(phrase);
  return normalizedPhrase && ` ${text} `.includes(` ${normalizedPhrase} `);
}

function findSpecialist(message) {
  const text = normalize(message);

  for (const [name, aliases] of Object.entries(specialistAliases)) {
    const specialist = hospital.specialists.find(
      item => normalize(item.name) === normalize(name)
    );

    if (!specialist) continue;

    if (
      containsPhrase(text, name) ||
      aliases.some(alias => containsPhrase(text, alias))
    ) {
      return specialist;
    }
  }

  return null;
}

function extractEntities(message) {
  const text = normalize(message);
  const words = tokenize(text);

  const specialist = findSpecialist(text);

  const mentionedEntities = {
    specialist: specialist || null,
    hospital: /\bhospital\b/.test(text),
    doctor: /\b(doctor|doctors|physician)\b/.test(text),
    appointment: /\b(appointment|booking|book|schedule)\b/.test(text),
    time: /\b(when|time|hour|hours|today|tomorrow)\b/.test(text),
    location: /\b(where|address|location|direction|directions)\b/.test(text),
    payment: /\b(cost|price|fee|fees|pay|payment|charge)\b/.test(text)
  };

  return mentionedEntities;
}

module.exports = {
  findSpecialist,
  extractEntities,
  specialistAliases
};
