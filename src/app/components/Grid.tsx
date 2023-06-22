import React, { useState } from 'react';
import NumberView from './NumberView';

interface GridProps {
  values: Array<number>
  numColumns: number;
  isEditable: boolean;
  handleGridViewChange: (index: number, value: number) => void;
}

function Grid({ values, numColumns, isEditable, handleGridViewChange }: GridProps): JSX.Element {  
  
  return (
    <div className={`grid grid-cols-${numColumns} gap-4`}>
      {values.map((value, index) => (
        <NumberView 
          key={index}
          index={index} 
          isEditable={isEditable} 
          value={value}
          onChange={handleGridViewChange}
        />
      ))}
    </div>
  );
}

export default Grid;
