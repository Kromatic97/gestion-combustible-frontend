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
              const entradaRaw = item.litrosentrada || '0';
              const salidaRaw = item.litrossalida || '0';

              // 👇 Convertir "10.000,00" a 10000.00 (float)
              const entrada = parseFloat(entradaRaw.replace(/\./g, '').replace(',', '.')) || 0;
              const salida = parseFloat(salidaRaw.replace(/\./g, '').replace(',', '.')) || 0;

              // 👇 Acumulado correctamente
              stockAcumulado += entrada - salida;

              return (
                <tr key={index}>
                  <td className="border p-2">
                    {item.fechatransaccion
                      ? new Date(item.fechatransaccion).toLocaleString()
                      : '-'}
                  </td>
                  <td className="border p-2">
                    {entrada > 0 ? 'Recarga' : salida > 0 ? 'Abastecimiento' : '-'}
                  </td>
                  <td className="border p-2">{item.vehiculo || '-'}</td>
                  <td className="border p-2 text-right">
                    {item.kilometraje ? item.kilometraje : '-'}
                  </td>
                  <td className="border p-2">{item.chofer || '-'}</td>
                  <td className="border p-2 text-right">
                    {entrada > 0
                      ? entrada.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </td>
                  <td className="border p-2 text-right">
                    {salida > 0
                      ? salida.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
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





