import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const HistorialFiltrado = () => {
  const [data, setData] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filtros, setFiltros] = useState({ choferid: '', vehiculoid: '' });
  const [totales, setTotales] = useState({ entrada: 0, salida: 0 });

  useEffect(() => {
    cargarChoferes();
    cargarVehiculos();
    cargarHistorial();
  }, []);

  const cargarChoferes = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/choferes`);
    setChoferes(res.data);
  };

  const cargarVehiculos = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/vehiculos`);
    setVehiculos(res.data);
  };

  const cargarHistorial = async () => {
    const params = {};
    if (filtros.choferid) params.choferid = filtros.choferid;
    if (filtros.vehiculoid) params.vehiculoid = filtros.vehiculoid;

    const res = await axios.get(`${API_BASE_URL}/api/historial-stock-filtrado`, { params });
    setData(res.data);

    // Calcular totales
    let totalEntrada = 0;
    let totalSalida = 0;
    res.data.forEach((item) => {
      totalEntrada += Number(item.litrosentrada || 0);
      totalSalida += Number(item.litrossalida || 0);
    });
    setTotales({ entrada: totalEntrada, salida: totalSalida });
  };

  const formatearNumero = (numero) =>
    Number(numero).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📊 Historial de Stock Filtrado
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          className="border p-2 rounded"
          value={filtros.choferid}
          onChange={(e) => setFiltros({ ...filtros, choferid: e.target.value })}
        >
          <option value="">Todos los choferes</option>
          {choferes.map((c) => (
            <option key={c.choferid} value={c.choferid}>
              {c.nombre}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filtros.vehiculoid}
          onChange={(e) => setFiltros({ ...filtros, vehiculoid: e.target.value })}
        >
          <option value="">Todos los vehículos</option>
          {vehiculos.map((v) => (
            <option key={v.vehiculoid} value={v.vehiculoid}>
              {v.denominacion}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={cargarHistorial}
        >
          🔍 Filtrar
        </button>
      </div>

          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-6">
                <table className="min-w-full bg-white divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                      <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                      <th className="px-4 py-2 text-left font-semibold">Vehículo</th>
                      <th className="px-4 py-2 text-right font-semibold">Odómetro</th>
                      <th className="px-4 py-2 text-left font-semibold">Chofer</th>
                      <th className="px-4 py-2 text-right font-semibold">Entrada (L)</th>
                      <th className="px-4 py-2 text-right font-semibold">Salida (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">
                          {item.fechatransaccion
                            ? new Date(item.fechatransaccion).toLocaleString()
                            : '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{item.tipo}</td>
                        <td className="px-4 py-2 text-gray-700">{item.vehiculo || '-'}</td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {item.kilometraje ? item.kilometraje.toLocaleString('es-ES') : '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{item.chofer}</td>
                        <td className="px-4 py-2 text-right text-green-700">
                          {item.litrosentrada > 0 ? formatearNumero(item.litrosentrada) : '-'}
                        </td>
                        <td className="px-4 py-2 text-right text-red-700">
                          {item.litrossalida > 0 ? formatearNumero(item.litrossalida) : '-'}
                        </td>
                      </tr>
                    ))}

                    {data.length > 0 && (
                      <tr className="bg-blue-50 font-semibold">
                        <td colSpan="5" className="px-4 py-2 text-right text-gray-700">Totales:</td>
                        <td className="px-4 py-2 text-right text-green-700">
                          {formatearNumero(totales.entrada)}
                        </td>
                        <td className="px-4 py-2 text-right text-red-700">
                          {formatearNumero(totales.salida)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
        </div>



    </div>
  );
};

export default HistorialFiltrado;



