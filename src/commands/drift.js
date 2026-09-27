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

  const issues =
    Object.keys(comparison.missing).length +
    Object.keys(comparison.undeclared).length;

  const driftPath = path.join(devarchitectDir, "drift.json");

  let shouldWrite = true;
  if (fs.existsSync(driftPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(driftPath, "utf-8"));
      const sameMatched =
        JSON.stringify(existing.matched) === JSON.stringify(comparison.matched);
      const sameMissing =
        JSON.stringify(existing.missing) === JSON.stringify(comparison.missing);
      const sameUndeclared =
        JSON.stringify(existing.undeclared) ===
        JSON.stringify(comparison.undeclared);

      if (sameMatched && sameMissing && sameUndeclared) {
        shouldWrite = false;
      }
    } catch {
      shouldWrite = true;
    }
  }

  if (shouldWrite) {
    const driftData = {
      matched: comparison.matched,
      missing: comparison.missing,
      undeclared: comparison.undeclared,
      issues,
      checkedAt: new Date().toISOString(),
    };
    fs.writeFileSync(driftPath, JSON.stringify(driftData, null, 2), "utf-8");
  }

  if (issues === 0) {
    console.log(chalk.green("No architectural drift detected."));
  } else {
    console.log(
      chalk.yellow(
        `${issues} drift issue(s) detected. Run 'devarchitect view drift' for details.`,
      ),
    );
  }
}

export { drift };
