import React from 'react';
import styles from './NumberView.module.css';
import { useSpring, SpringRef, animated } from 'react-spring';

interface NumberProps {
  index: number,
  value: number | null,
  springRef: SpringRef
  isEditable: boolean,
  isSelected: boolean,
  isVisible: boolean,
  onNumberClick: (index: number) => void;
  onChange: (index: number, value: number | null) => void;
}

function NumberView({ index, value, springRef, isEditable=true, isSelected=false, isVisible=true, onNumberClick, onChange }:NumberProps): React.JSX.Element {

  const basestyle = "flex items-center justify-center h-24 w-24 rounded-3xl border";
  let style = isEditable ? `${basestyle} ${styles.pulse} border-emerald-200` : `${basestyle} border-gray-800`;
  style = isSelected ? `${style} bg-blue-500 text-white` : `${style} bg-white text-black`;
  style = isVisible ? `${style}` : `${style} opacity-0 pointer-events-none`;
  const spring = useSpring({
    ref: springRef,
    from: { x:0, y:0 }
  })

  return (

    <animated.div
      className={style}
      id={`pos-${index}`}
      style={{ ...spring }} // apply transform here
      onClick={() => onNumberClick(index)}>
      <input 
        className={"border-none bg-transparent text-center text-3xl w-20 focus:ring-0 focus:border-none  " + (isEditable ? "" : " cursor-default select-none")} 
        type="number"
        placeholder=""
        readOnly={!isEditable} 
        value={value === null ? "" : value}
        onChange={event => onChange(index, event.target.valueAsNumber)}
      />
  </animated.div>

  );
}

export default NumberView;
