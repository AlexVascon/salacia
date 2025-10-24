import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import data from "../data.json"; 

function buildLevels(raw) {
  const scopes = [];                    
  const catsByScope = new Map();              
  const actsByCat = new Map();               

  const sum = (arr) => arr.reduce((a, b) => a + b, 0);

  Object.entries(raw).forEach(([scope, categories]) => {
    const catPoints = [];
    Object.entries(categories).forEach(([category, activities]) => {
      const total = sum(activities.map((a) => a[1]));
      catPoints.push({ name: category, y: total });
      actsByCat.set(
        `${scope}::${category}`,
        activities.map(([act, val]) => ({ name: act, y: val }))
      );
    });
    catsByScope.set(scope, catPoints);
    scopes.push({ name: scope, y: sum(catPoints.map((p) => p.y)) });
  });

  return { scopes, catsByScope, actsByCat };
}

export default function DrillDownPie() {
  const { scopes, catsByScope, actsByCat } = useMemo(() => buildLevels(data), []);
  const [level, setLevel] = useState("scope"); 
  const [currentScope, setCurrentScope] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);


  const seriesData = useMemo(() => {
    if (level === "scope") return scopes;
    if (level === "category") return catsByScope.get(currentScope) || [];
    if (level === "activity") return actsByCat.get(`${currentScope}::${currentCategory}`) || [];
    return [];
  }, [level, currentScope, currentCategory, scopes, catsByScope, actsByCat]);

  const title =
    level === "scope"
      ? "Emissions (CO₂e) — Scopes"
      : level === "category"
      ? `Categories — ${currentScope}`
      : `Activities — ${currentCategory} (${currentScope})`;

  const options = {
    chart: { type: "pie" },
    title: { text: title },
    subtitle: {
      text:
        level === "scope"
          ? "Click a scope to see categories"
          : level === "category"
          ? "Click a category to see activities"
          : "Activities"
    },
    series: [{ name: "Emissions", colorByPoint: true, data: seriesData }],
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const name = this.name;
              if (level === "scope") {
                setCurrentScope(name);
                setLevel("category");
              } else if (level === "category") {
                setCurrentCategory(name);
                setLevel("activity");
              }
            }
          }
        },
        dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y:.1f}" }
      }
    },
    tooltip: { pointFormat: "<b>{point.y:.2f} t CO₂e</b>" },
    credits: { enabled: false }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={() => setLevel("scope")}
          disabled={level === "scope"}
          style={{ marginRight: 8 }}
        >
          Scopes
        </button>
        {level !== "scope" && (
          <button
            onClick={() => {
              setLevel("category");
              setCurrentCategory(null);
            }}
            disabled={level === "category"}
          >
            {currentScope || "Categories"}
          </button>
        )}
        {level === "activity" && (
          <span style={{ marginLeft: 8 }}>› {currentCategory}</span>
        )}
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
      <p style={{ marginTop: 8, color: "#666" }}>
        Units: tonnes CO₂e. Click slices to drill; use breadcrumb to go back.
      </p>
    </div>
  );
}
