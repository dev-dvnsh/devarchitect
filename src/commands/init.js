import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { backupIfExists } from "../utils.js";

async function init(options) {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");

  const visionpath = path.join(devarchitectdir, "vision.json");
  const packageJsonPath = path.join(projectroot, "package.json");

  let packageJsonData = "";
  let nameFromPackageJson = "";
  let descriptionFromPackageJson = "";

  if (fs.existsSync(packageJsonPath)) {
    packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath));
    nameFromPackageJson = packageJsonData.name;
    descriptionFromPackageJson = packageJsonData.description;
    // console.log("packageJsonData", packageJsonData);
  }
  let projectStartedAt = null;
  if (options.fromGit) {
    try {
      const gitRestult = execSync("git log --reverse --format=%ai")
        .toString()
        .split("\n");
      // projectStartedAt = gitRestult[0];
      projectStartedAt = new Date(gitRestult[0]).toISOString();
    } catch (error) {
      console.log(error);
    }
  }

  if (fs.existsSync(visionpath)) {
    // 1. check if already initialized
    console.log(chalk.green("vision.json already exist"));
    const overwriteVision = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message: "vision.json already exists. Do you want to overwrite it?",
      default: false,
    });
    if (!overwriteVision.overwrite) {
      process.exit(1);
    }
  }

  // 2. ask questions
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectname",
      message: "enter name of your project!",
      default: nameFromPackageJson,

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
      message: "what problem does it solves?",
      default: descriptionFromPackageJson,
    },
    {
      type: "input",
      name: "target",
      message: "who is this project for?",
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
      message: "what is the size of your team?",
    },
  ]);

  // 3. create the folder
  fs.mkdirSync(devarchitectdir, { recursive: true });

  // 4. build the data object with timestamp
  const vision = {
    ...answers,
    createdAt: new Date().toISOString(),
    ...(projectStartedAt ? { projectStartedAt } : {}),
  };

  const visionstring = JSON.stringify(vision, null, 2);

  backupIfExists(visionpath, "vision");

  fs.writeFileSync(visionpath, visionstring, "utf-8");

  console.log(chalk.green("Saved to .devarchitect/vision.json"));
}

export { init };
