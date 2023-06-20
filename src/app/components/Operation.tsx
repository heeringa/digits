import React, { useState } from 'react';

interface OperationProps {
  isEditable: boolean;
  value: string;
  onOperationClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}

function Operation({ isEditable=true, value, onOperationClick }:OperationProps): React.JSX.Element {

  let basestyle = "flex items-center justify-center h-12 w-12 rounded-full border border-gray-800";
  let style = isEditable ? `${basestyle}` : basestyle; 
  // focus:ring-2 focus:ring-gray-200
  return (
    <div className={style}>
     <input className="text-center text-2xl w-8 focus:border-gray-300 
                       focus:outline-none" 
            readOnly={true}
            value={value}
            onClick={event => onOperationClick(event)}
            />
    </div>
  );
}

export default Operation;
