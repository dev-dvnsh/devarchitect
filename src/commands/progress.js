import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { checkPrereq } from "../utils.js";
async function progress() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const roadmapPath = path.join(devarchitectDir, "roadmap.json");
  const progressPath = path.join(devarchitectDir, "progress.json");

  checkPrereq("vision.json", "init");
  checkPrereq("roadmap.json", "roadmap");

  const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, "utf-8"));
  const phaseChoices = roadmapData.phaseArray.map((p) => p.name);
  const progressFileArray = JSON.parse(fs.readFileSync(progressPath, "utf-8"));
  const countForProgressElem = progressFileArray.length + 1;
  console.log(countForProgressElem);

  const { currentPhase } = await inquirer.prompt([
    {
      type: "list",
      name: "currentPhase",
      message: "Which phase are you currently in?",
      choices: phaseChoices,
    },
  ]);

  const selectedPhase = roadmapData.phaseArray.find(
    (p) => p.name === currentPhase,
  );

  // console.log(selectedPhase?.milestones ?? []);

  const rest = await inquirer.prompt([
    {
      type: "checkbox",
      name: "completedMilestones",
      message: "Which milestones are complete?",
      choices: selectedPhase?.milestones ?? [],
    },
    {
      type: "input",
      name: "blockers",
      message: "Any blockers",
    },
    {
      type: "list",
      name: "completion",
      message: "Overall completion percentage",
      choices: ["0%", "25%", "50%", "75%", "100%"],
    },
  ]);

  const existing = fs.existsSync(progressPath)
    ? JSON.parse(fs.readFileSync(progressPath, "utf-8"))
    : [];

  const progressArray = Array.isArray(existing) ? existing : [];
  progressArray.push({
    commandRunCount: countForProgressElem,
    currentPhase,
    ...rest,
    recordedAt: new Date().toISOString(),
  });

  fs.writeFileSync(
    progressPath,
    JSON.stringify(progressArray, null, 2),
    "utf-8",
  );

  console.log(chalk.green("Progress updated"));
  console.log(chalk.gray("Saved to .devarchitect/progress.json"));
}

export { progress };
