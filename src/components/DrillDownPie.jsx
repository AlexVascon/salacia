import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import data from "../data.json";

import { buildLevels } from "../utils/dataTransform";
import { getChartOptions } from "../utils/chartOptions";
import { getChartTitles } from '../utils/getChartTitle';
import { getNextDrillLevel } from '../utils/getNextDrillLevel';

export default function DrillDownPie() {
  const { scopes, categoriesByScope, activitiesByCategory } = useMemo(
    () => buildLevels(data),
    []
  );

  const [level, setLevel] = useState("scope");
  const [currentScope, setCurrentScope] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const seriesData = useMemo(() => {
    if (level === "scope") return scopes;
    if (level === "category") return categoriesByScope.get(currentScope) || [];
    if (level === "activity")
      return activitiesByCategory.get(`${currentScope}::${currentCategory}`) || [];
    return [];
  }, [level, currentScope, currentCategory, scopes, categoriesByScope, activitiesByCategory]);

  const { title, subtitle } = getChartTitles(level, currentScope, currentCategory);

  function handlePointClick() {
  const clickedName = this.name;
  getNextDrillLevel(level, clickedName, setLevel, setCurrentScope, setCurrentCategory);
}

  const options = getChartOptions({
    level,
    title,
    subtitle,
    seriesData,
    onClick: handlePointClick,
  });

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 8 }}>
        <button onClick={() => setLevel("scope")} disabled={level === "scope"}>
          Scopes
        </button>
        {level !== "scope" && (
          <button
            onClick={() => {
              setLevel("category");
              setCurrentCategory(null);
            }}
            disabled={level === "category"}
            style={{ marginLeft: 8 }}
          >
            {currentScope || "Categories"}
          </button>
        )}
        {level === "activity" && <span style={{ marginLeft: 8 }}>› {currentCategory}</span>}
      </nav>

      <HighchartsReact highcharts={Highcharts} options={options} />

      <p style={{ marginTop: 8, color: "#666" }}>
        Units: tonnes CO₂e. Click slices to drill down; use breadcrumbs to go back.
      </p>
    </div>
  );
}
