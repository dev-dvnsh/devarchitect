const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "we",
  "use",
  "used",
  "using",
  "to",
  "of",
  "in",
  "for",
  "and",
  "or",
  "on",
  "with",
  "this",
  "that",
  "it",
  "as",
  "be",
  "by",
  "from",
]);
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1)
    .filter((word) => !STOPWORDS.has(word));
}

function buildVocabulary(tokenizedDocs) {
  const vocabulary = new Set();

  for (const doc of tokenizedDocs) {
    for (const word of doc) {
      vocabulary.add(word);
    }
  }

  return [...vocabulary].sort();
}

function computeTFIDF(tokenizedDoc, vocabulary, allDocs) {
  const totalWords = tokenizedDoc.length;

  return vocabulary.map((word) => {
    // TF: how often the word appears in this document
    const wordCount = tokenizedDoc.filter((token) => token === word).length;

    const tf = totalWords === 0 ? 0 : wordCount / totalWords;

    // IDF: how many documents contain this word
    const documentsContainingWord = allDocs.filter((doc) =>
      doc.includes(word),
    ).length;

    const idf =
      documentsContainingWord === 0
        ? 0
        : Math.log(allDocs.length / documentsContainingWord);

    return tf * idf;
  });
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export { tokenize, buildVocabulary, computeTFIDF, cosineSimilarity };
