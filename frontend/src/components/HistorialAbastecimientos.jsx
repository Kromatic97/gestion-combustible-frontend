import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import API_BASE_URL from '../config';


const HistorialAbastecimientos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datos, setDatos] = useState([]);
  const [mensaje, setMensaje] = useState('');

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
      const desde = `${fechaInicio}T00:00:00`;
      const hasta = `${fechaFin}T23:59:59`;

      const res = await axios.get(`${API_BASE_URL}/api/abastecimientos-rango`, {
        params: { desde, hasta }
      });

      setDatos(res.data);
      setMensaje(res.data.length === 0 ? 'No se encontraron registros en ese rango de fechas' : '');
    } catch (error) {
      console.error('Error al consultar historial:', error);
      setMensaje('❌ Error al consultar historial');
    }
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    XLSX.writeFile(wb, 'Historial_Abastecimientos.xlsx');
  };

  // Calcular totales
  const totalLitros = datos.reduce((sum, item) => sum + (Number(item.cant_litros) || 0), 0);
  //const totalKm = datos.reduce((sum, item) => sum + (Number(item.kilometrajeactual) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-6">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Historial de Abastecimientos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-1">Desde:</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded p-2"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Hasta:</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded p-2"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={consultarHistorial}
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Consultar
          </button>
        </div>
      </div>

      {mensaje && <p className="text-red-600 font-medium mb-4">{mensaje}</p>}

      {datos.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-100 bg-white text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-2 text-left font-semibold">Vehículo</th>
                    <th className="px-4 py-2 text-left font-semibold">Chofer</th>
                    <th className="px-4 py-2 text-right font-semibold">Litros</th>
                    <th className="px-4 py-2 text-right font-semibold">Kilometraje</th>
                    <th className="px-4 py-2 text-left font-semibold">Lugar</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((a) => (
                    <tr key={a.abastecimientoid} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{formatearFechaHoraDDMMYYYY(a.fecha)}</td>
                      <td className="px-4 py-2 text-gray-700">{a.vehiculo}</td>
                      <td className="px-4 py-2 text-gray-700">{a.chofer}</td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {Number(a.cant_litros).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-700">
                        {Number(a.kilometrajeactual).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{a.lugar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="mt-4 text-right text-sm font-semibold text-gray-700 px-2">
              Total litros:{' '}
              <span className="text-blue-800">
                {totalLitros.toLocaleString('es-ES', { minimumFractionDigits: 2 })} L
              </span>
            </div>

         

          <div className="mt-6 text-right">
            <button
              onClick={exportarExcel}
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600"
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






