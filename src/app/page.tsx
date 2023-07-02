'use client';

import React, { FormEvent, useState } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';
import Goal from './components/Goal';
import Toggle from './components/Toggle';
import { Table } from 'flowbite-react';
import { FaDivide, FaPlus, FaTimes, FaMinus, FaUndo } from 'react-icons/fa';


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
  const [valuesHistory, setValuesHistory] = useState<Array<number | null>[]>([]);
  const [visibilityHistory, setVisibilityHistory] = useState<Array<boolean>[]>([]);

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
    <div className="h-screen flex flex-col lg:flex-row items-center justify-center">
      <div className="lg:w-1/2 h-screen flex flex-col items-center justify-center">
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
          <Operation Icon={FaPlus}
                     op="+"
                     disabled={isEditable || !numSelected } 
                     isSelected={opsSelected === "+"} 
                     onOperationClick={onOperationClick} />
          <Operation op="-" 
                     Icon={FaMinus}           
                     disabled={isEditable || !numSelected} 
                     isSelected={opsSelected === "-"}
                     onOperationClick={onOperationClick} />
          <Operation Icon={FaTimes}
                     op="*" 
                     disabled={isEditable || !numSelected} 
                     isSelected={opsSelected === "*"}
                     onOperationClick={onOperationClick} />
          <Operation Icon={FaDivide}
                     op="/" 
                     disabled={isEditable || !numSelected} 
                     isSelected={opsSelected === "/"} 
                     onOperationClick={onOperationClick} />
          <Operation Icon={FaUndo}
                     op="undo" 
                     disabled={isEditable || valuesHistory.length === 0} 
                     isSelected={opsSelected === "undo"}
                     onOperationClick={onOperationClick} />
        </div>
      </div>

      <div className="lg:w-1/2 h-screen flex flex-col items-center justify-center">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>
              Product name
            </Table.HeadCell>
            <Table.HeadCell>
              Color
            </Table.HeadCell>
            <Table.HeadCell>
              Category
            </Table.HeadCell>
            <Table.HeadCell>
              Price
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">
                Edit
              </span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                Apple MacBook Pro 17 &quot;
              </Table.Cell>
              <Table.Cell>
                Sliver
              </Table.Cell>
              <Table.Cell>
                Laptop
              </Table.Cell>
              <Table.Cell>
                $2999
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  href="/tables"
                >
                  <p>
                    Edit
                  </p>
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <p>
                  Microsoft Surface Pro
                </p>
              </Table.Cell>
              <Table.Cell>
                White
              </Table.Cell>
              <Table.Cell>
                Laptop PC
              </Table.Cell>
              <Table.Cell>
                $1999
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  href="/tables"
                >
                  <p>
                    Edit
                  </p>
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                Magic Mouse 2
              </Table.Cell>
              <Table.Cell>
                Black
              </Table.Cell>
              <Table.Cell>
                Accessories
              </Table.Cell>
              <Table.Cell>
                $99
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  href="/tables"
                >
                  <p>
                    Edit
                  </p>
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <p>
                  Google Pixel Phone
                </p>
              </Table.Cell>
              <Table.Cell>
                Gray
              </Table.Cell>
              <Table.Cell>
                Phone
              </Table.Cell>
              <Table.Cell>
                $799
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  href="/tables"
                >
                  <p>
                    Edit
                  </p>
                </a>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                Apple Watch 5
              </Table.Cell>
              <Table.Cell>
                Red
              </Table.Cell>
              <Table.Cell>
                Wearables
              </Table.Cell>
              <Table.Cell>
                $999
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  href="/tables"
                >
                  <p>
                    Edit
                  </p>
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
      
    
  );
}
