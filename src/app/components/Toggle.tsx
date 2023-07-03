import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
    isEditable: boolean;
    onToggleChange: (isEditable: boolean) => void;
}

function Toggle({isEditable, onToggleChange}: ToggleProps) {

  return (
    <div className="flex items-center mr-5">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <div className="text-lg mr-2">
            Edit Mode
        </div>
        <div className="relative">
          <input type="checkbox" id="toggle" className="sr-only" checked={isEditable} 
                 onChange={() => onToggleChange(!isEditable)}/>
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div className={isEditable ? `${styles.dot} ${styles['translate-x-full']} bg-green-400` : `${styles.dot} bg-white`}></div>
        </div>
      </label>
    </div>
  );
}

export default Toggle;
