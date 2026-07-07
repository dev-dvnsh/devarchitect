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
import { dashboard } from "./commands/dashboard.js";

program
  .name("devarchitect")
  .description("AI-assisted project architecture and planning tool")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize devarchitect in the current project")
  .action(init);

program
  .command("export")
  .description("Export project data as a markdown report")
  .action(exportVision);

program
  .command("analyse")
  .description("Analyse project feasibility")
  .action(analyse);

program
  .command("stack")
  .description("Define your technology stack")
  .action(stack);

program
  .command("roadmap")
  .description("Create a project roadmap")
  .action(roadmap);

program
  .command("decision")
  .description("Record an architectural decision")
  .action(decision);
program
  .command("progress")
  .description("Update project progress")
  .action(progress);
program
  .command("status")
  .description("Show project health status")
  .action(status);
program
  .command("dashboard")
  .description("Open the devarchitect dashboard")
  .action(dashboard);
program.parse();
