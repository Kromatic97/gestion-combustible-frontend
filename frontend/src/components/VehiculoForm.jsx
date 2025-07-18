import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import API_BASE_URL from '../config';

const VehiculoForm = () => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    denominacion: '',
    kilometrajeodometro: '',
    marcaid: '',
    modeloid: '',
    tipovehiculoid: '',
  });

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarMarcas();
    cargarModelos();
    cargarTipos();
  }, []);

  const cargarMarcas = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/marcas`);
    setMarcas(res.data);
  };

  const cargarModelos = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/modelos`);
    setModelos(res.data);
  };

  const cargarTipos = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/tiposvehiculo`);
    setTipos(res.data);
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormulario(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/vehiculos`, formulario);
      setMensaje('Vehículo registrado correctamente ✅');
      setFormulario({
        denominacion: '',
        kilometrajeodometro: '',
        marcaid: '',
        modeloid: '',
        tipovehiculoid: ''
      });

      setTimeout(() => {
        navigate('/abastecimientos');
      }, 3000);

    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      setMensaje('Error al registrar vehículo ❌');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded">
      <h2 className="text-lg font-bold mb-4 text-center text-blue-900">Registrar Vehículo</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">

        <div>
          <label>Marca:</label>
          <Select
            name="marcaid"
            value={marcas.find(m => m.marcaid === formulario.marcaid) ? {
              value: formulario.marcaid,
              label: marcas.find(m => m.marcaid === formulario.marcaid).descripcion
            } : null}
            onChange={handleSelectChange}
            options={marcas.map(m => ({ value: m.marcaid, label: m.descripcion }))}
            placeholder="Seleccionar marca"
            isClearable
          />
        </div>

        <div>
          <label>Modelo:</label>
          <Select
            name="modeloid"
            value={modelos.find(m => m.modeloid === formulario.modeloid) ? {
              value: formulario.modeloid,
              label: modelos.find(m => m.modeloid === formulario.modeloid).nombremodelo
            } : null}
            onChange={handleSelectChange}
            options={modelos.map(m => ({ value: m.modeloid, label: m.nombremodelo }))}
            placeholder="Seleccionar modelo"
            isClearable
          />
        </div>

        <div>
          <label>Tipo de Vehículo:</label>
          <Select
            name="tipovehiculoid"
            value={tipos.find(t => t.tipovehiculoid === formulario.tipovehiculoid) ? {
              value: formulario.tipovehiculoid,
              label: tipos.find(t => t.tipovehiculoid === formulario.tipovehiculoid).tipovehiculo
            } : null}
            onChange={handleSelectChange}
            options={tipos.map(t => ({ value: t.tipovehiculoid, label: t.tipovehiculo }))}
            placeholder="Seleccionar tipo"
            isClearable
          />
        </div>

        <div>
          <label>Denominación:</label>
          <input
            type="text"
            name="denominacion"
            value={formulario.denominacion}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Kilometraje:</label>
          <input
            type="number"
            name="kilometrajeodometro"
            value={formulario.kilometrajeodometro}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Registrar Vehículo
          </button>
        </div>
      </form>

      {mensaje && <p className="mt-4 text-blue-700 font-medium">{mensaje}</p>}
    </div>
  );
};

export default VehiculoForm;










