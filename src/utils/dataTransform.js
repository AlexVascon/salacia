
export function buildLevels(rawData) {
  const scopes = [];
  const categoriesByScope = new Map();
  const activitiesByCategory = new Map();

  function sum(values) {
    return values.reduce((total, value) => total + value, 0);
  }

  for (const [scopeName, categories] of Object.entries(rawData)) {
    const categoryList = [];

    for (const [categoryName, activities] of Object.entries(categories)) {
      const activityValues = activities.map(([_, value]) => value);
      const categoryTotal = sum(activityValues);

      categoryList.push({ name: categoryName, y: categoryTotal });

      const categoryKey = `${scopeName}::${categoryName}`;
      const formattedActivities = activities.map(([activityName, value]) => ({
        name: activityName,
        y: value,
      }));
      activitiesByCategory.set(categoryKey, formattedActivities);
    }

    categoriesByScope.set(scopeName, categoryList);

    const scopeTotal = sum(categoryList.map((c) => c.y));
    scopes.push({ name: scopeName, y: scopeTotal });
  }

  return { scopes, categoriesByScope, activitiesByCategory };
}
