import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const anio = new Date().getFullYear();
const mes = new Date().getMonth() + 1;

export default function Dashboard() {
  const [totalLitros, setTotalLitros] = useState(0);
  const [topChofer, setTopChofer] = useState(null);
  const [topVehiculos, setTopVehiculos] = useState([]);
  const [consumoDiario, setConsumoDiario] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/dashboard/total-litros-mes?anio=${anio}&mes=${mes}`)
      .then((res) => setTotalLitros(res.data.total_litros));

    axios
      .get(`/api/dashboard/top-chofer?anio=${anio}&mes=${mes}`)
      .then((res) => setTopChofer(res.data));

    axios
      .get(`/api/dashboard/top-vehiculos?anio=${anio}&mes=${mes}`)
      .then((res) => setTopVehiculos(res.data));

    axios
      .get(`/api/dashboard/consumo-diario?anio=${anio}&mes=${mes}`)
      .then((res) => setConsumoDiario(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard de Abastecimientos</h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Total litros cargados</h2>
          <p className="text-2xl font-semibold text-gray-800">{totalLitros} L</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Chofer que más abasteció</h2>
          {topChofer ? (
            <div>
              <p className="text-lg font-medium text-gray-700">{topChofer.chofer}</p>
              <p className="text-sm text-gray-600">{topChofer.litros_total} L</p>
            </div>
          ) : (
            <p className="text-gray-400">Sin datos</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Top 1 vehículo del mes</h2>
          {topVehiculos[0] ? (
            <div>
              <p className="text-lg font-medium text-gray-700">{topVehiculos[0].vehiculo}</p>
              <p className="text-sm text-gray-600">{topVehiculos[0].litros_total} L</p>
            </div>
          ) : (
            <p className="text-gray-400">Sin datos</p>
          )}
        </div>
      </div>

      {/* Gráfico de barras: Top 10 vehículos */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Top 10 vehículos que más cargaron</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVehiculos} layout="vertical" margin={{ left: 40 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="vehiculo" width={120} />
            <Tooltip />
            <Bar dataKey="litros_total" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de línea: consumo diario */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Consumo diario (últimos 30 días)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={consumoDiario}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="litros" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




