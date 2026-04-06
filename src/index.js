#!/usr/bin/env node

import { Command } from "commander";
const program = new Command();
import { init } from "./commands/init.js";
import { exportVision } from "./commands/export.js";
// const args = process.argv.slice(2);

// const options = args.filter((a) => a.startsWith("-"));
// const values = args.filter((a) => !a.startsWith("-"));
// console.log(args);
program
  .name("devarchitect")
  .description("AI-assisted project architecture and planning tool")
  .version("0.1.0");

program
  .command("init")
  .description("Initialized devarchitect in the current project")
  .action(init);

program
  .command("export")
  .description("Exports the vision.json file as devarchitect-report.md")
  .action(exportVision);
program.parse();
