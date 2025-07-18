import React from 'react';

const NumericInputPad = ({ value, onChange }) => {
  const handleClick = (val) => {
    if (val === 'C') {
      onChange('');
    } else if (val === '←') {
      onChange(value.slice(0, -1));
    } else if (val === '.' && value.includes('.')) {
      return;
    } else {
      onChange(value + val);
    }
  };

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '←'],
    ['C']
  ];

  return (
    <div className="inline-block">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2 text-right"
      />
      <div className="grid grid-cols-3 gap-2 bg-gray-100 p-3 rounded shadow-md w-48">
        {keys.flat().map((key, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(key)}
            className={`p-2 rounded text-gray-800 font-semibold border border-gray-300 hover:bg-gray-300 transition ${
              key === 'C' ? 'col-span-3 bg-red-100 hover:bg-red-300' : 'bg-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumericInputPad;



