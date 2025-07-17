import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const HistorialFiltrado = () => {
  const [data, setData] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filtros, setFiltros] = useState({ choferid: '', vehiculoid: '' });

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
  };

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
        📊 Historial de Stock Filtrado
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          className="border border-gray-300 p-2 rounded min-w-[200px]"
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
          className="border border-gray-300 p-2 rounded min-w-[200px]"
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
          onClick={cargarHistorial}
          className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🔍 Filtrar
        </button>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm text-gray-800 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Vehículo</th>
              <th className="px-4 py-2 border text-right">Odómetro</th>
              <th className="px-4 py-2 border">Chofer</th>
              <th className="px-4 py-2 border text-right">Entrada (L)</th>
              <th className="px-4 py-2 border text-right">Salida (L)</th>
              <th className="px-4 py-2 border text-right font-bold">Stock (L)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 border-t">
                <td className="px-4 py-2 border">
                  {item.fechatransaccion ? formatearFechaHora(item.fechatransaccion) : '-'}
                </td>
                <td className="px-4 py-2 border">{item.tipo}</td>
                <td className="px-4 py-2 border">{item.vehiculo || '-'}</td>
                <td className="px-4 py-2 border text-right">
                  {item.kilometraje ? item.kilometraje.toLocaleString('es-ES') : '-'}
                </td>
                <td className="px-4 py-2 border">{item.chofer || '-'}</td>
                <td className="px-4 py-2 border text-right">
                  {item.litrosentrada > 0 ? formatearNumero(item.litrosentrada) : '-'}
                </td>
                <td className="px-4 py-2 border text-right">
                  {item.litrossalida > 0 ? formatearNumero(item.litrossalida) : '-'}
                </td>
                <td className="px-4 py-2 border text-right font-bold">
                  {formatearNumero(item.stock)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialFiltrado;

