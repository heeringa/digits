import React from 'react';
import styles from './NumberView.module.css';

interface NumberProps {
  index: number;
  value: number | null;    
  isEditable: boolean;
  isSelected: boolean;
  isVisible: boolean;
  
  onNumberClick: (index: number) => void;
  onChange: (index: number, value: number | null) => void;

}

function NumberView({ index, value, isEditable=true, isSelected=false, isVisible=true, onNumberClick, onChange }:NumberProps): React.JSX.Element {

  const basestyle = "flex items-center justify-center h-24 w-24 rounded-3xl border border-gray-800";
  let style = isEditable ? `${basestyle} ${styles.pulse}` : `${basestyle}`;
  style = isSelected ? `${style} bg-blue-500 text-white` : `${style} bg-white text-black`;
  style = isVisible ? `${style}` : `${style} opacity-0 pointer-events-none`;
  

  // focus:ring-2 focus:ring-gray-200
  return (
    <div className={style}
         id={`pos-${index}`}
         onClick={() => onNumberClick(index)}>
     <input className={"border-none bg-transparent text-center text-3xl w-20 focus:ring-0 focus:border-none  " + (isEditable ? "" : " cursor-default select-none")} 
            type="number"
            placeholder = ""
            readOnly={!isEditable} 
            value={value === null ? "" : value}
            onChange={event => onChange(index, event.target.valueAsNumber)}
            />
    </div>
  );
}

export default NumberView;
