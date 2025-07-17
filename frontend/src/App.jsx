import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AbastecimientoForm from "./components/AbastecimientoForm";
import ChoferForm from "./components/ChoferForm";
import VehiculoForm from "./components/VehiculoForm";
import RecargaStockForm from "./components/RecargaStockForm";
import HistorialRecargas from "./components/HistorialRecargas";
import HistorialAbastecimientos from "./components/HistorialAbastecimientos";
import HistorialFiltrado from "./components/HistorialFiltrado";
import DashboardAbastecimiento from "./components/DashboardAbastecimiento";
import Layout from "./components/Layout";

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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AbastecimientoForm
                ref={abastecimientoFormRef}
                onAbastecimientoRegistrado={recargarAbastecimientos}
              />
            }
          />
          <Route path="vehiculo" element={<VehiculoForm />} />
          <Route path="chofer" element={<ChoferForm />} />
          <Route path="recarga-stock" element={<RecargaStockForm />} />
          <Route path="recargas" element={<HistorialRecargas />} />
          <Route path="historial-abastecimientos" element={<HistorialAbastecimientos />} />
          <Route path="historial-filtrado" element={<HistorialFiltrado />} />
          <Route path="dashboard" element={<DashboardAbastecimiento />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;









