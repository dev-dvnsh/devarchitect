import fs from "fs";
import path from "path";
import { checkPrereq } from "../utils.js";
import chalk from "chalk";

import {
  tokenize,
  buildVocabulary,
  computeTFIDF,
  cosineSimilarity,
} from "../lib/similarity.js";

async function similarDecisions() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const decisionPath = path.join(devarchitectDir, "decisions.json");

  checkPrereq("decisions.json", "decision");

  const decisions = JSON.parse(fs.readFileSync(decisionPath, "utf-8"));
  const tokenizedDocs = decisions.map((decision) => {
    const text = `${decision.what} ${decision.why} ${decision.alternatives}`;

    return tokenize(text);
  });

  const vocabulary = buildVocabulary(tokenizedDocs);

  const tfidfVectors = tokenizedDocs.map((doc) => {
    return computeTFIDF(doc, vocabulary, tokenizedDocs);
  });

  for (let i = 0; i < tfidfVectors.length; i++) {
    for (let j = i + 1; j < tfidfVectors.length; j++) {
      const similarity = cosineSimilarity(tfidfVectors[i], tfidfVectors[j]);

      if (similarity > 0.15) {
        console.log(
          chalk.cyan(`\nSimilarity: ${(similarity * 100).toFixed(2)}%`),
        );

        console.log(chalk.yellow(`\nDecision ${i + 1}`));
        console.log(`What: ${decisions[i].what}`);
        console.log(`Why: ${decisions[i].why}`);
        console.log(`Alternatives: ${decisions[i].alternatives}`);

        console.log(chalk.yellow(`\nDecision ${j + 1}`));
        console.log(`What: ${decisions[j].what}`);
        console.log(`Why: ${decisions[j].why}`);
        console.log(`Alternatives: ${decisions[j].alternatives}`);
      }
    }
  }
}
export { similarDecisions };
