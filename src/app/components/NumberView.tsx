import React, { useState } from 'react';
import styles from './NumberView.module.css';

interface NumberProps {
  index: number
  isEditable: boolean;
  value: number;
  onChange: (index: number, value: number) => void;
}

function NumberView({ index, isEditable=true, value, onChange }:NumberProps): React.JSX.Element {

  let basestyle = "flex items-center justify-center h-24 w-24 rounded-3xl border border-gray-800";
  let style = isEditable ? `${basestyle} ${styles.pulse}` : basestyle; 
  // focus:ring-2 focus:ring-gray-200
  return (
    <div className={style}>
     <input className="text-center text-3xl w-20 focus:border-gray-300 
                       focus:outline-none" 
            type="number"
            placeholder = ""
            readOnly={!isEditable} 
            value={value}
            onChange={event => onChange(index, event.target.valueAsNumber)}
            />
    </div>
  );
}

export default NumberView;
