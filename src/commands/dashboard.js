import path from "path";
import open from "open";
import chalk from "chalk";
import { checkPrereq } from "../utils.js";
import { spawn } from "node:child_process";

async function dashboard() {
  checkPrereq("vision.json", "init");

  console.log(chalk.green("Starting devarchitect dashboard..."));
  console.log(chalk.red("Press Ctrl+C to stop"));

  await open("http://localhost:3001");

  spawn("node", [path.join(process.cwd(), "src", "server", "index.js")], {
    stdio: "inherit", // server logs show in your terminal
  });
}

export { dashboard };
