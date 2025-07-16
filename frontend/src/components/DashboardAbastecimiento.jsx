import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import API_BASE_URL from '../config';

const DashboardAbastecimiento = () => {
  const [topVehiculos, setTopVehiculos] = useState([]);
  const [totalLitros, setTotalLitros] = useState(0);
  const [consumoDiario, setConsumoDiario] = useState([]);
  const [topChofer, setTopChofer] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const [vehiculosRes, totalRes, diarioRes, choferRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/top-vehiculos`),
        axios.get(`${API_BASE_URL}/api/dashboard/total-litros-mes`),
        axios.get(`${API_BASE_URL}/api/dashboard/consumo-diario`),
        axios.get(`${API_BASE_URL}/api/dashboard/top-chofer`)
      ]);

      setTopVehiculos(vehiculosRes.data);
      setTotalLitros(Number(totalRes.data.total_litros || 0));
      setConsumoDiario(diarioRes.data);
      setTopChofer(choferRes.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Dashboard de Abastecimientos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-lg font-semibold text-green-900">Total litros cargados este mes</p>
          <p className="text-3xl font-mono">{totalLitros.toLocaleString()} L</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-lg font-semibold text-blue-900">Chofer que más abasteció</p>
          {topChofer ? (
            <>
              <p className="text-xl font-bold">{topChofer.chofer}</p>
              <p className="text-sm">{Number(topChofer.litros_total).toLocaleString()} litros</p>
            </>
          ) : (
            <p>No hay datos aún.</p>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Consumo diario - Últimos 30 días</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={consumoDiario}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="litros" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Top 10 vehículos que más cargaron</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVehiculos} layout="vertical" margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="vehiculo" type="category" />
            <Tooltip />
            <Bar dataKey="litros_total" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardAbastecimiento;
