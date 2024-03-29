  'use client';

import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';
import Goal from './components/Goal';
import Toggle from './components/Toggle';
import { FaDivide, FaPlus, FaTimes, FaMinus, FaUndo } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { Results, Result } from './components/Results';
import { createSolutionUrl, combine } from './utils/general';
import { SpringRef } from 'react-spring';
import Confetti from './components/Confetti';


function randomInstance(n: number, lower: number, upper: number): number[] {
  
  if (n > upper-lower+1) {
      throw new Error("Cannot generate more than upper - lower + 1 unique numbers between lower and upper");
  }

  const uniqueNums = new Set<number>();

  while (uniqueNums.size < n) {
      const randomNum = Math.floor(Math.random() * (upper-lower+1)) + lower; // Random number between [lower-upper]
      uniqueNums.add(randomNum);
  }

  return Array.from(uniqueNums);
}

export default function Home() {

  const SIZE = 6
  const apiURL = "/api/shortsolutions"
  const allLink = "/solutionspace"

  const [isEditable, setEditable] = useState(false);
  const [values, setValues] = useState<Array<number | null>>(randomInstance(SIZE, 2, 25).sort((a, b) => a - b));
  const [visible, setVisible] = React.useState<Array<boolean>>(Array(SIZE).fill(true));
  const [numSelected, setNumSelected] = useState<number | null>(null);
  const [selectedSpringRef, setSelectedSpringRef] = useState<SpringRef | null>(() => null);
  const [opsSelected, setOpsSelected] = useState<string |null>(null);
  const [goalValue, setGoalValue] = useState<number | null>(Math.floor(Math.random() * 400) + 50);
  const [valuesHistory, setValuesHistory] = useState<Array<number | null>[]>([]);
  const [visibilityHistory, setVisibilityHistory] = useState<Array<boolean>[]>([]);
  const [solutions, setSolutions] = useState<Array<Result>>([]);
  const [composites, setComposites] = useState<Array<boolean>>(Array(SIZE).fill(false));
  const [compositesHistory, setCompositesHistory] = useState<Array<boolean>[]>([]);
  const [allLinkBase, setAllLinkBase] = useState<string>("");
  const [confetti, setConfetti] = useState<boolean>(false);
  

  useEffect(() => {
    // This will run whenever selectedSpringRef changes.
    console.log(`EFFECT: ${selectedSpringRef}`);  // should log the new value
  
    // ...
  }, [selectedSpringRef]);

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
    setSelectedSpringRef(null);
    setOpsSelected(null);

  }

  
  async function onNumberClick(index: number, springRef: SpringRef): Promise<void> {
    console.log(`INDEX: ${index}`);
    if (!isEditable) {
      if (numSelected === null || (numSelected !== index && opsSelected === null)) {
        setNumSelected(index);
        setSelectedSpringRef(() => springRef);
        console.log(`SELECTED SPRING REF: ${selectedSpringRef}`);
        console.log(`Num Selected ${numSelected}`);
        console.log(`Spring Ref: ${springRef}`);
      } else if (numSelected === index) {
        setNumSelected(null);
        setOpsSelected(null);
        setSelectedSpringRef(null);
      } else if (numSelected !== null && opsSelected !== null && selectedSpringRef !== null) {
        const x = values[numSelected]
        const y = values[index]
        if (opsSelected === '/' && (y === 0 || (x !== null && y!== null && x % y !== 0))) {
          setOpsSelected(null);
        } else if (x !== null && y !== null) {
          const startPosEl = document.getElementById(`pos-${numSelected}`);
          const endPosEl = document.getElementById(`pos-${index}`);
          if (startPosEl && endPosEl) {
            const startPosRect = startPosEl.getBoundingClientRect();
            const endPosRect = endPosEl.getBoundingClientRect();
            // setStartPos({ x: 0, y: 0 });
            const endPos = { x: endPosRect.x - startPosRect.x, y: endPosRect.y - startPosRect.y };
            console.log(`ENDPOS: ${endPos}`);
            console.log(`Selected Spring Ref: ${selectedSpringRef}`);
            //to: { transform: `translate(${endPos.x}px, ${endPos.y}px)` },
            selectedSpringRef.start({
              to: {x: endPos.x, y: endPos.y},
              config: { tension: 280, friction: 60, duration: 300},
              onRest: () => {
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

                //const solutionsCopy = [...solutions];
                //solutionsCopy.insol.push([x, y]), 
                //solutionsCopy[ops].push(combine(opsSelected, x, y))
                //setSolutions()

                // update the composite history to include the current composites
                setCompositesHistory([...compositesHistory, composites]);
                // copy the composites and update the entry of the new target
                const compositesCopy = [...composites]
                compositesCopy[index] = true;
                setComposites(compositesCopy);

                // move the target to the old position
                selectedSpringRef.start({
                  to: { x: 0, y: 0 },
                  config: { duration: 0 }, // Instant transition
                });

            
                // if we've reached the target then fire the confetti
                if (vals[index] === goalValue) {
                  setConfetti(true);
                }
              }
            });
            setSelectedSpringRef(null);
          }
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

        console.log('compositesHistory: ' + compositesHistory);            
        const oldcomps = compositesHistory.pop();
        if (oldcomps !== undefined) {
          setComposites(oldcomps);
        }
        console.log('compositesHistory: ' + compositesHistory);            

        setOpsSelected(null);
        setNumSelected(null);
        setSelectedSpringRef(null);
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

  async function handleRandom(): Promise<void> {
    setValues(randomInstance(SIZE, 2, 25).sort((a, b) => a - b));
    setGoalValue(Math.floor(Math.random() * 400) + 50);
    setSolutions([]);
    setValuesHistory([]);
    setVisibilityHistory([]);
    setCompositesHistory([]);
    setComposites(Array(SIZE).fill(false));
    setVisible(Array(SIZE).fill(true));
    setOpsSelected(null);
    setConfetti(false);
  }

  async function handleSubmit(): Promise<void> {
    
    const visibleValues = values.filter((_, index) => visible[index]);    
    const url = createSolutionUrl(apiURL, 
                                  goalValue as number, 
                                  visibleValues as number[]);

                            
    const response = await fetch(url);
    const json = await response.json();
    const sols: Array<Result> = [];
    for (const val of json) {
      const ins: number[] = values.filter((value, index): value is number => 
        (!val.outsol.includes(value) && value !== null));
      sols.push({insol: ins, outsol: val.outsol, ops: val.ops});
    } 
    setSolutions(sols);

    const baseurl = createSolutionUrl(allLink, 
      goalValue as number, 
      visibleValues as number[]);

    setAllLinkBase(baseurl);
  }


  return (
    <div className="flex flex-col">
      <div className="flex flex-row-reverse lg:px-0 mb-0 lg:ml-20 mt-5 lg:mt-10 mr-5 lg:mr-20">
        <Toggle isEditable={isEditable} onToggleChange={handleToggleChange} />
        <Button className="mr-5" onClick={(event: any) => handleSubmit()}>Solutions</Button>
        <Button className="mr-5" onClick={(event: any) => handleRandom()}>Random</Button>
      </div>    

      <div className="flex flex-col lg:flex-row w-full">
        <div className="lg:w-1/2 flex flex-col items-center">
          <div className="mt-5 mb-5">
          <Goal value={goalValue} isEditable={isEditable} onGoalChange={handleGoalValueChange} />
          </div>      
          <Grid values={values} 
                numColumns={3} 
                isEditable={isEditable}
                visible={visible}
                selected={numSelected}
                composites={composites}
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
          <Results results={solutions} url={allLinkBase} />
        </div>
  
      </div>
      {confetti && <Confetti />}
    </div>
  
  );
}
