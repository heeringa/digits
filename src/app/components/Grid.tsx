import React from 'react';
import NumberView from './NumberView';

interface GridProps {
  values: Array<number>
  numColumns: number;
  isEditable: boolean;
  visible: Array<boolean>;
  selected: number | null;
  onNumberClick: (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleGridViewChange: (index: number, value: number) => void;
}

function Grid({ values, numColumns, isEditable, visible, selected, onNumberClick, handleGridViewChange }: GridProps): JSX.Element {  
  
  const style = `grid grid-cols-${numColumns} gap-4`;
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
          onChange={handleGridViewChange}
        />
      ))}
    </div>
  );
}

export default Grid;
