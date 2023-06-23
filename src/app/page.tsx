'use client';

import React, { FormEvent, useState } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';
import Goal from './components/Goal';
import Toggle from './components/Toggle';


function combine(op: string, a: number, b: number): number {
  switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: throw new Error("Unsupported operation");
  }
}

/* 
function evalDigitsForDisplay(opsstr: string[], perm: number[]): string[] {
  if (opsstr.length !== perm.length - 1) {
      throw new Error("Invalid input. opsstr length must be equal to perm length - 1.");
  }

  const history: string[] = [];
  let prev: number = perm[0];

  for (let i = 0; i < opsstr.length; i++) {
      const op = opsstr[i];
      const x = perm[i + 1];
      const y = combine(op, prev, x);
      history.push(`${prev} ${op} ${x} = ${y}`);
      prev = y;
  }

  return history;
}
 */


export default function Home() {
  
  const SIZE = 6
  const [isEditable, setEditable] = useState(false);
  const [values, setValues] = useState(Array<number | null>(SIZE).fill(null));
  const [visible, setVisible] = useState(Array<boolean>(SIZE).fill(true));
  const [numSelected, setNumSelected] = useState<number | null>(null);
  const [opsSelected, setOpsSelected] = useState<string |null>(null);
  const [goalValue, setGoalValue] = useState<number | null>(42);

  function massage(n: number | null): number | null {
    return (n !== null && !isNaN(n)) ? n : null;
  }

  function handleGridValuesChange(index: number, value: number | null): void {
    const newValues = [...values];
    newValues[index] = massage(value);
    setValues(newValues);
  }

  function handleGoalValueChange(value: number | null): void {
    setGoalValue(massage(value));
  }

  function handleToggleChange(value: boolean): void {
    setEditable(value);
    setNumSelected(null);
    setOpsSelected(null);
  }

  async function onNumberClick(index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
    if (!isEditable) {
      if (numSelected === null || (numSelected !== index && opsSelected === null)) {
        setNumSelected(index);
      } else if (numSelected === index) {
        setNumSelected(null);
        setOpsSelected(null);
      } else if (numSelected !== null && opsSelected !== null) {
        const x = values[numSelected]
        const y = values[index]
        if (opsSelected === '/' && (y == 0 || (x !== null && y!== null && x % y !== 0))) {
          setOpsSelected(null);
        } else if (x !== null && y !== null) {
          const vals = [...values];
          vals[index] = combine(opsSelected, x, y);
          setValues(vals);
          const v = [...visible];
          v[numSelected] = false;
          setVisible(v);
          setNumSelected(null);
          setOpsSelected(null);
        }
      }
    }
  }

  async function onOperationClick(op: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
    console.log(op);
    console.log(event);
    if (!isEditable) {
      if (numSelected !== null) {
        if (opsSelected === null || opsSelected !== op) {
          setOpsSelected(op);
        } else if (opsSelected === op) {
          setOpsSelected(null);
        } 
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    
    event.preventDefault();
    console.log(event);

    /*
    const data = new FormData(event.currentTarget);
    console.log(data);
    const goal = data.get('goal');
    data.delete('goal')
    console.log(goal);
    
    console.log(Array.from(data.entries()));

    const inputsAsString = Array.from(data.values()).map(i => `nums=${i}`).join('&');
    console.log(inputsAsString); // logs "input0=value0&input1=value1&..."
  
    const url = `/api/solution?goal=${goal}&${inputsAsString}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    for (let [key, value] of Object.entries(json)) {
      console.log(`Key: ${key}, Value: ${value}`);
    }
    setApiResponse(json);
    console.log(json);   
    */ 
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Toggle isEditable={isEditable} onToggleChange={handleToggleChange}></Toggle>
      <div className="mb-10">
      <Goal value={goalValue} isEditable={isEditable} onGoalChange={handleGoalValueChange} />
      </div>      
      <Grid values={values} 
            numColumns={3} 
            isEditable={isEditable}
            visible={visible}
            selected={numSelected} 
            onNumberClick={onNumberClick} 
            handleGridValuesChange={handleGridValuesChange} />
      <div className="flex mt-6 gap-2">
        <Operation value="+" 
                   isEditable={isEditable} 
                   isSelected={opsSelected === "+"} 
                   onOperationClick={onOperationClick} />
        <Operation value="-" 
                   isEditable={isEditable} 
                   isSelected={opsSelected === "-"}
                   onOperationClick={onOperationClick} />
        <Operation value="*" 
                   isEditable={isEditable} 
                   isSelected={opsSelected === "*"}
                   onOperationClick={onOperationClick} />
        <Operation value="/" 
                   isEditable={isEditable} 
                   isSelected={opsSelected === "/"} 
                   onOperationClick={onOperationClick} />
        <Operation value="🔙" 
                   isEditable={isEditable} 
                   isSelected={opsSelected === "🔙"}
                   onOperationClick={onOperationClick} />
      </div>

      <div className="w-[400px] h-[400px] overflow-auto border border-black-400 mt-10">
      First line of text.<br />
      Second line of text.
      </div>
    </div>
      
    
  );
}
