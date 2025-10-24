export function getNextDrillLevel(currentLevel, clickedName, setLevel, setScope, setCategory) {
  switch (currentLevel) {
    case "scope":
      setScope(clickedName);
      setLevel("category");
      break;

    case "category":
      setCategory(clickedName);
      setLevel("activity");
      break;

    default:
      break;
  }
}
