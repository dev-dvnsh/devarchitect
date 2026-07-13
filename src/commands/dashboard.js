import path from "path";
import open from "open";
import chalk from "chalk";
import { fileURLToPath } from "node:url";
import { checkPrereq } from "../utils.js";
import { spawn } from "node:child_process";
import { dirname } from "node:path";

async function dashboard() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  checkPrereq("vision.json", "init");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  spawn("node", [path.join(__dirname, "..", "server", "index.js")], {
    stdio: "inherit", // server logs show in your terminal
  });

  await delay(1500);
  await open("http://localhost:3001");

  console.log(chalk.green("Dashboard running at http://localhost:3001"));
  console.log(chalk.red("Press Ctrl+C to stop"));
}

export { dashboard };
