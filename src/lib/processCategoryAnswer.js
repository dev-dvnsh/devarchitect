import inquirer from "inquirer";

export async function processCategoryAnswer(answer, categoryName) {
  if (answer.includes("__NOT_DECIDED__")) {
    return null;
  }

  if (answer.includes("__MANUAL__")) {
    const manualAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "technology",
        message: `Enter your ${categoryName}:`,
      },
    ]);

    return [
      ...answer.filter((value) => value !== "__MANUAL__"),
      manualAnswer.technology,
    ];
  }

  return answer;
}
