'use client';

import React from 'react';
import { Button } from 'flowbite-react';
import { IconType } from 'react-icons';


interface OperationProps {
  disabled: boolean;
  isSelected: boolean;
  Icon: IconType;
  op: string;
  onOperationClick: (value: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Operation({ disabled=true, isSelected=false, Icon, op, onOperationClick }:OperationProps): React.JSX.Element {


  const basestyle = "flex items-center justify-center";
  const color = isSelected ? "success" : "purple";

  return (
    <div className={basestyle}>
      <Button disabled={disabled} 
              color={color}
              onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onOperationClick(op, event)}>
        <Icon />
      </Button>
    </div>

  );
}

export default Operation;
