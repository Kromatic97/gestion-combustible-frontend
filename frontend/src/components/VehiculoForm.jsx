import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const VehiculoForm = () => {
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
          <select name="marcaid" value={formulario.marcaid} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Seleccionar marca</option>
            {marcas.map(m => <option key={m.marcaid} value={m.marcaid}>{m.nombremarca}</option>)}
          </select>
        </div>
        <div>
          <label>Modelo:</label>
          <select name="modeloid" value={formulario.modeloid} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Seleccionar modelo</option>
            {modelos.map(m => <option key={m.modeloid} value={m.modeloid}>{m.nombremodelo}</option>)}
          </select>
        </div>
        <div>
          <label>Tipo de Vehículo:</label>
          <select name="tipovehiculoid" value={formulario.tipovehiculoid} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Seleccionar tipo</option>
            {tipos.map(t => <option key={t.tipovehiculoid} value={t.tipovehiculoid}>{t.nombretipo}</option>)}
          </select>
        </div>
        <div>
          <label>Denominación (Patente):</label>
          <input type="text" name="denominacion" value={formulario.denominacion} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label>Kilometraje:</label>
          <input type="number" name="kilometrajeodometro" value={formulario.kilometrajeodometro} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="text-right">
          <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded">Registrar Vehículo</button>
        </div>
      </form>
      {mensaje && <p className="mt-4 text-blue-700 font-medium">{mensaje}</p>}
    </div>
  );
};

export default VehiculoForm;









