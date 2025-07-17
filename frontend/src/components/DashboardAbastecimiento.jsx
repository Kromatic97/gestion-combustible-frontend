import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import API_BASE_URL from '../config';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

const DashboardAbastecimiento = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  const [topVehiculos, setTopVehiculos] = useState([]);
  const [totalLitros, setTotalLitros] = useState(0);
  const [consumoDiario, setConsumoDiario] = useState([]);
  const [topChofer, setTopChofer] = useState(null);

  const dashboardRef = useRef(null);

  const obtenerNombreMes = (numeroMes) => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[numeroMes - 1];
  };

  const cargarDashboard = async () => {
    try {
      const [vehiculosRes, totalRes, diarioRes, choferRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/top-vehiculos`, { params: { anio, mes } }),
        axios.get(`${API_BASE_URL}/api/dashboard/total-litros-mes`, { params: { anio, mes } }),
        axios.get(`${API_BASE_URL}/api/dashboard/consumo-diario`, { params: { anio, mes } }),
        axios.get(`${API_BASE_URL}/api/dashboard/top-chofer`, { params: { anio, mes } }),
      ]);

      setTopVehiculos(vehiculosRes.data);
      setTotalLitros(Number(totalRes.data?.total_litros || 0));
      setConsumoDiario(diarioRes.data);
      setTopChofer(choferRes.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const exportarPDF = () => {
    const input = dashboardRef.current;
    domtoimage.toPng(input)
      .then((dataUrl) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (img.height * pdfWidth) / img.width;
          pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Dashboard_Abastecimiento_${obtenerNombreMes(mes)}_${anio}.pdf`);
        };
      })
      .catch((error) => {
        console.error('❌ Error al generar PDF:', error);
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

      <div ref={dashboardRef} className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold text-center text-blue-900">
          Dashboard de Abastecimientos
        </h2>
        <p className="text-center mb-6 text-gray-600">
          Período: {obtenerNombreMes(mes)} {anio}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-lg font-semibold text-green-900">Total litros cargados</p>
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
              <p>No hay datos.</p>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Consumo diario - {mes}/{anio}</h3>
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
    </div>
  );
};

export default DashboardAbastecimiento;



