import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const HistorialRecargas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/historial-stock`);
        setData(response.data);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    };

    fetchHistorial();
  }, []);

  const formatearNumero = (numero) =>
    Number(numero).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatearFechaHora = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow mt-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        📦 Historial Consolidado de Stock
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-6">
          <table className="min-w-full bg-white divide-y divide-gray-100 text-sm text-gray-800">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                <th className="px-4 py-2 text-left font-semibold">Vehículo</th>
                <th className="px-4 py-2 text-right font-semibold">Odómetro</th>
                <th className="px-4 py-2 text-left font-semibold">Chofer</th>
                <th className="px-4 py-2 text-right font-semibold text-green-700">Entrada (L)</th>
                <th className="px-4 py-2 text-right font-semibold text-red-700">Salida (L)</th>
                <th className="px-4 py-2 text-right font-semibold text-blue-800">Stock (L)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-2">{item.fechatransaccion ? formatearFechaHora(item.fechatransaccion) : '-'}</td>
                  <td className="px-4 py-2">{item.tipo}</td>
                  <td className="px-4 py-2">{item.vehiculo || '-'}</td>
                  <td className="px-4 py-2 text-right">
                    {item.kilometraje ? item.kilometraje.toLocaleString('es-ES') : '-'}
                  </td>
                  <td className="px-4 py-2">{item.chofer || '-'}</td>
                  <td className="px-4 py-2 text-right text-green-700">
                    {Number(item.litrosentrada) > 0 ? formatearNumero(item.litrosentrada) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right text-red-700">
                    {Number(item.litrossalida) > 0 ? formatearNumero(item.litrossalida) : '-'}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-blue-800">
                    {item.stock != null ? formatearNumero(item.stock) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </div>
  );
};

export default HistorialRecargas;









