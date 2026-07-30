export function inferCategory(text, packageCategoryMap) {
  const normalizedText = text.toLowerCase();
  // to search package name first
  for (const ecosystem in packageCategoryMap) {
    for (const packageName in packageCategoryMap[ecosystem]) {
      const regex = new RegExp(`\\b${packageName}\\b`);
      if (regex.test(normalizedText)) {
        return packageCategoryMap[ecosystem][packageName];
      }
    }
  }

  // to search category names secondly
  const categories = Object.values(packageCategoryMap).flatMap((ecosystem) =>
    Object.values(ecosystem),
  );
  for (const category of categories) {
    if (normalizedText.includes(category)) {
      return category;
    }
  }
  return undefined;
}
