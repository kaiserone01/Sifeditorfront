import React from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
import update from 'immutability-helper';

const ItemTypes = {
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
          updateStyle={(id, newStyles) => {
            const index = screen.findIndex((i) => i.id === id);
            const updatedScreen = update(screen, {
              [index]: { style: { $set: { ...screen[index].style, ...newStyles } } },
            });
            setScreen(updatedScreen);
          }}
          onClick={(id) => setSelectedElement(screen.find((i) => i.id === id))}
        />
      ))}
    </div>
  );
};

export default Editor;