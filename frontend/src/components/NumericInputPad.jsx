import React, { useState, useRef, useEffect } from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const [showPad, setShowPad] = useState(false);
  const inputRef = useRef(null);
  const padRef = useRef(null);

  const handleButtonClick = (val) => {
    if (val === 'C') {
      onChange('');
    } else if (val === '←') {
      onChange(value.toString().slice(0, -1));
    } else {
      onChange((value || '').toString() + val);
    }
  };

  const formatNumber = (val) => {
    const number = parseFloat(val);
    return isNaN(number)
      ? ''
      : number.toLocaleString('es-PY', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      padRef.current &&
      !padRef.current.contains(event.target)
    ) {
      setShowPad(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={formatNumber(value)}
        onFocus={() => setShowPad(true)}
        readOnly
        className="w-full border p-2 rounded text-right font-mono"
      />
      {showPad && (
        <div
          ref={padRef}
          className="absolute z-10 bg-white border rounded shadow-md grid grid-cols-3 gap-1 p-2 mt-1 w-40"
        >
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '←'].map((val) => (
            <button
              key={val}
              onClick={() => handleButtonClick(val)}
              className="p-2 bg-gray-100 hover:bg-gray-300 rounded text-center text-lg font-medium"
            >
              {val}
            </button>
          ))}
          <button
            onClick={() => handleButtonClick('C')}
            className="col-span-3 p-2 bg-red-100 hover:bg-red-300 rounded text-center font-semibold"
          >
            C
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;







