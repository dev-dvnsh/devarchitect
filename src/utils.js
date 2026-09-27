import fs from "fs";
import chalk from "chalk";
import path from "path";

function checkPrereq(filename, commandName) {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const filePath = path.join(devarchitectdir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`Please run devarchitect ${commandName} first`));
    process.exit();
  }
}

function pruneBackups(backupSubDir, maxBackups = 5) {
  if (!fs.existsSync(backupSubDir)) return;

  const files = fs
    .readdirSync(backupSubDir)
    .filter((file) => file.endsWith(".bak"))
    .sort();

  if (files.length > maxBackups) {
    const filesToDelete = files.slice(0, files.length - maxBackups);
    for (const file of filesToDelete) {
      fs.unlinkSync(path.join(backupSubDir, file));
    }
  }
}

function backupIfExists(filePath, command) {
  const projectroot = process.cwd();
  const devarchitectdir = path.join(projectroot, ".devarchitect");
  const dirPath = path.join(devarchitectdir, "backup", command);
  const fileName = path.basename(filePath, ".json");
  const newFilePath = path.join(
    dirPath,
    fileName +
      "." +
      new Date().toISOString().slice(0, 19).replaceAll(":", "-") +
      ".bak",
  );
  if (fs.existsSync(filePath)) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.copyFileSync(filePath, newFilePath);
    pruneBackups(dirPath, 5);
  }
}

export { checkPrereq, backupIfExists, pruneBackups };
