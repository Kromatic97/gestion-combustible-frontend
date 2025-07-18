import React, { useRef, useEffect } from 'react';

const NumericInputPad = ({ value, onChange, placeholder = '' }) => {
  const inputRef = useRef(null);
  const padRef = useRef(null);

  const handleInputClick = (val) => {
    if (val === 'C') {
      onChange('');
    } else if (val === '←') {
      onChange(value.slice(0, -1));
    } else {
      onChange(value + val);
    }
  };

  const handleClickOutside = (e) => {
    if (
      padRef.current &&
      !padRef.current.contains(e.target) &&
      !inputRef.current.contains(e.target)
    ) {
      padRef.current.style.display = 'none';
    }
  };

  const togglePad = () => {
    if (padRef.current.style.display === 'none' || !padRef.current.style.display) {
      padRef.current.style.display = 'block';
    } else {
      padRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '←', 'C'];

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="text"
        className="w-full border p-2 rounded"
        placeholder={placeholder}
        value={value}
        onClick={(e) => {
          e.stopPropagation();
          togglePad();
        }}
        readOnly
      />

      <div
        ref={padRef}
        className="absolute left-0 z-50 bg-white border rounded shadow-md p-2 grid grid-cols-3 gap-2 mt-1"
        style={{ display: 'none' }}
      >
        {buttons.map((btn) => (
          <button
            key={btn}
            className="bg-gray-100 hover:bg-blue-200 text-lg p-2 rounded focus:outline-none"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // 👈 evita conflicto con selects
              handleInputClick(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumericInputPad;


