'use client';

import React, { FormEvent, useState } from 'react';
import Form from './components/Form';

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
  
  // Change 'any' to your expected API response type
  const [apiResponse, setApiResponse] = useState<any>(null); 

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    
    event.preventDefault();
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
  }

  return (
    <>
    <div className="h-screen flex items-center justify-center">
      <Form numColumns={6} handleSubmit={handleSubmit}/>
    </div>
    <div>
      {apiResponse && (
        <pre className="text-white bg-black rounded p-2 mt-4">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
    </div>
    </>
    );
}