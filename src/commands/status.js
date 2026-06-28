import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { backupIfExist } from "../utils.js";

async function status() {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const visionPath = path.join(devarchitectdir, "vision.json");
  const analysePath = path.join(devarchitectdir, "analyse.json");
  const stackPath = path.join(devarchitectdir, "stack.json");
  const roadmapPath = path.join(devarchitectdir, "roadmap.json");
  const decisionsPath = path.join(devarchitectdir, "decisions.json");
  const progressPath = path.join(devarchitectdir, "progress.json");

  let projectName;
  let visionStat;
  let analyseStat;
  let stackStat;
  let roadmapStat;
  let decisionsStat;
  let progressStat;

  if (fs.existsSync(visionPath)) {
    const visionFileData = fs.readFileSync(visionPath, "utf-8");
    const dataVision = JSON.parse(visionFileData);
    projectName = dataVision.projectname;
    visionStat = chalk.green("✓ vision.json - initialized");
  } else {
    visionStat = chalk.red("✗ vision.json - run devarchitect init");
  }

  if (fs.existsSync(analysePath)) {
    const analyseFileData = fs.readFileSync(analysePath, "utf-8");
    const dataAnalyse = JSON.parse(analyseFileData);
    analyseStat = chalk.green("✓ analyse.json - analyzed");
  } else {
    analyseStat = chalk.red("✗ analyse.json - run devarchitect analyse");
  }

  if (fs.existsSync(stackPath)) {
    const stackFileData = fs.readFileSync(stackPath, "utf-8");
    const dataStack = JSON.parse(stackFileData);
    stackStat = chalk.green("✓ stack.json - stack defined");
  } else {
    stackStat = chalk.red("✗ stack.json - run devarchitect stack");
  }

  if (fs.existsSync(roadmapPath)) {
    const roadmapFileData = fs.readFileSync(roadmapPath, "utf-8");
    const dataRoadmap = JSON.parse(roadmapFileData);
    roadmapStat = chalk.green("✓ roadmap.json - roadmap defined");
  } else {
    roadmapStat = chalk.red("✗ roadmap.json - run devarchitect roadmap");
  }

  if (fs.existsSync(decisionsPath)) {
    const decisionsFileData = fs.readFileSync(decisionsPath, "utf-8");
    const dataDecisions = JSON.parse(decisionsFileData);
    decisionsStat = chalk.green("✓ decisions.json - decisions recorded");
  } else {
    decisionsStat = chalk.red("✗ decisions.json - run devarchitect decision");
  }
  if (fs.existsSync(progressPath)) {
    const progressFileData = fs.readFileSync(progressPath, "utf-8");
    const dataProgress = JSON.parse(progressFileData);
    progressStat = chalk.green("✓ progress.json - progress recorded");
  } else {
    progressStat = chalk.red("✗ progress.json - run devarchitect progress");
  }
  console.log(`Project: ${projectName}`);
  console.log("-----------------------------");
  console.log(visionStat);
  console.log(analyseStat);
  console.log(stackStat);
  console.log(roadmapStat);
  console.log(decisionsStat);
  console.log(progressStat);
}

export { status };
