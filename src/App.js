import React from "react";
import DrilldownPie from "./components/DrillDownPie";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Drilldown Pie — Emissions</h1>
      <DrilldownPie />
    </div>
  );
}
