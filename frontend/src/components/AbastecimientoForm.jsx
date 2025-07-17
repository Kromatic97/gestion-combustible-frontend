import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

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
    const res = await axios.get(`${API_BASE_URL}/api/vehiculos`);
    setVehiculos(res.data);
  };

  const cargarChoferes = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/choferes`);
    setChoferes(res.data);
  };

  const cargarLugares = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/lugares`);
    setLugares(res.data);
  };

  const cargarStock = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/stock`);
    setStock(res.data.litroactual);
  };

  const cargarAbastecimientos = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/abastecimientos`);
    setAbastecimientos(res.data);
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
    const isoString = date.toISOString();
    setFormulario(prev => ({ ...prev, Fecha: isoString }));
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
      setMensaje('❌ Error al registrar el abastecimiento');
    }
  };

  const formatearFechaHoraDDMMYYYY = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Abastecimiento</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <DatePicker
              selected={formulario.Fecha ? new Date(formulario.Fecha) : null}
              onChange={handleFechaChange}
              locale={es}
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha"
              className="mt-1 w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehículo</label>
            <select name="VehiculoID" value={formulario.VehiculoID} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required>
              <option value="">Seleccionar vehículo</option>
              {vehiculos.map(v => (
                <option key={v.vehiculoid} value={v.vehiculoid}>{v.denominacion}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kilometraje Actual</label>
            <input type="number" name="KilometrajeActual" value={formulario.KilometrajeActual} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantidad de Litros</label>
            <input type="number" name="CantLitros" value={formulario.CantLitros} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lugar</label>
            <select name="LugarID" value={formulario.LugarID} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required>
              <option value="">Seleccionar lugar</option>
              {lugares.map(l => (
                <option key={l.lugarid} value={l.lugarid}>{l.nombrelugar}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chofer</label>
            <select name="ChoferID" value={formulario.ChoferID} onChange={handleChange} className="mt-1 w-full border p-2 rounded-md" required>
              <option value="">Seleccionar chofer</option>
              {choferes.map(c => (
                <option key={c.choferid} value={c.choferid}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Registrar Carga</button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-green-700 font-semibold">{mensaje}</p>}

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <p className="text-lg font-semibold text-blue-700">Stock Actual</p>
        <p className="text-2xl font-mono">{stock} litros</p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Últimos abastecimientos</h3>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Vehículo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Chofer</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Litros</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Kilometraje</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Lugar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {abastecimientos.map((a) => (
                <tr key={a.abastecimientoid}>
                  <td className="px-4 py-2">{formatearFechaHoraDDMMYYYY(a.fecha)}</td>
                  <td className="px-4 py-2">{a.vehiculo}</td>
                  <td className="px-4 py-2">{a.chofer}</td>
                  <td className="px-4 py-2 text-right">{a.cant_litros}</td>
                  <td className="px-4 py-2 text-right">{a.kilometrajeactual}</td>
                  <td className="px-4 py-2">{a.lugar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default AbastecimientoForm;



















