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
import { why } from "./commands/why.js";
import { drift } from "./commands/drift.js";
import { similarDecisions } from "./commands/similar-decisions.js";
program
  .name("devarchitect")
  .description("AI-assisted project architecture and planning tool")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize devarchitect in the current project")
  .option("--from-git", "pre-fill from git history")
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
program
  .command("why <keyword>")
  .description("Search project decisions")
  .action(why);

program
  .command("similar-decisions")
  .description("Find similar architectural decisions")
  .action(similarDecisions);

program
  .command("drift")
  .description("Compare declared stack with detected stack")
  .action(drift);

program.parse();
