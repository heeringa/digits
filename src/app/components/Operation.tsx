import React from 'react';

interface OperationProps {
  isEditable: boolean;
  isSelected: boolean;
  value: string;
  onOperationClick: (value: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function Operation({ isEditable=true, isSelected=false, value, onOperationClick }:OperationProps): React.JSX.Element {

  const basestyle = "flex items-center justify-center h-12 w-12 rounded-full border border-gray-800";
  let style = isEditable ? `${basestyle}` : basestyle; 
  style = isSelected ? `${style} bg-blue-800 text-white` : `${style} bg-white text-black`
  // focus:ring-2 focus:ring-gray-200
  
  return (
    <div className={style}
         onClick={event => onOperationClick(value, event)}>
     <input className="text-center text-2xl w-8 focus:border-gray-300 bg-transparent 
                       focus:outline-none" 
            readOnly={true}
            value={value}
            />
    </div>
  );
}

export default Operation;
