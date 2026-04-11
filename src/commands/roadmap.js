import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
async function roadmap() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const visionPath = path.join(devarchitectDir, "vision.json");
  const analysePath = path.join(devarchitectDir, "analyse.json");
  const stackPath = path.join(devarchitectDir, "techstack.json");
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

  const askTotalPhases = await inquirer.prompt({
    type: "number",
    name: "phasesno",
    message: "How many phases does your project have?",
  });
  const totalPhases = askTotalPhases.phasesno;
  const phaseArray = [];

  for (var i = 0; i < totalPhases; i++) {
    console.log(i + 1);
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: `Please enter the name for phase ${i + 1}\n`,
      },
      {
        type: "input",
        name: "milestone",
        message: `Please enter the milestone for phase ${i + 1}\n`,
      },
    ]);
    const phaseObj = {
      phase: `${i + 1}`,
      name: `${response.name}`,
      milestones: `${response.milestone}`,
    };
    phaseArray.push(phaseObj);
  }
  const objOfPhaseArray = { phaseArray };
  const objWithCreatedAt = {
    ...objOfPhaseArray,
    createdAt: new Date().toISOString(),
  };

  const roadmapString = JSON.stringify(objWithCreatedAt, null, 2);
  fs.writeFileSync(roadmapPath, roadmapString, "utf-8");

  console.log(
    chalk.yellow(`Roadmap created\nSaved to .devarchitect/roadmap.json`),
  );
}

export { roadmap };
