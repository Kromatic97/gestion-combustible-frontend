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

  let stockAcumulado = 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        📊 Historial Consolidado de Stock
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Vehículo</th>
              <th className="border p-2">Odómetro</th>
              <th className="border p-2">Chofer</th>
              <th className="border p-2">Entrada (L)</th>
              <th className="border p-2">Salida (L)</th>
              <th className="border p-2">Stock (L)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const entradaRaw = item.litrosentrada;
              const salidaRaw = item.litrossalida;

              const entradaNumerica = parseFloat(entradaRaw?.replace('.', '').replace(',', '.') || 0);
              const salidaNumerica = parseFloat(salidaRaw?.replace('.', '').replace(',', '.') || 0);

              stockAcumulado += entradaNumerica - salidaNumerica;

              return (
                <tr key={index}>
                  <td className="border p-2">
                    {item.fechatransaccion
                      ? new Date(item.fechatransaccion).toLocaleString()
                      : '-'}
                  </td>
                  <td className="border p-2">
                    {entradaNumerica > 0
                      ? 'Recarga'
                      : salidaNumerica > 0
                      ? 'Abastecimiento'
                      : '-'}
                  </td>
                  <td className="border p-2">{item.vehiculo || '-'}</td>
                  <td className="border p-2 text-right">
                    {item.kilometraje ? item.kilometraje : '-'}
                  </td>
                  <td className="border p-2">{item.chofer || '-'}</td>
                  <td className="border p-2 text-right">
                    {entradaRaw || '-'}
                  </td>
                  <td className="border p-2 text-right">
                    {salidaRaw || '-'}
                  </td>
                  <td className="border p-2 text-right font-bold">
                    {stockAcumulado.toLocaleString('es-ES', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialRecargas;




