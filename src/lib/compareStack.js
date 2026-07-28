import fs from "fs";
import { detectStack } from "./detectStack.js";
export function compareStacks(declaredStack, detectedStack) {
  const result = {
    matched: {},
    missing: {},
    undeclared: {},
    misc: [],
  };
  // Compare declared against detected
  for (const category in declaredStack) {
    const declaredPackages = declaredStack[category];
    const detectedPackages = detectedStack[category] || [];

    for (const packageName of declaredPackages) {
      if (detectedPackages.includes(packageName)) {
        if (!result.matched[category]) {
          result.matched[category] = [];
        }

        result.matched[category].push(packageName);
      } else {
        if (!result.missing[category]) {
          result.missing[category] = [];
        }

        result.missing[category].push(packageName);
      }
    }
  }

  // Find undeclared packages
  for (const category in detectedStack) {
    const detectedPackages = detectedStack[category];
    const declaredPackages = declaredStack[category] || [];

    for (const packageName of detectedPackages) {
      if (!declaredPackages.includes(packageName)) {
        if (!result.undeclared[category]) {
          result.undeclared[category] = [];
        }

        result.undeclared[category].push(packageName);
      }
    }
  }

  return result;
}
