import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import { CheckCircle } from 'lucide-react';

const RecargaStockForm = ({ abastecimientoFormRef }) => {
  const [formulario, setFormulario] = useState({
    CantLitros: '',
    ChoferID: ''
  });
  const [choferes, setChoferes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [litrosRecargados, setLitrosRecargados] = useState(0);
  const [nombreChofer, setNombreChofer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarChoferes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/choferes`);
        setChoferes(res.data);
      } catch (error) {
        console.error('Error al cargar choferes:', error);
      }
    };
    cargarChoferes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosAEnviar = {
        cantlitros: parseFloat(formulario.CantLitros),
        choferid: parseInt(formulario.ChoferID),
        fecha: new Date().toISOString()
      };

      await axios.post(`${API_BASE_URL}/api/recarga-stock`, datosAEnviar);

      const choferSeleccionado = choferes.find(c => c.choferid === parseInt(formulario.ChoferID));
      setNombreChofer(choferSeleccionado?.nombre || '');
      setLitrosRecargados(formulario.CantLitros);
      setShowModal(true);

      setFormulario({ CantLitros: '', ChoferID: '' });

      if (abastecimientoFormRef?.current?.cargarStock) {
        await abastecimientoFormRef.current.cargarStock();
      }

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error al registrar recarga:', error);
      alert('❌ Error al registrar recarga');
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Recargar Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Cantidad de Litros:</label>
            <input
              type="number"
              name="CantLitros"
              value={formulario.CantLitros}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block">Chofer:</label>
            <select
              name="ChoferID"
              value={formulario.ChoferID}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccionar chofer</option>
              {choferes.map(c => (
                <option key={c.choferid} value={c.choferid}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <button type="submit" className="bg-purple-800 text-white px-6 py-2 rounded">
              Registrar Recarga
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-700">Carga registrada exitosamente</h3>
            <p className="mt-2 text-sm text-gray-700">
              Se registró correctamente la carga de <strong>{litrosRecargados} litros</strong> por el chofer <strong>{nombreChofer}</strong>.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver al panel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecargaStockForm;





