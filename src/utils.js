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

function backupIfExist(filePath, command) {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const dirPath = path.join(devarchitectdir, "backup", command);
  const fileName = path.basename(filePath, ".json");
  const newFilePath = path.join(
    dirPath,
    fileName +
      "." +
      new Date().toISOString().slice(0, 16).replaceAll(":", "-") +
      ".bak",
  );
  if (fs.existsSync(filePath)) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.copyFileSync(filePath, newFilePath);
  }
}

export { checkPrereq, backupIfExist };
