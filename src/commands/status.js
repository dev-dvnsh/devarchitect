import fs from "fs";
import path from "path";
import chalk from "chalk";

async function status() {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const visionPath = path.join(devarchitectdir, "vision.json");
  const analysePath = path.join(devarchitectdir, "analyse.json");
  const stackPath = path.join(devarchitectdir, "stack.json");
  const roadmapPath = path.join(devarchitectdir, "roadmap.json");
  const decisionsPath = path.join(devarchitectdir, "decisions.json");
  const progressPath = path.join(devarchitectdir, "progress.json");
  const driftPath = path.join(devarchitectdir, "drift.json");

  let projectName;
  let visionStat;
  let analyseStat;
  let stackStat;
  let roadmapStat;
  let decisionsStat;
  let progressStat;
  let driftStat;

  if (fs.existsSync(visionPath)) {
    const visionFileData = fs.readFileSync(visionPath, "utf-8");
    const dataVision = JSON.parse(visionFileData);
    projectName = dataVision.projectname;
    visionStat = chalk.green("✓ vision.json - initialized");
  } else {
    visionStat = chalk.red("✗ vision.json - run devarchitect init");
  }

  if (fs.existsSync(analysePath)) {
    analyseStat = chalk.green("✓ analyse.json - analyzed");
  } else {
    analyseStat = chalk.red("✗ analyse.json - run devarchitect analyse");
  }

  if (fs.existsSync(stackPath)) {
    stackStat = chalk.green("✓ stack.json - stack defined");
  } else {
    stackStat = chalk.red("✗ stack.json - run devarchitect stack");
  }

  if (fs.existsSync(roadmapPath)) {
    roadmapStat = chalk.green("✓ roadmap.json - roadmap defined");
  } else {
    roadmapStat = chalk.red("✗ roadmap.json - run devarchitect roadmap");
  }

  if (fs.existsSync(decisionsPath)) {
    decisionsStat = chalk.green("✓ decisions.json - decisions recorded");
  } else {
    decisionsStat = chalk.red("✗ decisions.json - run devarchitect decision");
  }
  if (fs.existsSync(driftPath)) {
    driftStat = chalk.green("✓ drift.json - drift checked");
  } else {
    driftStat = chalk.red("✗ drift.json - run devarchitect drift");
  }
  if (fs.existsSync(progressPath)) {
    progressStat = chalk.green("✓ progress.json - progress recorded");
  } else {
    progressStat = chalk.red("✗ progress.json - run devarchitect progress");
  }
  console.log(`Project: ${projectName ?? "No project initialized"}`);
  console.log("-----------------------------");
  console.log(visionStat);
  console.log(analyseStat);
  console.log(stackStat);
  console.log(roadmapStat);
  console.log(decisionsStat);
  console.log(progressStat);
  console.log(driftStat);
}

export { status };
