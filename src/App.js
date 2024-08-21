import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import update from 'immutability-helper';
import './App.css';

const ItemTypes = {
  BOX: 'box',
  TOOLBOX_ITEM: 'toolbox_item',
};

const DraggableBox = ({ id, text, style, updateStyle, onClick }) => {
  return (
    <Rnd
      style={{ ...style, border: '1px solid #ccc', padding: '10px', cursor: 'move' }}
      position={{ x: parseInt(style.left, 10), y: parseInt(style.top, 10) }}
      onDragStop={(e, d) => updateStyle(id, { top: `${d.y}px`, left: `${d.x}px` })}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateStyle(id, {
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: ref.style.width,
          height: ref.style.height,
        });
      }}
      onClick={() => onClick(id)}
    >
      {text}
    </Rnd>
  );
};

const Editor = ({ screen, setScreen, setSelectedElement }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TOOLBOX_ITEM,
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      addBox(item.type, offset);
    },
  });

  const addBox = (type, offset) => {
    const id = `${type}_${Date.now()}`;
    const newBox = {
      id,
      text: type,
      style: {
        top: `${offset.y}px`,
        left: `${offset.x}px`,
        position: 'absolute',
        width: '100px',
        height: '50px',
      },
    };
    setScreen((prevScreen) => [...prevScreen, newBox]);
  };

  const updateStyle = (id, newStyles) => {
    const index = screen.findIndex((item) => item.id === id);
    const updatedScreen = update(screen, {
      [index]: { style: { $set: { ...screen[index].style, ...newStyles } } },
    });
    setScreen(updatedScreen);
  };

  return (
    <div ref={drop} className="editor">
      {screen.map((item) => (
        <DraggableBox
          key={item.id}
          id={item.id}
          text={item.text}
          style={item.style}
          updateStyle={updateStyle}
          onClick={setSelectedElement}
        />
      ))}
    </div>
  );
};

const ToolboxItem = ({ type, text }) => {
  const [, ref] = useDrag({
    type: ItemTypes.TOOLBOX_ITEM,
    item: { type },
  });
  return (
    <div ref={ref} className="toolbox-item">
      {text}
    </div>
  );
};

const Toolbox = () => {
  return (
    <div className="toolbox">
      <ToolboxItem type="Label" text="Label" />
      <ToolboxItem type="Input" text="Input" />
      <ToolboxItem type="Button" text="Button" />
    </div>
  );
};

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

const App = () => {
  const [screen, setScreen] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    const fetchScreen = async () => {
      const response = await axios.get('http://localhost:3001/api/get-screen');
      setScreen(response.data);
    };
    fetchScreen();
  }, []);

  const saveScreen = async () => {
    const response = await axios.post('http://localhost:3001/api/save-screen', {
      screen,
    });
    console.log(response.data);
  };

  const resetScreen = () => {
    setScreen([]);
    setSelectedElement(null);
  };

  const handleElementClick = (id) => {
    const element = screen.find((item) => item.id === id);
    setSelectedElement(element);
  };

  const updateStyle = (id, newStyles) => {
    const index = screen.findIndex((item) => item.id === id);
    const updatedScreen = update(screen, {
      [index]: { style: { $set: { ...screen[index].style, ...newStyles } } },
    });
    setScreen(updatedScreen);

    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, style: { ...selectedElement.style, ...newStyles } });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Editor de Pantallas</h1>
        <div className="main-container">
          <Toolbox />
          <Editor screen={screen} setScreen={setScreen} setSelectedElement={handleElementClick} />
          <PropertiesPanel selectedElement={selectedElement} updateStyle={updateStyle} />
        </div>
        <div className="button-container">
          <button className="action-button" onClick={saveScreen}>Guardar Pantalla</button>
          <button className="action-button" onClick={resetScreen}>Resetear Pantalla</button>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;