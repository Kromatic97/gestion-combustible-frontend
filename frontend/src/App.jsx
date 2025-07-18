import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AbastecimientoForm from "./components/AbastecimientoForm";
import VehiculoForm from "./components/VehiculoForm";
import ChoferForm from "./components/ChoferForm";
import RecargaStockForm from "./components/RecargaStockForm";
import HistorialRecargas from "./components/HistorialRecargas";
import HistorialAbastecimientos from "./components/HistorialAbastecimientos";
import HistorialFiltrado from "./components/HistorialFiltrado";
import DashboardAbastecimiento from "./components/DashboardAbastecimiento";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Router>
        <Routes>
          <Route element={<Layout toggleDark={() => setDarkMode(!darkMode)} darkMode={darkMode} />}>
            <Route path="/" element={<AbastecimientoForm />} />
            <Route path="/vehiculo" element={<VehiculoForm />} />
            <Route path="/chofer" element={<ChoferForm />} />
            <Route path="/recarga-stock" element={<RecargaStockForm />} />
            <Route path="/recargas" element={<HistorialRecargas />} />
            <Route path="/historial-abastecimientos" element={<HistorialAbastecimientos />} />
            <Route path="/historial-filtrado" element={<HistorialFiltrado />} />
            <Route path="/dashboard" element={<DashboardAbastecimiento />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;













