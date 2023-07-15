'use client';

import React, { useState } from 'react';
import Grid from './components/Grid';
import Operation from './components/Operation';
import Goal from './components/Goal';
import Toggle from './components/Toggle';
import { FaDivide, FaPlus, FaTimes, FaMinus, FaUndo } from 'react-icons/fa';
import { Button } from 'flowbite-react';
import { Results, Result } from './components/Results';
import { createSolutionUrl, combine } from './utils/general';
import { useSpringRef, SpringRef } from 'react-spring';

export default function Home() {
  
  const SIZE = 6
  const apiURL = "/api/shortsolutions"
  const allLink = "/solutionspace"

  const [isEditable, setEditable] = useState(false);
  const [values, setValues] = useState<Array<number | null>>([3,5,12,14,15,17]);
  const [visible, setVisible] = React.useState<Array<boolean>>(Array(SIZE).fill(true));
  const [numSelected, setNumSelected] = useState<number | null>(null);
  const [opsSelected, setOpsSelected] = useState<string |null>(null);
  const [goalValue, setGoalValue] = useState<number | null>(492);
  const [valuesHistory, setValuesHistory] = useState<Array<number | null>[]>([]);
  const [visibilityHistory, setVisibilityHistory] = useState<Array<boolean>[]>([]);
  const [solutions, setSolutions] = useState<Array<Result>>([]);
  const [composites, setComposites] = useState<Array<boolean>>(Array(SIZE).fill(false));
  const [compositesHistory, setCompositesHistory] = useState<Array<boolean>[]>([]);
  const [allLinkBase, setAllLinkBase] = useState<string>("");
  const [springRefs, setSpringRefs] = useState<Array<SpringRef>>(Array.from({ length: SIZE }, () => useSpringRef()));
  

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

  function shouldHighlight(index: number): boolean {
    return numSelected !== null || (numSelected !== index && opsSelected === null);
  }
  async function onNumberClick(index: number): Promise<void> {
    console.log(index);
    if (!isEditable) {
      if (shouldHighlight(index)) {
        setNumSelected(index);
      } else if (numSelected === index) {
        setNumSelected(null);
        setOpsSelected(null);
      } else if (numSelected !== null && opsSelected !== null) {
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
            console.log(endPos);
            //to: { transform: `translate(${endPos.x}px, ${endPos.y}px)` },
            springRefs[numSelected].start({
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

                // update the composite history to include the current composites
                setCompositesHistory([...compositesHistory, composites]);
                // copy the composites and update the entry of the new target
                const compositesCopy = [...composites]
                compositesCopy[index] = true;
                setComposites(compositesCopy);

                // move the target to the old position
                springRefs[numSelected].start({
                  to: { x: 0, y: 0 },
                  config: { duration: 0 }, // Instant transition
                });
              }
            });
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
                springRefs={springRefs}
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
    </div>
  
  );
}
