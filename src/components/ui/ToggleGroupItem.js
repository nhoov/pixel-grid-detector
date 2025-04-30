// components/ui/ToggleGroupItem.js
import React from 'react';

const ToggleGroupItem = ({ value, selected, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded ${selected ? 'bg-blue-500 text-white' : 'bg-white'}`}
    >
      {children}
    </button>
  );
};

export default ToggleGroupItem;