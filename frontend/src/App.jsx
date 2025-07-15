import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AbastecimientoForm from './components/AbastecimientoForm';
import ChoferForm from './components/ChoferForm';
import VehiculoForm from './components/VehiculoForm';
import RecargaStockForm from './components/RecargaStockForm';
import HistorialRecargas from './components/HistorialRecargas';
import HistorialAbastecimientos from './components/HistorialAbastecimientos'; // ✅ Importar
import HistorialFiltrado from './components/HistorialFiltrado'; // ✅ Importar

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
      <div className="min-h-screen bg-gray-100 p-4 lg:p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
            Sistema de Gestión de Abastecimiento
          </h1>

          <nav className="flex justify-center gap-6 mb-8">
            <Link to="/" className="text-blue-700 hover:underline">Abastecimiento</Link>
            <Link to="/vehiculo" className="text-blue-700 hover:underline">Registrar Vehículo</Link>
            <Link to="/chofer" className="text-blue-700 hover:underline">Registrar Chofer</Link>
            <Link to="/recarga-stock" className="text-purple-700 hover:underline">Recargar Stock</Link>
            <Link to="/recargas" className="text-blue-700 hover:underline">Historial Recargas</Link>
            <Link to="/historial-abastecimientos" className="text-blue-700 hover:underline">Historial por Fecha</Link> {/* ✅ Nuevo */}
            <Link to="/historial-filtrado" className="inline-block bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">Ver Historial Filtrado</Link>
          </nav>

          <Routes>
            <Route path="/" element={
              <AbastecimientoForm
                ref={abastecimientoFormRef}
                onAbastecimientoRegistrado={recargarAbastecimientos}
              />
            } />
            <Route path="/vehiculo" element={<VehiculoForm />} />
            <Route path="/chofer" element={<ChoferForm />} />
            <Route path="/recarga-stock" element={<RecargaStockForm />} />
            <Route path="/recargas" element={<HistorialRecargas />} />
            <Route path="/historial-abastecimientos" element={<HistorialAbastecimientos />} /> {/* ✅ Nuevo */}
            <Route path="/historial-filtrado" element={<HistorialFiltrado />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;







