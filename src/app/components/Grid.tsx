import React from 'react';
import NumberView from './NumberView';

interface GridProps {
  values: Array<number | null>
  numColumns: number;
  isEditable: boolean;
  visible: Array<boolean>;
  selected: number | null;
  onNumberClick: (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleGridValuesChange: (index: number, value: number | null) => void;
}

function Grid({ values, numColumns, isEditable, visible, selected, onNumberClick, handleGridValuesChange }: GridProps): JSX.Element {  
  
  //const style = `grid grid-cols-${numColumns} gap-4`;
  const style = "grid grid-cols-3 gap-4";
  return (
    <div className={style}>
      {values.map((value, index) => (
        <NumberView
          key={index}
          index={index} 
          value={value}
          isEditable={isEditable}
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
