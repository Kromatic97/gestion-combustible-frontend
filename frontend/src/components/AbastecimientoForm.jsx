import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import API_BASE_URL from "../config";

registerLocale("es", es);

const AbastecimientoForm = () => {
  const [formulario, setFormulario] = useState({
    Fecha: null,
    VehiculoID: "",
    Kilometraje: "",
    Litros: "",
    LugarID: "",
    ChoferID: "",
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [resVehiculos, resChoferes, resLugares, resHistorial] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/vehiculos`),
      axios.get(`${API_BASE_URL}/api/choferes`),
      axios.get(`${API_BASE_URL}/api/lugares`),
      axios.get(`${API_BASE_URL}/api/abastecimientos`),
    ]);
    setVehiculos(resVehiculos.data);
    setChoferes(resChoferes.data);
    setLugares(resLugares.data);
    setHistorial(resHistorial.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE_URL}/api/abastecimientos`, formulario);
    setFormulario({
      Fecha: null,
      VehiculoID: "",
      Kilometraje: "",
      Litros: "",
      LugarID: "",
      ChoferID: "",
    });
    cargarDatos();
  };

  const formatearNumero = (valor) =>
    Number(valor).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white p-6 rounded shadow max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Registrar Abastecimiento</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div>
          <label>Fecha:</label>
          <DatePicker
            selected={formulario.Fecha ? new Date(formulario.Fecha) : null}
            onChange={(date) =>
              setFormulario((prev) => ({
                ...prev,
                Fecha: date.toISOString(),
              }))
            }
            locale="es"
            dateFormat="dd/MM/yyyy"
            className="w-full border p-2 rounded"
            placeholderText="Seleccionar fecha"
            required
          />
        </div>
        <div>
          <label>Vehículo:</label>
          <select
            name="VehiculoID"
            value={formulario.VehiculoID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.vehiculoid} value={v.vehiculoid}>
                {v.denominacion}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Kilometraje Actual:</label>
          <input
            type="number"
            name="Kilometraje"
            value={formulario.Kilometraje}
            onChange={handleChange}
            className="w-full border p-2 rounded text-right"
            required
          />
        </div>
        <div>
          <label>Cantidad de Litros:</label>
          <input
            type="number"
            name="Litros"
            value={formulario.Litros}
            onChange={handleChange}
            className="w-full border p-2 rounded text-right"
            required
          />
        </div>
        <div>
          <label>Lugar:</label>
          <select
            name="LugarID"
            value={formulario.LugarID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccionar lugar</option>
            {lugares.map((l) => (
              <option key={l.lugarid} value={l.lugarid}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Chofer:</label>
          <select
            name="ChoferID"
            value={formulario.ChoferID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleccionar chofer</option>
            {choferes.map((c) => (
              <option key={c.choferid} value={c.choferid}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-3 text-right">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Registrar Carga
          </button>
        </div>
      </form>

      {/* Tabla historial */}
      <div className="mt-8">
        <h3 className="font-bold mb-2">Últimos abastecimientos</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Vehículo</th>
              <th className="p-2 border">Chofer</th>
              <th className="p-2 border">Litros</th>
              <th className="p-2 border">Kilometraje</th>
              <th className="p-2 border">Lugar</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((a, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{new Date(a.fecha).toLocaleString()}</td>
                <td className="p-2 border">{a.vehiculo}</td>
                <td className="p-2 border">{a.chofer}</td>
                <td className="p-2 border text-right">{formatearNumero(a.cant_litros)}</td>
                <td className="p-2 border text-right">{formatearNumero(a.kilometraje)}</td>
                <td className="p-2 border">{a.lugar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbastecimientoForm;





















