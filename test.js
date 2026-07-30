import { detectStack } from "./src/lib/detectStack.js";
import fs from "fs";
import { compareStacks } from "./src/lib/compareStack.js";
import { reportGenerator } from "./src/lib/reportGenerator.js";

const res = reportGenerator(
  compareStacks(
    JSON.parse(fs.readFileSync("./.devarchitect/stack.json")),
    detectStack(process.cwd()),
  ),
);
console.log(res);
