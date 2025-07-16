import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import API_BASE_URL from '../config';

const HistorialAbastecimientos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datos, setDatos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // ✅ Función para mostrar fecha y hora en formato dd/mm/yyyy hh:mm
  const formatearFechaHoraDDMMYYYY = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  const consultarHistorial = async () => {
    try {
      // ✅ Convertimos las fechas para incluir toda la franja horaria del día
      const desde = `${fechaInicio}T00:00:00`;
      const hasta = `${fechaFin}T23:59:59`;

      const res = await axios.get(`${API_BASE_URL}/api/abastecimientos-rango`, {
        params: {
          desde,
          hasta
        }
      });
      setDatos(res.data);

      if (res.data.length === 0) {
        setMensaje('No se encontraron registros en ese rango de fechas');
      } else {
        setMensaje('');
      }
    } catch (error) {
      console.error('Error al consultar historial:', error);
      setMensaje('Error al consultar historial');
    }
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    XLSX.writeFile(wb, 'Historial_Abastecimientos.xlsx');
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
        Historial de Abastecimientos por Rango de Fechas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium">Desde:</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Hasta:</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-800 text-white px-6 py-2 rounded w-full"
            onClick={consultarHistorial}
          >
            Consultar
          </button>
        </div>
      </div>

      {mensaje && <p className="text-red-600 font-medium mb-4">{mensaje}</p>}

      {datos.length > 0 && (
        <>
          <table className="w-full border text-sm bg-white mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Vehículo</th>
                <th className="p-2 border">Chofer</th>
                <th className="p-2 border">Litros</th>
                <th className="p-2 border">Kilometraje</th>
                <th className="p-2 border">Lugar</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((a) => (
                <tr key={a.abastecimientoid}>
                  <td className="p-2 border">{formatearFechaHoraDDMMYYYY(a.fecha)}</td>
                  <td className="p-2 border">{a.vehiculo}</td>
                  <td className="p-2 border">{a.chofer}</td>
                  <td className="p-2 border text-right">{a.cant_litros}</td>
                  <td className="p-2 border text-right">{a.kilometrajeactual}</td>
                  <td className="p-2 border">{a.lugar}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right">
            <button
              className="bg-green-800 text-white px-6 py-2 rounded"
              onClick={exportarExcel}
            >
              Descargar Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialAbastecimientos;



