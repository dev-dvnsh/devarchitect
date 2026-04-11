import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

async function decision() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const visionPath = path.join(devarchitectDir, "vision.json");
  const decisionPath = path.join(devarchitectDir, "decisions.json");

  if (!fs.existsSync(visionPath)) {
    console.log(chalk.red("Please run devarchitect init first"));
  }
}

export { decision };
