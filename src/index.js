#!/usr/bin/env node

const inquirer = require("inquirer");
const { Command } = require("commander");
const program = new Command();
const { init } = require("./commands/init");

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
  .action(() => {
    init();
  });

program.parse();
