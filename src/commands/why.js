import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";

async function why(keyword) {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const decisionsPath = path.join(devarchitectDir, "decisions.json");
  checkPrereq("decisions.json", "decision");

  const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf-8"));

  const normalizedKeyword = keyword.toLowerCase();

  const results = decisions.filter((decision) => {
    const textMatch =
      decision.what.toLowerCase().includes(normalizedKeyword) ||
      decision.why.toLowerCase().includes(normalizedKeyword) ||
      decision.alternatives.toLowerCase().includes(normalizedKeyword);
    const categoryMatch =
      decision.category?.toLowerCase() === normalizedKeyword;

    return textMatch || categoryMatch;
  });
  results.sort((a, b) => new Date(b.decidedAt) - new Date(a.decidedAt));
  if (results.length === 0) {
    console.log(chalk.yellow(`No decisions found for "${keyword}".`));
    return;
  }

  results.forEach((decision, index) => {
    console.log(`\nDecision ${index + 1}`);
    console.log(`What: ${decision.what}`);
    console.log(`Why: ${decision.why}`);
    console.log(`Alternatives: ${decision.alternatives}`);
    console.log(
      chalk.dim(`Decided: ${new Date(decision.decidedAt).toLocaleString()}`),
    );
  });
}

export { why };
