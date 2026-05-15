import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";

async function analyse() {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const visionPath = path.join(devarchitectdir, "vision.json");
  const commandPreReq = "init";
  checkPrereq("vision.json", commandPreReq);
  const visionFileData = fs.readFileSync(visionPath, "utf-8");
  const data = JSON.parse(visionFileData);
  console.log(chalk.yellow(`Analysing project: ${data.projectname}`));
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
  const analyse = {
    ...answers,
    createdat: new Date().toISOString(),
  };

  const analysestring = JSON.stringify(analyse, null, 2);
  const analysePath = path.join(devarchitectdir, "analyse.json");

  fs.writeFileSync(analysePath, analysestring, "utf-8");

  console.log(chalk.yellow("Saved to .devarchitect/analyse.json"));
}

export { analyse };
