'use client';

import React, { FormEvent, useState } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';

function combine(op: string, a: number, b: number): number {
  switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: throw new Error("Unsupported operation");
  }
}

function evalDigitsForDisplay(opsstr: string[], perm: number[]): string[] {
  if (opsstr.length !== perm.length - 1) {
      throw new Error("Invalid input. opsstr length must be equal to perm length - 1.");
  }

  let history: string[] = [];
  let prev: number = perm[0];

  for (let i = 0; i < opsstr.length; i++) {
      let op = opsstr[i];
      let x = perm[i + 1];
      let y = combine(op, prev, x);
      history.push(`${prev} ${op} ${x} = ${y}`);
      prev = y;
  }

  return history;
}



export default function Home() {
  
  const SIZE = 6
  const [isEditable, setEditable] = useState(true);
  const [values, setValues] = useState(Array<number>(SIZE).fill(0));
  const [visible, setVisible] = useState(Array<boolean>(SIZE).fill(true));
  const [numSelected, setNumSelected] = useState<number | null>(null);
  const [opsSelected, setOpsSelected] = useState<string |null>(null);

  function handleGridValuesChange(index: number, value: number): void {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  async function onNumberClick(index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
    console.log(event);
    // if we haven't selected a number yet or if we're selecting a new number without having 
    // selected an operation yet
    if (numSelected === null || (numSelected !== index && opsSelected === null)) {
      setNumSelected(index);
    } else if (numSelected === index) {
      setNumSelected(null);
      setOpsSelected(null);
    } else if (numSelected !== null && opsSelected !== null) {
      let vals = [...values];
      vals[index] = combine(opsSelected, vals[numSelected], vals[index]);
      setValues(vals);
      let v = [...visible];
      v[numSelected] = false;
      setVisible(v);
      setNumSelected(null);
      setOpsSelected(null);
    }
  }

  async function onOperationClick(op: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
    console.log(op);
    console.log(event);
    if (numSelected !== null) {
      if (opsSelected === null || opsSelected !== op) {
        setOpsSelected(op);
      } else if (opsSelected === op) {
        setOpsSelected(null);
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
    {/* </div><div className="h-screen flex items-center justify-center"> */}
      <Grid values={values} 
            numColumns={3} 
            isEditable={isEditable}
            visible={visible}
            selected={numSelected} 
            onNumberClick={onNumberClick} 
            handleGridViewChange={handleGridValuesChange} />
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
    </div>
      
    
  );
}