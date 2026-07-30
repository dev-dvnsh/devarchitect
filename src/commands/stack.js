import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { checkPrereq, backupIfExists } from "../utils.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "..");
const libDir = path.join(srcDir, "lib");
import { getCategoryChoices, hasCategory } from "../lib/getCategoryChoices.js";
import { processCategoryAnswer } from "../lib/processCategoryAnswer.js";
import { getCategories } from "../lib/getCategories.js";
const packageCategoryMap = JSON.parse(
  fs.readFileSync(path.join(libDir, "packageCategoryMap.json"), "utf-8"),
);
const categories = getCategories(packageCategoryMap);
const categoryChoices = [
  {
    name: "Not decided yet",
    value: "__NOT_DECIDED__",
  },
  {
    name: "Enter category manually",
    value: "__MANUAL_CATEGORY__",
  },
  ...categories.map((category) => ({
    name: category,
    value: category,
  })),
];

async function stack() {
  const rootDir = process.cwd();
  const devarchitectDir = path.join(rootDir, ".devarchitect");
  const stackPath = path.join(devarchitectDir, "stack.json");
  checkPrereq("vision.json", "init");
  checkPrereq("analyse.json", "analyse");
  const categoryAnswers = await inquirer.prompt([
    {
      type: "checkbox",
      name: "categories",
      message:
        "What technology categories do you want to define? (Space to select, Enter to confirm)",
      choices: categoryChoices,
    },
  ]);
  const selectedCategories = [...categoryAnswers.categories];

  if (selectedCategories.includes("__MANUAL_CATEGORY__")) {
    selectedCategories.splice(
      selectedCategories.indexOf("__MANUAL_CATEGORY__"),
      1,
    );

    let addAnother = true;

    while (addAnother) {
      const manualCategory = await inquirer.prompt([
        {
          type: "input",
          name: "category",
          message: "Enter your category name:",
          validate: (value) => {
            const category = value.trim().toLowerCase();

            if (!category) {
              return "Category cannot be empty";
            }

            const alreadyExists = selectedCategories.some(
              (existingCategory) => existingCategory.toLowerCase() === category,
            );

            if (alreadyExists) {
              return "This category has already been selected";
            }

            return true;
          },
        },
      ]);

      selectedCategories.push(manualCategory.category.trim());

      const anotherAnswer = await inquirer.prompt([
        {
          type: "confirm",
          name: "addAnother",
          message: "Add another custom category?",
          default: false,
        },
      ]);

      addAnother = anotherAnswer.addAnother;
    }
  }

  const categoriesToProcess = selectedCategories.filter(
    (category) =>
      category !== "__MANUAL_CATEGORY__" && category !== "__NOT_DECIDED__",
  );
  const stackAnswers = {};

  for (const category of categoriesToProcess) {
    const knownCategory = hasCategory(packageCategoryMap, category);

    if (!knownCategory) {
      const answer = await inquirer.prompt([
        {
          type: "checkbox",
          name: "technologies",
          message:
            `What ${category} technologies are you using? ` +
            "(Space to select, Enter to confirm)",
          choices: [
            {
              name: "Not decided yet",
              value: "__NOT_DECIDED__",
            },
            {
              name: "Enter manually",
              value: "__MANUAL__",
            },
          ],
        },
      ]);

      stackAnswers[category] = await processCategoryAnswer(
        answer.technologies,
        category,
      );

      continue;
    }
    const choices = getCategoryChoices(packageCategoryMap, category);

    const answer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "technologies",
        message:
          `What ${category} technologies are you using? ` +
          "(Space to select, Enter to confirm)",
        choices,
      },
    ]);

    stackAnswers[category] = await processCategoryAnswer(
      answer.technologies,
      category,
    );
  }
  const stackWithDate = {
    ...stackAnswers,
    createdAt: new Date().toISOString(),
  };

  const stackString = JSON.stringify(stackWithDate, null, 2);

  backupIfExists(stackPath, "stack");

  fs.writeFileSync(stackPath, stackString, "utf-8");

  console.log(chalk.green("Saved to .devarchitect/stack.json"));
}

export { stack };
