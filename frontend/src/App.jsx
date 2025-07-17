import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AbastecimientoForm from "./components/AbastecimientoForm";
import ChoferForm from "./components/ChoferForm";
import VehiculoForm from "./components/VehiculoForm";
import RecargaStockForm from "./components/RecargaStockForm";
import HistorialRecargas from "./components/HistorialRecargas";
import HistorialAbastecimientos from "./components/HistorialAbastecimientos";
import HistorialFiltrado from "./components/HistorialFiltrado";
import DashboardAbastecimiento from "./components/DashboardAbastecimiento";

function App() {
  const abastecimientoFormRef = useRef();

  const recargarAbastecimientos = () => {
    if (abastecimientoFormRef.current) {
      abastecimientoFormRef.current.cargarVehiculos();
      abastecimientoFormRef.current.cargarChoferes();
    }
  };

  return (
    <Router>
      <header>
        <nav style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Abastecer</Link>
          <Link to="/vehiculo" style={{ marginRight: "10px" }}>Vehículo</Link>
          <Link to="/chofer" style={{ marginRight: "10px" }}>Chofer</Link>
          <Link to="/recarga-stock" style={{ marginRight: "10px" }}>Recargar</Link>
          <Link to="/recargas" style={{ marginRight: "10px" }}>Hist. Recargas</Link>
          <Link to="/historial-abastecimientos" style={{ marginRight: "10px" }}>Hist. Abast.</Link>
          <Link to="/historial-filtrado" style={{ marginRight: "10px" }}>Filtrado</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <AbastecimientoForm
                ref={abastecimientoFormRef}
                onAbastecimientoRegistrado={recargarAbastecimientos}
              />
            }
          />
          <Route path="/vehiculo" element={<VehiculoForm />} />
          <Route path="/chofer" element={<ChoferForm />} />
          <Route path="/recarga-stock" element={<RecargaStockForm />} />
          <Route path="/recargas" element={<HistorialRecargas />} />
          <Route path="/historial-abastecimientos" element={<HistorialAbastecimientos />} />
          <Route path="/historial-filtrado" element={<HistorialFiltrado />} />
          <Route path="/dashboard" element={<DashboardAbastecimiento />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;












