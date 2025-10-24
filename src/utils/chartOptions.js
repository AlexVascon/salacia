
export function getChartOptions({ level, title, subtitle, seriesData, onClick }) {
  return {
    chart: { type: "pie" },
    title: { text: title },
    subtitle: { text: subtitle },
    series: [{ name: "Emissions", colorByPoint: true, data: seriesData }],
    plotOptions: {
      series: {
        cursor: "pointer",
        point: { events: { click: onClick } },
        dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y:.1f}" },
      },
    },
    tooltip: { pointFormat: "<b>{point.y:.2f} t CO₂e</b>" },
    credits: { enabled: false },
  };
}
