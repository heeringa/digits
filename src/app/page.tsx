'use client';

//import React, { FormEvent, useState } from 'react';
//import Grid from './components/Grid';

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


import React, { useState, useRef, useEffect } from "react";
//import './App.css';

function App() {
  const [translateX, setTranslateX] = useState(0);
  const circleRef = useRef();

  useEffect(() => {
    const rect = circleRef.current.getBoundingClientRect();
    setTranslateX(rect.x);
  }, []);

  const handleClick = () => {
    setTranslateX(translateX === 0 ? circleRef.current.getBoundingClientRect().x : 0);
  };

  const circleStyle = {
    transform: `translateX(${translateX}px)`,
    transition: 'transform 2s',
  };

  return (
    <div className="container">
      <div className="circle" style={circleStyle} onClick={handleClick}></div>
      <div className="circle" ref={circleRef}></div>
    </div>
  );
}

export default App;


// export default function Home() {
  
//   const SIZE = 6
//   // Change 'any' to your expected API response type
//   const [apiResponse, setApiResponse] = useState<any>(null); 
//   const [isEditable, setEditable] = useState(true);
//   const [values, setValues] = useState(Array<number>(SIZE).fill(0));

//   function handleGridValuesChange(index: number, value: number): void {
//     const newValues = [...values];
//     newValues[index] = value;
//     setValues(newValues);
//   };

//   async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    
//     event.preventDefault();
//     console.log(event);

//     /*
//     const data = new FormData(event.currentTarget);
//     console.log(data);
//     const goal = data.get('goal');
//     data.delete('goal')
//     console.log(goal);
    
//     console.log(Array.from(data.entries()));

//     const inputsAsString = Array.from(data.values()).map(i => `nums=${i}`).join('&');
//     console.log(inputsAsString); // logs "input0=value0&input1=value1&..."
  
//     const url = `/api/solution?goal=${goal}&${inputsAsString}`;
//     const response = await fetch(url);
//     const json = await response.json();
//     console.log(json);
//     for (let [key, value] of Object.entries(json)) {
//       console.log(`Key: ${key}, Value: ${value}`);
//     }
//     setApiResponse(json);
//     console.log(json);   
//     */ 
//   }

//   return (
//     <>
//     <div className="h-screen flex items-center justify-center"> 
//       <Grid values={values} numColumns={3} isEditable={isEditable} handleGridViewChange={handleGridValuesChange} />
//     </div> 
//     <div>
//       {apiResponse && (
//         <pre className="text-white bg-black rounded p-2 mt-4">
//           {JSON.stringify(apiResponse, null, 2)}
//         </pre>
//       )}
//     </div>
//     </>

//     );
// }