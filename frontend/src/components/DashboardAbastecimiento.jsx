import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
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

const obtenerNombreMes = (numeroMes) => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return meses[numeroMes - 1];
};

export default function Dashboard() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  const [totalLitros, setTotalLitros] = useState(0);
  const [topChofer, setTopChofer] = useState(null);
  const [topVehiculos, setTopVehiculos] = useState([]);
  const [consumoDiario, setConsumoDiario] = useState([]);

  const dashboardRef = useRef(null);

  const cargarDashboard = async () => {
    try {
      const [vehiculosRes, totalRes, diarioRes, choferRes] = await Promise.all([
        axios.get(`/api/dashboard/top-vehiculos?anio=${anio}&mes=${mes}`),
        axios.get(`/api/dashboard/total-litros-mes?anio=${anio}&mes=${mes}`),
        axios.get(`/api/dashboard/consumo-diario?anio=${anio}&mes=${mes}`),
        axios.get(`/api/dashboard/top-chofer?anio=${anio}&mes=${mes}`),
      ]);

      setTopVehiculos(vehiculosRes.data);
      setTotalLitros(Number(totalRes.data?.total_litros || 0));
      setConsumoDiario(diarioRes.data);
      setTopChofer(choferRes.data);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, [anio, mes]);

  const exportarPDF = () => {
    const input = dashboardRef.current;
    domtoimage.toPng(input)
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (img.height * pdfWidth) / img.width;
          pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Dashboard_Abastecimiento_${obtenerNombreMes(mes)}_${anio}.pdf`);
        };
      })
      .catch((error) => {
        console.error("Error al generar PDF:", error);
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-right mb-4">
        <button
          onClick={exportarPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Descargar PDF
        </button>
      </div>

      <div ref={dashboardRef} className="space-y-8 bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Dashboard de Abastecimientos</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {[2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <button
            onClick={cargarDashboard}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Consultar
          </button>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-sm text-gray-500">Total litros cargados</h2>
            <p className="text-2xl font-semibold text-gray-800">{totalLitros.toLocaleString()} L</p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-sm text-gray-500">Chofer que más abasteció</h2>
            {topChofer ? (
              <div>
                <p className="text-lg font-medium text-gray-700">{topChofer.chofer}</p>
                <p className="text-sm text-gray-600">{Number(topChofer.litros_total).toLocaleString()} L</p>
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
                <p className="text-sm text-gray-600">{Number(topVehiculos[0].litros_total).toLocaleString()} L</p>
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
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Consumo diario - {mes}/{anio}</h2>
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
    </div>
  );
}



