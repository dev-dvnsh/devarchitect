import fs from "fs";
import path from "path";
import chalk from "chalk";

const SECTION_MAP = {
  vision: { file: "vision.json", cmd: "init" },
  analyse: { file: "analyse.json", cmd: "analyse" },
  stack: { file: "stack.json", cmd: "stack" },
  roadmap: { file: "roadmap.json", cmd: "roadmap" },
  decision: { file: "decisions.json", cmd: "decision" },
  decisions: { file: "decisions.json", cmd: "decision" },
  progress: { file: "progress.json", cmd: "progress" },
  drift: { file: "drift.json", cmd: "drift" },
};

function view(section) {
  const key = section?.toLowerCase().trim();
  const target = SECTION_MAP[key];

  if (!target) {
    console.log(
      chalk.red(
        `Unknown section "${section}". Available sections: vision, analyse, stack, roadmap, decisions, progress, drift`,
      ),
    );
    return;
  }

  const filePath = path.join(process.cwd(), ".devarchitect", target.file);
  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red(
        `${target.file} not found. Run 'devarchitect ${target.cmd}' first.`,
      ),
    );
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  switch (target.file) {
    case "vision.json":
      console.log(chalk.bold(`\n=== Vision: ${data.projectname} ===\n`));
      console.log(`${chalk.gray("Problem:")}   ${data.problem}`);
      console.log(`${chalk.gray("Target:")}    ${data.target}`);
      console.log(`${chalk.gray("Platform:")}  ${data.platform}`);
      console.log(`${chalk.gray("Team Size:")} ${data.teamsize}`);
      break;

    case "analyse.json":
      console.log(chalk.bold("\n=== Feasibility Analysis ===\n"));
      console.log(`${chalk.gray("Tech Risks:")} ${data.techrisk}`);
      console.log(`${chalk.gray("Timeline:")}   ${data.timeline}`);
      console.log(`${chalk.gray("Scale:")}      ${data.scale}`);
      console.log(`${chalk.gray("Budget:")}     ${data.budget}`);
      break;

    case "stack.json":
      console.log(chalk.bold("\n=== Declared Tech Stack ===\n"));
      for (const [k, v] of Object.entries(data)) {
        if (k === "createdAt") continue;
        const val = Array.isArray(v) ? v.join(", ") : v;
        console.log(`${chalk.gray(`${k}:`)} ${val || "None"}`);
      }
      break;

    case "roadmap.json":
      console.log(chalk.bold("\n=== Project Roadmap ===\n"));
      data.phaseArray.forEach(({ phase, name, milestones }) => {
        console.log(chalk.cyan(`Phase ${phase}: ${name}`));
        console.log(
          `${chalk.gray("  Milestones:")} ${
            Array.isArray(milestones) ? milestones.join(", ") : milestones
          }\n`,
        );
      });
      break;

    case "decisions.json":
      console.log(chalk.bold("\n=== Decisions Log ===\n"));
      data.forEach((d, idx) => {
        console.log(chalk.cyan(`#${idx + 1} - ${d.what}`));
        console.log(`${chalk.gray("  Why:")}          ${d.why}`);
        console.log(`${chalk.gray("  Alternatives:")} ${d.alternatives}`);
        console.log(
          `${chalk.gray("  Category:")}     ${d.category ?? "Not inferred"}`,
        );
        console.log(
          `${chalk.gray("  Decided At:")}   ${new Date(d.decidedAt).toLocaleString()}\n`,
        );
      });
      break;

    case "progress.json": {
      console.log(chalk.bold("\n=== Latest Progress ===\n"));
      if (data.length === 0) {
        console.log(chalk.gray("No progress entries recorded yet."));
        break;
      }
      const latest = data[data.length - 1];
      console.log(`${chalk.gray("Current Phase:")} ${latest.currentPhase}`);
      console.log(
        `${chalk.gray("Completed:")}     ${
          Array.isArray(latest.completedMilestones)
            ? latest.completedMilestones.join(", ")
            : latest.completedMilestones
        }`,
      );
      console.log(`${chalk.gray("Blockers:")}      ${latest.blockers}`);
      console.log(`${chalk.gray("Completion:")}    ${latest.completion}`);
      console.log(
        `${chalk.gray("Recorded At:")}   ${new Date(latest.recordedAt).toLocaleString()}`,
      );
      break;
    }

    case "drift.json":
      console.log(chalk.bold("\n=== Drift Report ===\n"));
      for (const category in data.matched) {
        console.log(
          chalk.green(
            `Matched [${category}]: ${data.matched[category].join(", ")}`,
          ),
        );
      }
      for (const category in data.missing) {
        console.log(chalk.yellow(`\nMissing [${category}]`));
        console.log(
          chalk.yellow(
            `  Declared but not detected: ${data.missing[category].join(", ")}`,
          ),
        );
      }
      for (const category in data.undeclared) {
        console.log(chalk.red(`\nUndeclared [${category}]`));
        console.log(
          chalk.red(
            `  Detected but not declared: ${data.undeclared[category].join(", ")}`,
          ),
        );
      }
      console.log(
        chalk.gray(
          `\nChecked at: ${new Date(data.checkedAt).toLocaleString()}`,
        ),
      );
      if (data.issues === 0) {
        console.log(chalk.green("No drift detected."));
      } else {
        console.log(chalk.red(`${data.issues} issue(s) detected.`));
      }
      break;
  }
}

export { view };
export default view;
