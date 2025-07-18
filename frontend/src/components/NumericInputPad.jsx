import React, { useState } from 'react';

const NumericInputPad = ({ label, value, onChange }) => {
  const [showPad, setShowPad] = useState(false);

  const handleKeyPress = (key) => {
    if (key === '←') {
      onChange(value.slice(0, -1));
    } else if (key === 'C') {
      onChange('');
    } else {
      onChange(value + key);
    }
  };

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '←', 'C'];

  return (
    <div className="relative">
      <label className="block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onFocus={() => setShowPad(true)}
        readOnly
        className="w-full border p-2 rounded"
      />
      {showPad && (
        <div className="absolute bg-white border rounded shadow p-2 grid grid-cols-3 gap-2 z-50 mt-1">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
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
