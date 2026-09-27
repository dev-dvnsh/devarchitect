import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { checkPrereq, backupIfExists } from "../utils.js";

async function roadmap() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const roadmapPath = path.join(devarchitectDir, "roadmap.json");

  checkPrereq("vision.json", "init");

  checkPrereq("stack.json", "stack");

  const askTotalPhases = await inquirer.prompt({
    type: "number",
    name: "phasesno",
    message: "how many phases does your project have?",
  });
  const totalPhases = askTotalPhases.phasesno;
  const phaseArray = [];

  for (let i = 0; i < totalPhases; i++) {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: `enter the name for phase ${i + 1}\n`,
      },
      {
        type: "input",
        name: "milestone",
        message: `enter the milestone for phase ${i + 1}\n (comma seperated)`,
      },
    ]);
    const phaseObj = {
      phase: `${i + 1}`,
      name: `${response.name}`,
      milestones: response.milestone.split(",").map((m) => m.trim()),
    };
    phaseArray.push(phaseObj);
  }
  const roadmapData = {
    phaseArray,
    createdAt: new Date().toISOString(),
  };

  const roadmapString = JSON.stringify(roadmapData, null, 2);
  backupIfExists(roadmapPath, "roadmap");
  fs.writeFileSync(roadmapPath, roadmapString, "utf-8");

  console.log(
    chalk.green(`Roadmap created\nSaved to .devarchitect/roadmap.json`),
  );
}

export { roadmap };
