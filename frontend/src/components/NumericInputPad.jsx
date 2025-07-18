import React, { useState, useRef, useEffect } from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const [showPad, setShowPad] = useState(false);
  const inputRef = useRef(null);
  const padRef = useRef(null);

  const handleInputFocus = () => {
    setShowPad(true);
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

  const handleButtonClick = (digit) => {
    const newValue = (value || '') + digit;
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleBackspace = () => {
    onChange((value || '').slice(0, -1));
  };

  return (
    <div className="relative inline-block w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onFocus={handleInputFocus}
        readOnly
        className="w-full border p-2 rounded"
      />

      {showPad && (
        <div
          ref={padRef}
          className="absolute z-50 bg-white border border-gray-300 rounded shadow p-2 mt-1 grid grid-cols-3 gap-1 w-40"
        >
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => handleButtonClick(num.toString())}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 rounded"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleButtonClick('0')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 rounded"
          >
            0
          </button>
          <button
            onClick={() => handleButtonClick('.')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 rounded"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 rounded"
          >
            ←
          </button>
          <button
            onClick={handleClear}
            className="col-span-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-1 rounded mt-1"
          >
            C
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;








