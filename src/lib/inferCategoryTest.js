import fs from "fs";

import { inferCategory } from "./inferCategory.js";
const packageCategoryMap = JSON.parse(
  fs.readFileSync("./src/lib/packageCategoryMap.json", "utf-8"),
);
const result1 = inferCategory(
  "Use expressjs instead of nextjs",
  packageCategoryMap,
);

console.log("Test 1:", result1);
const result2 = inferCategory(
  "We need a database for storing users",
  packageCategoryMap,
);

console.log("Test 2:", result2);
const result3 = inferCategory("We decided to use MONGODB", packageCategoryMap);

console.log("Test 3:", result3);
const result4 = inferCategory(
  "We decided to keep the implementation simple",
  packageCategoryMap,
);

console.log("Test 4:", result4);
