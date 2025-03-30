// src/App.js
import SensorChart from "./components/SensorChart";

function App() {
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Dashboard Sensori (InfluxDB + Nivo)
      </h1>

      {/* Sensore 1: mostra temperatura e energia */}
      <SensorChart
        title="Sensore 01"
        endpoint="http://localhost:5000/api/storico"
        metricIds={["temperatura", "energia"]}
      />

      {/* In futuro: puoi riusare lo stesso componente per altri sensori */}
      {/* 
      <SensorChart
        title="Sensore 02"
        endpoint="http://localhost:5000/api/storico-sensore02"
        metricIds={["umidità", "pressione"]}
      />
      */}
    </div>
  );
}

export default App;
