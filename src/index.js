#!/usr/bin/env node

import { Command } from "commander";
const program = new Command();
import { init } from "./commands/init.js";
import { exportVision } from "./commands/export.js";
import { analyse } from "./commands/analyse.js";
import { stack } from "./commands/stack.js";
import { roadmap } from "./commands/roadmap.js";
import { decision } from "./commands/decision.js";
import { progress } from "./commands/progress.js";
import { status } from "./commands/status.js";

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

program
  .command("analyse")
  .description("Analyze the vision.json file")
  .action(analyse);

program
  .command("stack")
  .description(
    "Asks questions and creates .devarchitect/techstack.json with your answers and a createdAt timestamp inside.",
  )
  .action(stack);

program
  .command("roadmap")
  .description(
    "Asks how many phases, then asks name and milestones for each phase, then creates .devarchitect/roadmap.json with a phases array inside.",
  )
  .action(roadmap);

program
  .command("decision")
  .description(
    "Asks about the decision, its need and other alternatives that were considered",
  )
  .action(decision);
program
  .command("progress")
  .description(
    "Asks the programmer questions related to the roadmap to record progress and blockers to progress",
  )
  .action(progress);
program
  .command("status")
  .description("Gives a quick health check for devarchitect setup")
  .action(status);
program.parse();
