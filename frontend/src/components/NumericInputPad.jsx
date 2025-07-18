import React, { useState, useEffect, useRef } from 'react';

const NumericInputPad = ({ label, value, onChange }) => {
  const [showPad, setShowPad] = useState(false);
  const inputRef = useRef(null);
  const padRef = useRef(null);

  const handleKeyPress = (key) => {
    if (key === '←') {
      onChange(value.slice(0, -1));
    } else if (key === 'C') {
      onChange('');
    } else {
      onChange(value + key);
    }
  };

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ',', '←', 'C'];

  // Cerrar el pad al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        padRef.current &&
        !padRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowPad(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onFocus={() => setShowPad(true)}
        readOnly
        className="w-full border p-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      {showPad && (
        <div
          ref={padRef}
          className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg grid grid-cols-3 gap-2 p-3 w-40"
        >
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm font-semibold"
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;

