import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const RecargaStockForm = ({ abastecimientoFormRef }) => {
  const [formulario, setFormulario] = useState({
    CantLitros: '',
    ChoferID: ''
  });
  const [choferes, setChoferes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [infoModal, setInfoModal] = useState({ litros: 0, choferNombre: '' });

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

      const chofer = choferes.find(c => c.choferid === parseInt(formulario.ChoferID));
      setInfoModal({
        litros: formulario.CantLitros,
        choferNombre: chofer?.nombre || 'Desconocido'
      });

      setFormulario({ CantLitros: '', ChoferID: '' });
      setModalAbierto(true);

      if (abastecimientoFormRef?.current?.cargarStock) {
        await abastecimientoFormRef.current.cargarStock();
      }

      // Cierra el modal automáticamente en 3 segundos
      setTimeout(() => {
        setModalAbierto(false);
        setInfoModal({ litros: 0, choferNombre: '' });
      }, 3000);

    } catch (error) {
      console.error('Error al registrar recarga:', error);
      alert("❌ Error al registrar recarga");
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Recargar Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-sm text-gray-700">Cantidad de Litros:</label>
            <input
              type="number"
              name="CantLitros"
              value={formulario.CantLitros}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700">Chofer:</label>
            <select
              name="ChoferID"
              value={formulario.ChoferID}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            <button type="submit" className="bg-purple-800 text-white px-6 py-2 rounded hover:bg-purple-900 transition">
              Registrar Recarga
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-2">✅ Recarga registrada</h3>
            <p className="text-gray-800 mb-4">
              Se registró correctamente la carga de <strong>{infoModal.litros} litros</strong> por el chofer <strong>{infoModal.choferNombre}</strong>.
            </p>
            <button
              onClick={() => {
                setModalAbierto(false);
                setInfoModal({ litros: 0, choferNombre: '' });
              }}
              className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecargaStockForm;




