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

  // Función para convertir "10.000,00" → 10000.00 (para cálculo)
  const convertirAFloat = (str) =>
    str ? parseFloat(str.replace(/\./g, '').replace(',', '.')) : 0;

  // Función para formatear float → "10.000,00"
  const formatearNumero = (numero) =>
    numero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
              const entrada = convertirAFloat(item.litrosentrada);
              const salida = convertirAFloat(item.litrossalida);

              stockAcumulado += entrada - salida;

              return (
                <tr key={index}>
                  <td className="border p-2">
                    {item.fechatransaccion
                      ? new Date(item.fechatransaccion).toLocaleString()
                      : '-'}
                  </td>
                  <td className="border p-2">{item.tipo}</td>
                  <td className="border p-2">{item.vehiculo || '-'}</td>
                  <td className="border p-2 text-right">
                    {item.kilometraje ? item.kilometraje.toLocaleString('es-ES') : '-'}
                  </td>
                  <td className="border p-2">{item.chofer || '-'}</td>
                  <td className="border p-2 text-right">
                    {item.litrosentrada || '-'}
                  </td>
                  <td className="border p-2 text-right">
                    {item.litrossalida || '-'}
                  </td>
                  <td className="border p-2 text-right font-bold">
                    {formatearNumero(stockAcumulado)}
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







