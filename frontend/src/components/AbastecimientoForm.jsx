import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import NumericInputPad from "./NumericInputPad";

const AbastecimientoForm = () => {
  const [fecha, setFecha] = useState(new Date());
  const [vehiculo, setVehiculo] = useState(null);
  const [chofer, setChofer] = useState(null);
  const [lugar, setLugar] = useState(null);
  const [kilometraje, setKilometraje] = useState("");
  const [litros, setLitros] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [ultimos, setUltimos] = useState([]);
  const [stockActual, setStockActual] = useState(0);
  const [success, setSuccess] = useState(null);
  const [showPad, setShowPad] = useState({ tipo: null });

  useEffect(() => {
    axios.get("/api/vehiculos").then((res) => setVehiculos(res.data));
    axios.get("/api/choferes").then((res) => setChoferes(res.data));
    axios.get("/api/lugares").then((res) => setLugares(res.data));
    obtenerStock();
    obtenerUltimos();
  }, []);

  const obtenerStock = async () => {
    const res = await axios.get("/api/stock");
    setStockActual(Number(res.data.totalLitros || 0));
  };

  const obtenerUltimos = async () => {
    const res = await axios.get("/api/abastecimientos");
    setUltimos(res.data);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        fecha,
        vehiculoid: vehiculo?.value,
        choferid: chofer?.value,
        lugarid: lugar?.value,
        kilometraje: Number(kilometraje),
        litros: Number(litros),
      };

      await axios.post("/api/abastecimientos", payload);
      setSuccess(true);
      obtenerStock();
      obtenerUltimos();
      resetForm();
    } catch (error) {
      console.error(error);
      setSuccess(false);
    }
  };

  const resetForm = () => {
    setVehiculo(null);
    setChofer(null);
    setLugar(null);
    setKilometraje("");
    setLitros("");
  };

  const formatDecimal = (num) =>
    Number(num).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handlePadClick = (value, tipo) => {
    if (tipo === "kilometraje") {
      setKilometraje((prev) =>
        value === "C"
          ? ""
          : value === "←"
          ? prev.slice(0, -1)
          : prev + value
      );
    } else {
      setLitros((prev) =>
        value === "C"
          ? ""
          : value === "←"
          ? prev.slice(0, -1)
          : prev + value
      );
    }
  };

  const handleFocus = (tipo) => {
    setShowPad({ tipo });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowPad({ tipo: null });
    }, 200); // delay para permitir click
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f8f9fa",
      borderColor: "#ced4da",
      minHeight: "38px",
    }),
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Registrar Abastecimiento</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label>Fecha:</label>
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div>
          <label>Vehículo:</label>
          <Select
            value={vehiculo}
            onChange={setVehiculo}
            options={vehiculos.map((v) => ({
              value: v.vehiculoid,
              label: v.denominacion,
            }))}
            styles={customStyles}
            placeholder="Seleccionar vehículo"
          />
        </div>

        <div className="relative">
          <label>Kilometraje Actual:</label>
          <input
            type="text"
            value={kilometraje}
            onFocus={() => handleFocus("kilometraje")}
            onBlur={handleBlur}
            readOnly
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
          {showPad.tipo === "kilometraje" && (
            <NumericInputPad
              onClick={(val) => handlePadClick(val, "kilometraje")}
            />
          )}
        </div>

        <div className="relative">
          <label>Cantidad de Litros:</label>
          <input
            type="text"
            value={litros}
            onFocus={() => handleFocus("litros")}
            onBlur={handleBlur}
            readOnly
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
          {showPad.tipo === "litros" && (
            <NumericInputPad
              onClick={(val) => handlePadClick(val, "litros")}
            />
          )}
        </div>

        <div>
          <label>Lugar:</label>
          <Select
            value={lugar}
            onChange={setLugar}
            options={lugares.map((l) => ({
              value: l.lugarid,
              label: l.nombre,
            }))}
            styles={customStyles}
            placeholder="Seleccionar lugar"
          />
        </div>

        <div>
          <label>Chofer:</label>
          <Select
            value={chofer}
            onChange={setChofer}
            options={choferes.map((c) => ({
              value: c.choferid,
              label: c.nombre,
            }))}
            styles={customStyles}
            placeholder="Seleccionar chofer"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Registrar Carga
        </button>
      </div>

      {success === true && (
        <p className="text-green-600 mt-2">✔ Abastecimiento registrado correctamente</p>
      )}
      {success === false && (
        <p className="text-red-600 mt-2">❌ Error al registrar el abastecimiento</p>
      )}

      <div className="mt-6 bg-blue-500 text-white p-4 rounded">
        <p className="font-bold">Stock Actual</p>
        <p className="text-lg">{formatDecimal(stockActual)} litros</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Últimos abastecimientos</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Fecha</th>
              <th className="border px-2 py-1">Vehículo</th>
              <th className="border px-2 py-1">Chofer</th>
              <th className="border px-2 py-1">Litros</th>
              <th className="border px-2 py-1">Kilometraje</th>
              <th className="border px-2 py-1">Lugar</th>
            </tr>
          </thead>
          <tbody>
            {ultimos.map((ab, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{new Date(ab.fecha).toLocaleString()}</td>
                <td className="border px-2 py-1">{ab.vehiculo}</td>
                <td className="border px-2 py-1">{ab.chofer}</td>
                <td className="border px-2 py-1">{formatDecimal(ab.litros)}</td>
                <td className="border px-2 py-1">{formatDecimal(ab.kilometraje)}</td>
                <td className="border px-2 py-1">{ab.lugar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AbastecimientoForm;























