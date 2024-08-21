import React from 'react';

const PropertiesPanel = ({ selectedElement, updateStyle }) => {
  if (!selectedElement) return <div className="properties-panel">Select an element to edit.</div>;

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    updateStyle(selectedElement.id, { [name]: value });
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <label>Top: </label>
      <input
        type="number"
        name="top"
        value={parseInt(selectedElement.style.top, 10)}
        onChange={handleStyleChange}
      />
      <label>Left: </label>
      <input
        type="number"
        name="left"
        value={parseInt(selectedElement.style.left, 10)}
        onChange={handleStyleChange}
      />
      <label>Width: </label>
      <input
        type="text"
        name="width"
        value={selectedElement.style.width || 'auto'}
        onChange={handleStyleChange}
      />
      <label>Height: </label>
      <input
        type="text"
        name="height"
        value={selectedElement.style.height || 'auto'}
        onChange={handleStyleChange}
      />
      <label>Color: </label>
      <input
        type="color"
        name="backgroundColor"
        value={selectedElement.style.backgroundColor || '#ffffff'}
        onChange={handleStyleChange}
      />
    </div>
  );
};

export default PropertiesPanel;