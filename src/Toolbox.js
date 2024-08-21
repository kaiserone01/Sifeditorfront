import React from 'react';
import { useDrag } from 'react-dnd';
import './Toolbox.css';

const ItemTypes = {
  TOOLBOX_ITEM: 'toolbox_item',
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
      <ToolboxItem type="Button" text="Button" />
      <ToolboxItem type="Input" text="Input" />
    </div>
  );
};

export default Toolbox;