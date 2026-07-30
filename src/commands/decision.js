import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq, backupIfExists } from "../utils.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "..");
const libDir = path.join(srcDir, "lib");

const packageCategoryMap = JSON.parse(
  fs.readFileSync(path.join(libDir, "packageCategoryMap.json"), "utf-8"),
);

import { inferCategory } from "../lib/inferCategory.js";

async function decision() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const decisionsPath = path.join(devarchitectDir, "decisions.json");
  checkPrereq("vision.json", "init");

  const promptAns = await inquirer.prompt([
    {
      type: "input",
      name: "what",
      message: "What was the decision?",
    },
    {
      type: "input",
      name: "why",
      message: "Why was the decision made?",
    },
    {
      type: "input",
      name: "alternatives",
      message: "What alternatives were considered?",
    },
  ]);
  // check if file exists and read it, otherwise start fresh
  const existing = fs.existsSync(decisionsPath)
    ? JSON.parse(fs.readFileSync(decisionsPath, "utf-8"))
    : [];

  const decisionsArray = Array.isArray(existing) ? existing : [];
  const decisionText = `${promptAns.what} ${promptAns.alternatives} ${promptAns.why}`;
  const category = inferCategory(decisionText, packageCategoryMap);

  const decisionEntry = {
    ...promptAns,
    decidedAt: new Date().toISOString(),
  };

  if (category) {
    decisionEntry.category = category;
  }
  decisionsArray.push(decisionEntry);

  backupIfExists(decisionsPath, "decision");

  fs.writeFileSync(
    decisionsPath,
    JSON.stringify(decisionsArray, null, 2),
    "utf-8",
  );

  console.log(
    chalk.green("Decision recorded.\nAppended to .devarchitect/decisions.json"),
  );
}

export { decision };
