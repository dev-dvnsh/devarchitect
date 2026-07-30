import { normalizeStackValue } from "./normalizeStackValue.js";
import { resolvePackageName } from "./resolvePackageName.js";
export function compareStacks(declaredStack, detectedStack, categoryMap) {
  const result = {
    matched: {},
    missing: {},
    undeclared: {},
    misc: [],
  };

  // Compare declared against detected
  for (const category in declaredStack) {
    if (category === "createdAt") {
      continue;
    }

    const declaredPackages = declaredStack[category] || [];
    const detectedPackages = detectedStack[category] || [];

    const normalizedDetected = detectedPackages.map((packageName) =>
      normalizeStackValue(packageName),
    );

    for (const packageName of declaredPackages) {
      const resolvedDeclared = resolvePackageName(
        packageName,
        category,
        categoryMap,
      );

      if (normalizedDetected.includes(resolvedDeclared)) {
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
    const detectedPackages = detectedStack[category] || [];
    const declaredPackages = declaredStack[category] || [];

    const resolvedDeclared = declaredPackages.map((packageName) =>
      resolvePackageName(packageName, category, categoryMap),
    );

    for (const packageName of detectedPackages) {
      const normalizedDetected = normalizeStackValue(packageName);

      if (!resolvedDeclared.includes(normalizedDetected)) {
        if (!result.undeclared[category]) {
          result.undeclared[category] = [];
        }

        result.undeclared[category].push(packageName);
      }
    }
  }

  return result;
}
