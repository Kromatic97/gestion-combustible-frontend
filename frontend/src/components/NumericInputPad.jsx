import React, { useState, useRef } from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const handleClick = (char) => {
    if (char === 'C') {
      onChange('');
    } else if (char === '←') {
      onChange(value.slice(0, -1));
    } else {
      onChange(value + char);
    }
  };

  const buttons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '←'],
    ['C']
  ];

  const handleBlur = () => {
    // Espera breve para permitir clic en el pad antes de ocultarlo
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        readOnly
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
      />
      {isFocused && (
        <div className="absolute z-10 bg-white border rounded shadow-md mt-1 grid grid-cols-3 gap-1 p-2 w-48">
          {buttons.flat().map((char, index) => (
            <button
              key={index}
              type="button"
              className={`py-2 rounded text-sm font-medium 
                ${char === 'C'
                  ? 'bg-red-100 hover:bg-red-200 text-red-700 col-span-3'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
              `}
              onClick={() => handleClick(char)}
            >
              {char}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;






