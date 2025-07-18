import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';

registerLocale("es", es);

const AbastecimientoForm = forwardRef(({ onAbastecimientoRegistrado }, ref) => {
  const [formulario, setFormulario] = useState({
    Fecha: '',
    VehiculoID: '',
    KilometrajeActual: '',
    CantLitros: '',
    LugarID: '',
    ChoferID: ''
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [stock, setStock] = useState(0);
  const [abastecimientos, setAbastecimientos] = useState([]);

  useImperativeHandle(ref, () => ({
    cargarVehiculos,
    cargarChoferes,
    cargarStock,
  }));

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    await Promise.all([
      cargarVehiculos(),
      cargarChoferes(),
      cargarLugares(),
      cargarStock(),
      cargarAbastecimientos()
    ]);
  };

  const cargarVehiculos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/vehiculos`);
      setVehiculos(res.data);
    } catch (error) {
      console.error('Error al cargar vehículos', error);
    }
  };

  const cargarChoferes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/choferes`);
      setChoferes(res.data);
    } catch (error) {
      console.error('Error al cargar choferes', error);
    }
  };

  const cargarLugares = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/lugares`);
      setLugares(res.data);
    } catch (error) {
      console.error('Error al cargar lugares', error);
    }
  };

  const cargarStock = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stock`);
      setStock(res.data.litroactual);
    } catch (error) {
      console.error('Error al cargar stock', error);
    }
  };

  const cargarAbastecimientos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/abastecimientos`);
      setAbastecimientos(res.data);
    } catch (error) {
      console.error('Error al cargar abastecimientos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));

    if (name === 'VehiculoID') {
      const vehiculo = vehiculos.find(v => v.vehiculoid === parseInt(value));
      if (vehiculo) {
        setFormulario(prev => ({ ...prev, KilometrajeActual: vehiculo.kilometrajeodometro }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/abastecimientos`, formulario);

      setMensaje('✅ Abastecimiento registrado correctamente');

      setFormulario({
        Fecha: '',
        VehiculoID: '',
        KilometrajeActual: '',
        CantLitros: '',
        LugarID: '',
        ChoferID: ''
      });

      await cargarStock();
      await cargarAbastecimientos();

      if (onAbastecimientoRegistrado) onAbastecimientoRegistrado();

    } catch (error) {
      console.error('Error al registrar abastecimiento:', error);
      setMensaje('❌ Error al registrar el abastecimiento');
    }
  };

  const formatearFechaHoraDDMMYYYY = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Registrar Abastecimiento</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="w-full">
          <label className="block mb-1">Fecha:</label>
          <div className="relative">
            <DatePicker
              selected={formulario.Fecha ? new Date(formulario.Fecha) : null}
              onChange={(date) => setFormulario(prev => ({ ...prev, Fecha: date.toISOString() }))}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label>Vehículo:</label>
          <select name="VehiculoID" value={formulario.VehiculoID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map(v => (
              <option key={v.vehiculoid} value={v.vehiculoid}>{v.denominacion}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Kilometraje Actual:</label>
          <input type="number" name="KilometrajeActual" value={formulario.KilometrajeActual} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Cantidad de Litros:</label>
          <input type="number" name="CantLitros" value={formulario.CantLitros} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Lugar:</label>
          <select name="LugarID" value={formulario.LugarID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar lugar</option>
            {lugares.map(l => (
              <option key={l.lugarid} value={l.lugarid}>{l.nombrelugar}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Chofer:</label>
          <select name="ChoferID" value={formulario.ChoferID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar chofer</option>
            {choferes.map(c => (
              <option key={c.choferid} value={c.choferid}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Registrar Carga</button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-green-700 font-medium">{mensaje}</p>}

      <div className="mt-6 p-4 bg-blue-100 rounded">
        <p className="text-lg font-semibold text-blue-800">Stock Actual</p>
        <p className="text-2xl font-mono">{stock.toLocaleString('es-PY')} litros</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Últimos abastecimientos</h3>
        <table className="w-full border text-sm bg-white">
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
            {abastecimientos.map((a) => (
              <tr key={a.abastecimientoid}>
                <td className="p-2 border">{formatearFechaHoraDDMMYYYY(a.fecha)}</td>
                <td className="p-2 border">{a.vehiculo}</td>
                <td className="p-2 border">{a.chofer}</td>

                <td className="p-2 border text-right">
                  {Number(a.cant_litros).toLocaleString('es-PY', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                
                <td className="p-2 border text-right">
                  {Number(a.kilometrajeactual).toLocaleString('es-PY', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  </td>  
                <td className="p-2 border">{a.lugar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AbastecimientoForm;




















