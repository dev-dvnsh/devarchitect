#!/usr/bin/env node

const inquirer = require("inquirer");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");

// const args = process.argv.slice(2);

// const options = args.filter((a) => a.startsWith("-"));
// const values = args.filter((a) => !a.startsWith("-"));
// console.log(args);

async function init() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter name of your project!",

      validate: (input) => {
        if (!input.match(/^[a-z0-9-]+$/)) {
          return "Project name can only contain lowercase letters, numbers, and dashes";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "problem",
      message: "Describe the problem it solves!",
    },
    {
      type: "input",
      name: "target!",
      message: "Who is this project for",
    },
    {
      type: "list",
      name: "platform",
      message: "Choose a platform!",
      choices: ["web", "mobile", "cli", "desktop"],
    },
    {
      type: "Number",
      name: "teamSize",
      message: "Enter the size of your team",
    },
  ]);
  console.log(answer);
}

module.exports = { init };
