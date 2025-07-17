import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import API_BASE_URL from '../config';

registerLocale('es', es);

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
  const [fechaPicker, setFechaPicker] = useState(null);

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

  const handleFechaChange = (date) => {
    setFechaPicker(date);
    const fechaISO = date?.toISOString() || '';
    setFormulario(prev => ({ ...prev, Fecha: fechaISO }));
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
      setFechaPicker(null);
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
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Registrar Abastecimiento</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Fecha:</label>
          <DatePicker
            selected={fechaPicker}
            onChange={handleFechaChange}
            dateFormat="dd/MM/yyyy"
            locale="es"
            className="w-full border rounded p-2"
            placeholderText="Seleccionar fecha"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Vehículo:</label>
          <select name="VehiculoID" value={formulario.VehiculoID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map(v => (
              <option key={v.vehiculoid} value={v.vehiculoid}>{v.denominacion}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Kilometraje Actual:</label>
          <input type="number" name="KilometrajeActual" value={formulario.KilometrajeActual} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cantidad de Litros:</label>
          <input type="number" name="CantLitros" value={formulario.CantLitros} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Lugar:</label>
          <select name="LugarID" value={formulario.LugarID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar lugar</option>
            {lugares.map(l => (
              <option key={l.lugarid} value={l.lugarid}>{l.nombrelugar}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Chofer:</label>
          <select name="ChoferID" value={formulario.ChoferID} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Seleccionar chofer</option>
            {choferes.map(c => (
              <option key={c.choferid} value={c.choferid}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded shadow">Registrar Carga</button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-green-700 font-medium">{mensaje}</p>}

      <div className="mt-6 p-4 bg-blue-100 rounded">
        <p className="text-lg font-semibold text-green-800">Stock Actual</p>
        <p className="text-2xl font-mono">{stock} litros</p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Últimos abastecimientos</h3>
        <table className="w-full border text-sm bg-white rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Vehículo</th>
              <th className="p-2 border">Chofer</th>
              <th className="p-2 border text-right">Litros</th>
              <th className="p-2 border text-right">Kilometraje</th>
              <th className="p-2 border">Lugar</th>
            </tr>
          </thead>
          <tbody>
            {abastecimientos.map((a) => (
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
      </div>
    </div>
  );
});

export default AbastecimientoForm;

















