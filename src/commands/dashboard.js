import path from "path";
import open from "open";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";
import { spawn } from "node:child_process";

async function dashboard() {
  checkPrereq("vision.json", "init");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  spawn("node", [path.join(process.cwd(), "src", "server", "index.js")], {
    stdio: "inherit", // server logs show in your terminal
  });

  await delay(1500);
  await open("http://localhost:3001");

  console.log(chalk.green("Dashboard running at http://localhost:3001"));
  console.log(chalk.red("Press Ctrl+C to stop"));
}

export { dashboard };
