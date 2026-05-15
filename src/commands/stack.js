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
  const tectStackPath = path.join(devarchitectDir, "techstack.json");
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

  const teckStackWithDate = {
    ...answers,
    createdAt: new Date().toISOString(),
  };

  const techStackString = JSON.stringify(teckStackWithDate, null, 2);

  fs.writeFileSync(tectStackPath, techStackString, "utf-8");

  console.log(chalk.yellow("Saved to .devarchitect/techstack.json"));
}

export { stack };
