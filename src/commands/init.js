import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

async function init() {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");

  const visionpath = path.join(devarchitectdir, "vision.json");

  // 1. check if already initialized
  if (fs.existsSync(visionpath)) {
    console.log(chalk.green("vision.json already exist"));
    process.exit(1);
  }

  // 2. ask questions
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectname",
      message: "enter name of your project!",

      validate: (input) => {
        if (!input.match(/^[a-z0-9-]+$/)) {
          return "project name can only contain lowercase letters, numbers, and dashes";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "problem",
      message: "describe the problem it solves!",
    },
    {
      type: "input",
      name: "target",
      message: "who is this project for",
    },
    {
      type: "list",
      name: "platform",
      message: "choose a platform!",
      choices: ["web", "mobile", "cli", "desktop"],
    },
    {
      type: "number",
      name: "teamsize",
      message: "enter the size of your team",
    },
  ]);

  // 3. create the folder
  fs.mkdirSync(devarchitectdir, { recursive: true });

  // 4. build the data object with timestamp
  const vision = {
    ...answers,
    createdat: new Date().toISOString(),
  };

  // 5. write to vision.json
  // use json.stringify(vision, null, 2) to make it readable
  // use path.join(devarchitectdir, 'vision.json') for the file path
  // use fs.writefilesync — simpler than writefile for now

  const visionstring = JSON.stringify(vision, null, 2);

  fs.writeFileSync(visionpath, visionstring, "utf-8");

  console.log(chalk.yellow("Saved to .devarchitect/vision.json"));
  // 6. print success message
}

export { init };
