import React from 'react';

const ToolboxItem = ({ name, onClick }) => {
  return (
    <div className="toolbox-item" onClick={onClick}>
      {name}
    </div>
  );
};

export default ToolboxItem;