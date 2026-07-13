import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq, backupIfExists } from "../utils.js";

async function analyse() {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  checkPrereq("vision.json", "init");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "techrisk",
      message: "What are the main technical risks?",
    },
    {
      type: "list",
      name: "timeline",
      message: "What is your timeline",
      choices: ["1 month", "3 months", "6 months", "1 year"],
    },
    {
      type: "list",
      name: "scale",
      message: "What is your expected scale",
      choices: ["small", "medium", "large"],
    },
    {
      type: "list",
      name: "budget",
      message: "What is your budget",
      choices: ["low", "medium", "high"],
    },
  ]);
  const analyseData = {
    ...answers,
    createdAt: new Date().toISOString(),
  };

  const analyseString = JSON.stringify(analyseData, null, 2);
  const analysePath = path.join(devarchitectdir, "analyse.json");
  backupIfExists(analysePath, "analyse");

  fs.writeFileSync(analysePath, analyseString, "utf-8");

  console.log(chalk.green("Saved to .devarchitect/analyse.json"));
}

export { analyse };
