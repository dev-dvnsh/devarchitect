import fs from "fs";

export function extractPackages(ecosystem, manifestPath) {
  if (ecosystem === "node") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifestData = JSON.parse(manifestContent);

    const dependencies = Object.keys(manifestData.dependencies || {});
    const devDependencies = Object.keys(manifestData.devDependencies || {});

    return [...dependencies, ...devDependencies];
  } else if (ecosystem == "python") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    return manifestContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split(/[=<>!~]/)[0].trim());
  } else if (ecosystem == "go") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");

    const packages = [];

    const lines = manifestContent.split("\n").map((line) => line.trim());

    let inRequireBlock = false;

    for (const line of lines) {
      if (line === "require (") {
        inRequireBlock = true;
        const manifestContent = fs.readFileSync(manifestPath, "utf-8");

        const packages = [];

        const lines = manifestContent.split("\n").map((line) => line.trim());

        let inRequireBlock = false;

        for (const line of lines) {
          if (line === "require (") {
            inRequireBlock = true;
            continue;
          }

          if (inRequireBlock && line === ")") {
            inRequireBlock = false;
            continue;
          }

          if (inRequireBlock) {
            const packageName = line.split(/\s+/)[0];
            packages.push(packageName);
            continue;
          }

          if (line.startsWith("require ")) {
            const packageName = line.replace("require ", "").split(/\s+/)[0];
            packages.push(packageName);
          }
        }

        return packages;
        continue;
      }

      if (inRequireBlock && line === ")") {
        inRequireBlock = false;
        continue;
      }

      if (inRequireBlock) {
        const packageName = line.split(/\s+/)[0];
        packages.push(packageName);
        continue;
      }

      if (line.startsWith("require ")) {
        const packageName = line.replace("require ", "").split(/\s+/)[0];
        packages.push(packageName);
      }
    }

    return packages;
  } else if (ecosystem === "rust") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");

    const packages = [];
    const lines = manifestContent.split("\n").map((line) => line.trim());

    let inDependencies = false;

    for (const line of lines) {
      if (line === "[dependencies]" || line === "[dev-dependencies]") {
        inDependencies = true;
        continue;
      }

      if (inDependencies && line.startsWith("[")) {
        inDependencies = false;
        continue;
      }

      if (!inDependencies || !line || line.startsWith("#")) {
        continue;
      }

      const packageName = line.split("=")[0].trim();
      packages.push(packageName);
    }

    return packages;
  } else if (ecosystem === "php") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifestData = JSON.parse(manifestContent);

    const dependencies = Object.keys(manifestData.require || {});
    const devDependencies = Object.keys(manifestData["require-dev"] || {});

    return [...dependencies, ...devDependencies];
  } else if (ecosystem === "java") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");

    const matches = [
      ...manifestContent.matchAll(/<artifactId>(.*?)<\/artifactId>/g),
    ];

    return matches.map((match) => match[1]);
  } else if (ecosystem === "ruby") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");

    const packages = [];

    const lines = manifestContent.split("\n").map((line) => line.trim());

    for (const line of lines) {
      if (!line.startsWith("gem ")) {
        continue;
      }

      const match = line.match(/gem\s+["']([^"']+)["']/);

      if (match) {
        packages.push(match[1]);
      }
    }

    return packages;
  } else if (ecosystem === "dotnet") {
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");

    const matches = [
      ...manifestContent.matchAll(/<PackageReference\s+Include="([^"]+)"/g),
    ];

    return matches.map((match) => match[1]);
  }
  return [];
}
