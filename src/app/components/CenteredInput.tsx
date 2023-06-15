import React from 'react';

function CenteredInput({ placeholder = 'Enter text', name }) {
  return (
    <div className="flex items-center justify-center">
      <input
        type="text"
        name={name}
        className="border border-gray-400 rounded px-3 py-2 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export default CenteredInput;
