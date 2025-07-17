import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function VehiculoForm() {
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    patente: '',
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/vehiculos`, form);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
      alert('❌ Error al registrar vehículo');
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-800">Registrar Vehículo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Marca:</label>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Patente:</label>
            <input
              type="text"
              name="patente"
              value={form.patente}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Registrar Vehículo
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">Vehículo registrado exitosamente</h3>
            <p className="mt-2 text-sm text-gray-500">
              El vehículo fue guardado correctamente. Redirigiendo...
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate('/');
                }}
                className="w-full rounded bg-purple-700 text-white px-4 py-2 font-semibold"
              >
                Volver al Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VehiculoForm;








