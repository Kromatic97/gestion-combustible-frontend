import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import NumericInputPad from './NumericInputPad';
import Select from 'react-select';

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

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormulario(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));

    if (name === 'VehiculoID' && selectedOption) {
      const vehiculo = vehiculos.find(v => v.vehiculoid === selectedOption.value);
      if (vehiculo) {
        setFormulario(prev => ({ ...prev, KilometrajeActual: vehiculo.kilometrajeodometro }));
      }
    }
  };

  const parseDecimal = (str) => {
    if (typeof str === 'string') {
      return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    }
    return str;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosEnviar = {
        ...formulario,
        KilometrajeActual: parseDecimal(formulario.KilometrajeActual),
        CantLitros: parseDecimal(formulario.CantLitros),
      };

      await axios.post(`${API_BASE_URL}/api/abastecimientos`, datosEnviar);

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

  const formatearFechaHora = (fechaISO) => {
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

        <div>
          <label>Fecha:</label>
          <DatePicker
            selected={formulario.Fecha ? new Date(formulario.Fecha) : null}
            onChange={(date) => setFormulario(prev => ({ ...prev, Fecha: date.toISOString() }))}
            locale="es"
            dateFormat="dd/MM/yyyy"
            placeholderText="Seleccionar fecha"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Vehículo:</label>
          <Select
            name="VehiculoID"
            value={vehiculos.find(v => v.vehiculoid === formulario.VehiculoID) ? {
              value: formulario.VehiculoID,
              label: vehiculos.find(v => v.vehiculoid === formulario.VehiculoID).denominacion
            } : null}
            onChange={handleSelectChange}
            options={vehiculos.map(v => ({ value: v.vehiculoid, label: v.denominacion }))}
            placeholder="Seleccionar vehículo"
            isClearable
          />
        </div>

        <div>
          <label>Kilometraje Actual:</label>
          <NumericInputPad
            value={formulario.KilometrajeActual}
            onChange={(val) => setFormulario(prev => ({ ...prev, KilometrajeActual: val }))}
          />
        </div>

        <div>
          <label>Cantidad de Litros:</label>
          <NumericInputPad
            value={formulario.CantLitros}
            onChange={(val) => setFormulario(prev => ({ ...prev, CantLitros: val }))}
          />
        </div>

        <div>
          <label>Lugar:</label>
          <Select
            name="LugarID"
            value={lugares.find(l => l.lugarid === formulario.LugarID) ? {
              value: formulario.LugarID,
              label: lugares.find(l => l.lugarid === formulario.LugarID).nombrelugar
            } : null}
            onChange={handleSelectChange}
            options={lugares.map(l => ({ value: l.lugarid, label: l.nombrelugar }))}
            placeholder="Seleccionar lugar"
            isClearable
          />
        </div>

        <div>
          <label>Chofer:</label>
          <Select
            name="ChoferID"
            value={choferes.find(c => c.choferid === formulario.ChoferID) ? {
              value: formulario.ChoferID,
              label: choferes.find(c => c.choferid === formulario.ChoferID).nombre
            } : null}
            onChange={handleSelectChange}
            options={choferes.map(c => ({ value: c.choferid, label: c.nombre }))}
            placeholder="Seleccionar chofer"
            isClearable
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Registrar Carga</button>
        </div>
      </form>

      {mensaje && (
        <p className={`mt-4 font-medium ${mensaje.includes('Error') ? 'text-red-600' : 'text-green-700'}`}>
          {mensaje}
        </p>
      )}

      <div className="mt-6 p-4 bg-blue-500 rounded text-white">
        <p className="text-lg font-semibold">Stock Actual</p>
        <p className="text-2xl font-mono">{stock.toLocaleString('es-PY', { minimumFractionDigits: 2 })} litros</p>
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
                <td className="p-2 border">{formatearFechaHora(a.fecha)}</td>
                <td className="p-2 border">{a.vehiculo}</td>
                <td className="p-2 border">{a.chofer}</td>
                <td className="p-2 border text-right">{parseFloat(a.cant_litros).toLocaleString('es-PY', { minimumFractionDigits: 2 })}</td>
                <td className="p-2 border text-right">{parseFloat(a.kilometrajeactual).toLocaleString('es-PY', { minimumFractionDigits: 2 })}</td>
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






















