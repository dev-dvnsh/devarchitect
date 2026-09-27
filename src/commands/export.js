import fs from "fs";
import path from "path";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";
import { generateReport } from "../lib/reportGenerator.js";

function exportVision() {
  const projectRoot = process.cwd();
  checkPrereq("vision.json", "init");

  const mdString = generateReport(projectRoot);
  fs.writeFileSync(
    path.join(projectRoot, "devarchitect-report.md"),
    mdString,
    "utf-8",
  );
  console.log(chalk.yellow("Saved to devarchitect-report.md"));
}

export { exportVision };
export default exportVision;
