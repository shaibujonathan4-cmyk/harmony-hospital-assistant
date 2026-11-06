const corrections = {
  cam: "can",
  wat: "what",
  wen: "when",
  wats: "what",
  hw: "how",
  pls: "please",
  plz: "please",
  u: "you",
  ur: "your",
  hosp: "hospital",
  appointmnt: "appointment",
  appoinment: "appointment",
  docter: "doctor",
  docotr: "doctor",
  doctrs: "doctors",
  vist: "visit",
  visitting: "visiting",
  recieve: "receive",
  reciept: "receipt",
  labrotory: "laboratory",
  laborator: "laboratory",
  emergncy: "emergency",
  emergeny: "emergency",
  registation: "registration",
  regstration: "registration",
  consulation: "consultation",
  consultaton: "consultation",
  cardioligist: "cardiologist",
  cardiologyst: "cardiologist",
  paediatrican: "paediatrician",
  pediatritian: "paediatrician",
  gynaecoligist: "gynaecologist",
  gyneacologist: "gynaecologist",
  orthopaedic: "orthopaedic",
  opthalmologist: "ophthalmologist",
  ophthamologist: "ophthalmologist"
};

function normalize(input = "") {
  if (typeof input !== "string") return "";

  let text = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text.split(" ").map(word => {
    return corrections[word] || word;
  });

  return words.join(" ").trim();
}

function tokenize(input) {
  return normalize(input)
    .split(" ")
    .filter(word => word.length > 0);
}

function editDistance(a, b) {
  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function similarity(a, b) {
  const first = normalize(a);
  const second = normalize(b);

  if (!first || !second) return 0;
  if (first === second) return 1;

  const distance = editDistance(first, second);
  return 1 - distance / Math.max(first.length, second.length);
}

function fuzzyTokenMatch(first, second) {
  if (first === second) return true;

  if (first.length < 4 || second.length < 4) {
    return false;
  }

  const distance = editDistance(first, second);
  const allowedErrors = Math.max(
    1,
    Math.floor(Math.min(first.length, second.length) * 0.2)
  );

  return distance <= allowedErrors;
}

module.exports = {
  normalize,
  tokenize,
  editDistance,
  similarity,
  fuzzyTokenMatch
};
