import React from 'react';
import NumberView from './NumberView';
import { SpringRef } from 'react-spring';

interface GridProps {
  values: Array<number | null>;
  numColumns: number;
  isEditable: boolean;
  visible: Array<boolean>;
  selected: number | null;
  composites: Array<boolean>;
  onNumberClick: (index: number, springRef: SpringRef) => Promise<void>
  handleGridValuesChange: (index: number, value: number | null) => void;
}

function Grid({ values, numColumns, isEditable, visible, selected, composites, onNumberClick, handleGridValuesChange }: GridProps): JSX.Element {  
  

  //const style = `grid grid-cols-${numColumns} gap-4`;
  const style = "grid grid-cols-3 gap-4";
  return (
    <div className={style}>
      {values.map((value, index) => (
        <NumberView
          key={index}
          index={index} 
          value={value}
          isEditable={isEditable && !composites[index]}
          isSelected={selected === index}
          isVisible={visible[index]} 
          onNumberClick={onNumberClick}
          onChange={handleGridValuesChange}
        />
      ))}
    </div>
  );
}

export default Grid;
