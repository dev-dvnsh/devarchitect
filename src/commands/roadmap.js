import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { log } from "console";
async function roadmap() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const visionPath = path.join(devarchitectDir, "vision.json");
  const analysePath = path.join(devarchitectDir, "analyse.json");
  const stackPath = path.join(devarchitectDir, "stack.json");
  const roadmapPath = path.join(devarchitectDir, "roadmap.json");

  if (!fs.existsSync(visionPath)) {
    console.log(chalk.red("Please run devarchitect init first!"));
    process.exit(1);
  }

  if (!fs.existsSync(analysePath)) {
    console.log(chalk.red("Please run devarchitect analyse first!"));
    process.exit(1);
  }

  if (!fs.existsSync(stackPath)) {
    console.log(chalk.red("Please run devarchitect stack first!"));
    process.exit(1);
  }
}

export { roadmap };
