// src/components/SensorChart.jsx
import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const SensorChart = ({ endpoint, metricIds, title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(endpoint, { method: "HEAD" })
      .then(() => console.log("✅ Server raggiungibile:", endpoint))
      .catch((err) => console.warn("❌ Server IRRAGGIUNGIBILE:", err));

    const fetchData = () => {
      fetch(endpoint)
        .then((res) => res.json())
        .then((rawData) => {
          console.log("📦 Risposta dal server:", rawData);

          const series = metricIds.map((metricId) => ({
            id: metricId,
            data: rawData
              .filter(
                (p) =>
                  p.field === metricId &&
                  p.time &&
                  !isNaN(new Date(p.time)) &&
                  typeof p.value === "number"
              )
              .map((p) => ({
                x: new Date(p.time),
                y: p.value,
              })),
          }));

          setData(series);
        })
        .catch((err) => console.error("❌ Fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [endpoint, metricIds]);

  const downloadCSV = () => {
    let csv = "timestamp,metric,value\n";
    data.forEach((series) => {
      series.data.forEach((point) => {
        csv += `${point.x.toISOString()},${series.id},${point.y}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "450px", marginBottom: "3rem" }}>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <button
        onClick={downloadCSV}
        style={{
          display: "block",
          margin: "0 auto 10px auto",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⬇️ Scarica report CSV
      </button>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "time", precision: "second" }}
        xFormat="time:%H:%M:%S"
        yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
        axisBottom={{
          format: "%H:%M:%S",
          tickValues: "every 30 seconds",
          legend: "Orario",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "Valore",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        useMesh={true}
        animate={false}
        enableSlices="x"
        colors={{ scheme: "category10" }}
        pointSize={4}
        pointBorderWidth={2}
      />
    </div>
  );
};

export default SensorChart;
