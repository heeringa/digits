'use client';

import React, { FormEvent, useState } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';
import Goal from './components/Goal';
import Toggle from './components/Toggle';
import { FaDivide, FaPlus, FaTimes, FaMinus, FaUndo } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { Results, Result } from './components/Results';


function combine(op: string, a: number, b: number): number {
  switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: throw new Error("Unsupported operation");
  }
}

export default function Home() {
  
  const SIZE = 6
  const R1: Result = {
    insol: [1, 2, 3],
    outsol: [4],
    ops: ["1+2", "3+3"]
  }
  const R2: Result = {
    insol: [1, 2, 3, 4],
    outsol: [5, 6],
    ops: ["3+4", "1+2", "7+3"]
  }

  const RS: Array<Result> = [R1, R2];

  const [isEditable, setEditable] = useState(false);
  const [values, setValues] = useState<Array<number | null>>([3,5,12,14,15,17]);
  const [visible, setVisible] = React.useState<Array<boolean>>(Array(SIZE).fill(true));
  const [numSelected, setNumSelected] = useState<number | null>(null);
  const [opsSelected, setOpsSelected] = useState<string |null>(null);
  const [goalValue, setGoalValue] = useState<number | null>(492);
  const [valuesHistory, setValuesHistory] = useState<Array<number | null>[]>([]);
  const [visibilityHistory, setVisibilityHistory] = useState<Array<boolean>[]>([]);
  const [solutions, setSolutions] = useState<Array<Result>>([]);

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

  async function onNumberClick(index: number): Promise<void> {
    console.log(index);
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
          setValuesHistory([...valuesHistory, values]);
          setVisibilityHistory([...visibilityHistory, visible]);
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

  async function onOperationClick(op: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    console.log(op);
    console.log(event);
    if (!isEditable) {
      if (op === 'undo' && (valuesHistory.length > 0) ) {
        console.log('valuesHistory: ' + valuesHistory);
        const oldvals = valuesHistory.pop();
        if (oldvals !== undefined) {
          setValues(oldvals);
        }
        console.log('valuesHistory: ' + valuesHistory);    
        console.log('visibilityHistory: ' + visibilityHistory);            
        const oldviz = visibilityHistory.pop();
        if (oldviz !== undefined) {
          setVisible(oldviz);
        }
        console.log('visibilityHistory: ' + visibilityHistory);
        setOpsSelected(null);
        setNumSelected(null);
      } else {
        if (numSelected !== null) {
          if (opsSelected === null || opsSelected !== op) {
            setOpsSelected(op);
          } else if (opsSelected === op) {
            setOpsSelected(null);
          } 
        }
      }
    }
  }

  async function handleSubmit(): Promise<void> {
    
    const goal = goalValue;
    console.log(goal);
    
    const visibleValues = values.filter((_, index) => visible[index]);
    console.log(visibleValues);
    
    const inputsAsString = visibleValues.map(i => `nums=${i}`).join('&');
    console.log(inputsAsString); // logs "input0=value0&input1=value1&..."
  
    const url = `/api/shortsolution?goal=${goal}&${inputsAsString}`;
    const response = await fetch(url);
    console.log(response);
    const json = await response.json();
    console.log(json);
    const sols: Array<Result> = [];
    for (const val of json) {
      sols.push({insol: val.insol, outsol: val.outsol, ops: val.ops});
    } 
    /* for (let [key, value] of Object.entries(json)) {
      sols.push({insol: [], outsol: key.split(",").map(Number), ops: value});
      console.log(`Key: ${key}, Value: ${value}`);
      console.log(`Key: ${key}, ${key.split(",").map(Number)}`);
    }
     */
    setSolutions(sols);
    console.log(`SOLUTIONS: ${solutions}`);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row-reverse px-4 lg:px-0 mb-0 ml-20 mt-10 mr-20">
        <Toggle isEditable={isEditable} onToggleChange={handleToggleChange} />
        <Button className="mr-5" onClick={event => handleSubmit()}>Find Solutions</Button>
      </div>    

      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-1/2 flex flex-col items-center">
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
            <Operation Icon={FaPlus}
                      op="+"
                      disabled={isEditable || numSelected === null } 
                      isSelected={opsSelected === "+"} 
                      onOperationClick={onOperationClick} />
            <Operation op="-" 
                      Icon={FaMinus}           
                      disabled={isEditable || numSelected === null } 
                      isSelected={opsSelected === "-"}
                      onOperationClick={onOperationClick} />
            <Operation Icon={FaTimes}
                      op="*" 
                      disabled={isEditable || numSelected === null }
                      isSelected={opsSelected === "*"}
                      onOperationClick={onOperationClick} />
            <Operation Icon={FaDivide}
                      op="/" 
                      disabled={isEditable || numSelected === null }
                      isSelected={opsSelected === "/"} 
                      onOperationClick={onOperationClick} />
            <Operation Icon={FaUndo}
                      op="undo" 
                      disabled={isEditable || valuesHistory.length === 0} 
                      isSelected={opsSelected === "undo"}
                      onOperationClick={onOperationClick} />
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col items-center mt-5">
          <Results results={solutions} />
        </div>
  
      </div>
    </div>
  
  );
}
