// components/ui/ToggleGroup.js
import React from 'react';

const ToggleGroup = ({ children, value, onValueChange, type = 'single' }) => {
  return (
    <div className="flex">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selected: child.props.value === value,
          onClick: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
};

export default ToggleGroup;