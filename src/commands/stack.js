import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { checkPrereq } from "../utils.js";

async function stack() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const visionPath = path.join(devarchitectDir, "vision.json");
  const analysePath = path.join(devarchitectDir, "analyse.json");
  const stackPath = path.join(devarchitectDir, "stack.json");
  checkPrereq("vision.json", "init");
  checkPrereq("analyse.json", "analyse");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "frontend",
      message: "What is your frontend technology?",
    },
    {
      type: "input",
      name: "backend",
      message: "What is your backend technology?",
    },
    {
      type: "input",
      name: "database",
      message: "What is your database",
    },
    {
      type: "list",
      name: "deployment",
      message: "What is your deployment Platform",
      choices: ["AWS", "GCP", "Azure", "Vercel", "Railway", "Other"],
    },
    {
      type: "input",
      name: "tools",
      message: "Any other tools or services?",
    },
  ]);

  const stackWithDate = {
    ...answers,
    createdAt: new Date().toISOString(),
  };

  const stackString = JSON.stringify(stackWithDate, null, 2);

  fs.writeFileSync(stackPath, stackString, "utf-8");

  console.log(chalk.yellow("Saved to .devarchitect/stack.json"));
}

export { stack };
