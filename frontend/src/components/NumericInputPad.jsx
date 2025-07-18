import React, { useState, useRef, useEffect } from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const [showPad, setShowPad] = useState(false);
  const [internalValue, setInternalValue] = useState(value?.toString() || '');
  const inputRef = useRef(null);
  const padRef = useRef(null);

  // Mostrar pad al enfocar
  const handleFocus = () => {
    setShowPad(true);
  };

  // Ocultar pad solo si clic fuera de input y del pad
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        padRef.current &&
        !padRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowPad(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actualiza valor externo cada vez que cambia interno
  useEffect(() => {
    onChange(internalValue);
  }, [internalValue]);

  const handleButtonClick = (val) => {
    setInternalValue((prev) => prev + val);
  };

  const handleClear = () => {
    setInternalValue('');
  };

  return (
    <div className="relative inline-block w-full">
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onFocus={handleFocus}
        readOnly
        className="w-full border p-2 rounded text-right"
      />

      {showPad && (
        <div
          ref={padRef}
          onMouseDown={(e) => e.preventDefault()} // evita blur inmediato
          className="absolute z-50 bg-white border rounded shadow-md p-2 mt-1 grid grid-cols-3 gap-2"
        >
          {[...'7894561230.'].map((num, i) => (
            <button
              key={i}
              onClick={() => handleButtonClick(num)}
              className="bg-gray-100 hover:bg-gray-300 text-lg rounded p-2"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="col-span-3 bg-red-200 hover:bg-red-300 text-lg rounded p-2"
          >
            C
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;









