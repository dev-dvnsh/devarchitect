import fs from "fs";
import chalk from "chalk";
import path from "path";
import { checkPrereq } from "../utils.js";
import { detectStack } from "../lib/detectStack.js";
import { compareStacks } from "../lib/compareStack.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "..");
const libDir = path.join(srcDir, "lib");

const packageCategoryMap = JSON.parse(
  fs.readFileSync(path.join(libDir, "packageCategoryMap.json"), "utf-8"),
);
async function drift() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const stackPath = path.join(devarchitectDir, "stack.json");
  checkPrereq("stack.json", "stack");

  const declaredStack = JSON.parse(fs.readFileSync(stackPath, "utf-8"));
  const detectedStack = detectStack(rootDir);
  const comparison = compareStacks(
    declaredStack,
    detectedStack,
    packageCategoryMap,
  );

  let issues = 0;

  console.log(chalk.bold("\n=== Drift Report ===\n"));
  // Matches
  for (const category in comparison.matched) {
    console.log(
      chalk.green(`✓ ${category}: ${comparison.matched[category].join(", ")}`),
    );
  }

  // Missing
  for (const category in comparison.missing) {
    issues++;

    console.log(chalk.yellow(`\n⚠ ${category}`));

    console.log(
      chalk.yellow(
        `Declared but not detected: ${comparison.missing[category].join(", ")}`,
      ),
    );
  }
  // Undeclared
  for (const category in comparison.undeclared) {
    issues++;

    console.log(chalk.red(`\n✗ ${category}`));

    console.log(
      chalk.red(
        `Detected but not declared: ${comparison.undeclared[category].join(", ")}`,
      ),
    );
  }
  const driftData = {
    matched: comparison.matched,
    missing: comparison.missing,
    undeclared: comparison.undeclared,
    issues,
    checkedAt: new Date().toISOString(),
  };

  const driftPath = path.join(devarchitectDir, "drift.json");

  fs.writeFileSync(driftPath, JSON.stringify(driftData, null, 2), "utf-8");
  console.log();

  if (issues === 0) {
    console.log(chalk.green("✓ No drift detected."));
  } else {
    console.log(chalk.red(`${issues} issue(s) detected.`));
  }
}

export { drift };
