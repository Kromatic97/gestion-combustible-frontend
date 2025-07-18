import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Select from 'react-select';
import API_BASE_URL from '../config';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import NumericInputPad from './NumericInputPad';


registerLocale("es", es);
const customStyles = {
  control: (base) => ({
    ...base,
    padding: '0.25rem',
    borderRadius: '0.375rem',
    borderColor: '#d1d5db',
    boxShadow: 'none',
    '&:hover': { borderColor: '#9ca3af' },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
};
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
          <Select
            options={vehiculos.map(v => ({
              value: v.vehiculoid,
              label: v.denominacion
            }))}
            value={vehiculos.find(v => v.vehiculoid === parseInt(formulario.VehiculoID)) ?
                  { value: formulario.VehiculoID, label: vehiculos.find(v => v.vehiculoid === parseInt(formulario.VehiculoID))?.denominacion } : null}
            onChange={(selected) => {
              const vehiculo = vehiculos.find(v => v.vehiculoid === selected?.value);
              setFormulario(prev => ({
                ...prev,
                VehiculoID: selected?.value || '',
                KilometrajeActual: vehiculo?.kilometrajeodometro || ''
              }));
            }}
            styles={customStyles}
            placeholder="Seleccionar vehículo"
            isClearable
          />
        </div>

        <NumericInputPad
          label="Kilometraje Actual"
          value={formulario.KilometrajeActual}
          onChange={(val) =>
          setFormulario((prev) => ({ ...prev, KilometrajeActual: val }))
          }
          />


       <NumericInputPad
        label="Cantidad de Litros"
        value={formulario.CantLitros}
        onChange={(val) =>
          setFormulario((prev) => ({ ...prev, CantLitros: val }))
        }
        />

        <div>
          <label>Lugar:</label>
          <Select
            options={lugares.map(l => ({
              value: l.lugarid,
              label: l.nombrelugar
            }))}
            value={lugares.find(l => l.lugarid === parseInt(formulario.LugarID)) ?
                  { value: formulario.LugarID, label: lugares.find(l => l.lugarid === parseInt(formulario.LugarID))?.nombrelugar } : null}
            onChange={(selected) =>
              setFormulario(prev => ({
                ...prev,
                LugarID: selected?.value || ''
              }))
            }
            styles={customStyles}
            placeholder="Seleccionar lugar"
            isClearable
          />
        </div>

       <div>
        <label>Chofer:</label>
        <Select
          options={choferes.map(c => ({
            value: c.choferid,
            label: c.nombre
          }))}
          value={choferes.find(c => c.choferid === parseInt(formulario.ChoferID)) ?
                { value: formulario.ChoferID, label: choferes.find(c => c.choferid === parseInt(formulario.ChoferID))?.nombre } : null}
          onChange={(selected) =>
            setFormulario(prev => ({
              ...prev,
              ChoferID: selected?.value || ''
            }))
          }
          styles={customStyles}
          placeholder="Seleccionar chofer"
          isClearable
        />
      </div>

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Registrar Carga</button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-green-700 font-medium">{mensaje}</p>}

      <div className="mt-6 p-4 bg-blue-400 rounded">
        <p className="text-lg font-semibold text-white">Stock Actual</p>

        <p className="text-lg font-bold text-black">{Number(stock).toLocaleString('es-PY',{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,})} litros</p>
      
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




















