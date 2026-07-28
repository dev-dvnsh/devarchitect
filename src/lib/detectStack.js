import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { extractPackages } from "./extractPackages.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import manifestMap from "./manifestMap.json" assert { type: "json" };
// import packageCategoryMap from "./packageCategoryMap.json" assert { type: "json" };

const manifestMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "ecosystemManifestMap.json"), "utf-8"),
);
const packageCategoryMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packageCategoryMap.json"), "utf-8"),
);

export function detectStack(projectRoot) {
  const categories = {};
  const detectedStack = {};
  const misc = [];
  const projectFiles = fs.readdirSync(projectRoot);

  for (const ecosystem in manifestMap) {
    const manifests = manifestMap[ecosystem];

    const found = manifests.some((manifest) => projectFiles.includes(manifest));

    if (!found) {
      continue;
    }

    const manifestFile = manifests.find((manifest) =>
      projectFiles.includes(manifest),
    );

    const manifestPath = path.join(projectRoot, manifestFile);

    const packages = extractPackages(ecosystem, manifestPath);

    const ecosystemMap = packageCategoryMap[ecosystem];

    if (!ecosystemMap) {
      continue;
    }

    for (const packageName of packages) {
      const category = ecosystemMap[packageName];

      if (!category) {
        misc.push(packageName);
        continue;
      }

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push(packageName);
    }
  }

  Object.assign(detectedStack, categories);

  if (misc.length > 0) {
    detectedStack.misc = misc;
  }
  return detectedStack;
}
