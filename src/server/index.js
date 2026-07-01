import path from "path";
import fs from "fs";
import http from "http";

function readJson(filename) {
  const projectRoot = process.cwd();
  const devarchitectDir = path.join(projectRoot, ".devarchitect");
  const filePath = path.join(devarchitectDir, `${filename}.json`);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath);
    const parsedFileData = JSON.parse(fileData);
    return parsedFileData;
  } else {
    return null;
  }
}
