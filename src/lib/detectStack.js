import fs from "fs";
import path from "path";

// import manifestMap from "./manifestMap.json" assert { type: "json" };
// import packageCategoryMap from "./packageCategoryMap.json" assert { type: "json" };

const manifestMap = JSON.parse(
  fs.readFileSync("./src/lib/ecosystemManifestMap.json", "utf-8"),
);

const packageCategoryMap = JSON.parse(
  fs.readFileSync("./src/lib/packageCategoryMap.json", "utf-8"),
);

export function detectStack(projectRoot) {
  const categories = {};
  const detectedStack = {};
  const projectFiles = fs.readdirSync(projectRoot);
  for (const ecosystem in manifestMap) {
    const manifests = manifestMap[ecosystem];
    const found = manifests.some((manifest) => projectFiles.includes(manifest));
    const packages = [];
    if (found) {
      const manifestFile = manifests.find((manifest) =>
        projectFiles.includes(manifest),
      );

      const manifestPath = path.join(projectRoot, manifestFile);
      const manifestContent = fs.readFileSync(manifestPath, "utf-8");
      const manifestData = JSON.parse(manifestContent);

      const dependencies = Object.keys(manifestData.dependencies || {});
      const devDependences = Object.keys(manifestData.devDependencies || {});

      packages.push(...dependencies);
      packages.push(...devDependences);
    }
    for (const packageName of packages) {
      const ecosystemMap = packageCategoryMap[ecosystem];

      if (!ecosystemMap) {
        continue;
      }

      const category = ecosystemMap[packageName];
      if (!category) {
        continue;
      }

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(packageName);
    }
  }

  Object.assign(detectedStack, categories);
  return detectedStack;
}
