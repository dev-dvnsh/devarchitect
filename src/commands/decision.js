import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";
async function decision() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const visionPath = path.join(devarchitectDir, "vision.json");
  const decisionsPath = path.join(devarchitectDir, "decisions.json");
  checkPrereq("vision.json", "init");

  const promptAns = await inquirer.prompt([
    {
      type: "input",
      name: "what",
      message: "What was the decision?\n",
    },
    {
      type: "input",
      name: "why",
      message: "Why was the decision made?\n",
    },
    {
      type: "input",
      name: "alternatives",
      message: "What alternatives were considered?\n",
    },
  ]);
  // check if file exists and read it, otherwise start fresh
  const existing = fs.existsSync(decisionsPath)
    ? JSON.parse(fs.readFileSync(decisionsPath, "utf-8"))
    : [];

  const decisionsArray = Array.isArray(existing) ? existing : [];

  decisionsArray.push({
    ...promptAns,
    decidedAt: new Date().toISOString(),
  });

  fs.writeFileSync(
    decisionsPath,
    JSON.stringify(decisionsArray, null, 2),
    "utf-8",
  );

  console.log(
    chalk.yellow(
      "Decision recorded.\nAppended to .devarchitect/decisions.json",
    ),
  );
}

export { decision };
