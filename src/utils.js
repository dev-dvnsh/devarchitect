import fs from "fs";
import chalk from "chalk";
import path from "path";

function checkPrereq(filename, commandName) {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const filePath = path.join(devarchitectdir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`Please run devarchitech ${commandName} first`));
    process.exit();
  }
}

export { checkPrereq };
