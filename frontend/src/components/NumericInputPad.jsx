import React, { useState, useRef, useEffect } from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const [showPad, setShowPad] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPad(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setShowPad(true);
  };

  const handleButtonClick = (char) => {
    if (char === 'C') {
      onChange('');
    } else if (char === '←') {
      onChange(value.slice(0, -1));
    } else {
      onChange(value + char);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={value}
        onClick={handleInputClick}
        readOnly
      />
      {showPad && (
        <div className="absolute z-10 mt-2 bg-white p-2 rounded shadow grid grid-cols-3 gap-2 w-40">
          {[...'7894561230.-'].map(char => (
            <button
              key={char}
              onClick={() => handleButtonClick(char)}
              className="p-2 bg-gray-100 hover:bg-gray-300 rounded text-center"
            >
              {char}
            </button>
          ))}
          <button
            onClick={() => handleButtonClick('←')}
            className="p-2 bg-gray-100 hover:bg-gray-300 rounded text-center"
          >
            ←
          </button>
          <button
            onClick={() => handleButtonClick('C')}
            className="p-2 bg-red-100 hover:bg-red-300 rounded col-span-2 text-center"
          >
            C
          </button>
        </div>
      )}
    </div>
  );
};

export default NumericInputPad;




