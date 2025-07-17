import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { CheckCircle } from 'lucide-react';

function ChoferForm() {
  const [nombre, setNombre] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/choferes`, { nombre });
      setModalAbierto(true);
      setNombre('');

      setTimeout(() => {
        setModalAbierto(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error registrando chofer:', error);
      alert('❌ Error al registrar el chofer');
    }
  };

  return (
    <>
      {/* Formulario */}
      <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Registrar Chofer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre del Chofer:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800 transition"
          >
            Registrar Chofer
          </button>
        </form>
      </div>

      {/* Modal de confirmación */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-green-700">Chofer registrado exitosamente</h3>
            <p className="mt-2 text-sm text-gray-600">
              Se registró correctamente el chofer <strong>{nombre}</strong>.
            </p>
            <button
              onClick={() => {
                setModalAbierto(false);
                navigate('/');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Volver al panel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChoferForm;




