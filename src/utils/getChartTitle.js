export function getChartTitles(level, currentScope, currentCategory) {
  let title = "";
  let subtitle = "";

  switch (level) {
    case "scope":
      title = "Emissions (CO₂e) — Scopes";
      subtitle = "Click a scope to see categories";
      break;

    case "category":
      title = `Categories — ${currentScope}`;
      subtitle = "Click a category to see activities";
      break;

    case "activity":
      title = `Activities — ${currentCategory} (${currentScope})`;
      subtitle = "Activities breakdown";
      break;

    default:
      title = "Emissions (CO₂e)";
      subtitle = "";
  }

  return { title, subtitle };
}
