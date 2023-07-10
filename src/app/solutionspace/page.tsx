'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSolutionUrl } from '../utils/general';
import { Result, Results } from '../components/Results';

export default function SolutionSpace() {
  const query  = useSearchParams();
  const [solutions, setSolutions] = useState<Array<Result> | null>(null);
  const longURLBase = "/api/allsolutions"

  useEffect(() => {
    if (query.get("goal") && query.get("nums")) {
      const goal = query.get("goal");
      const nums = query.getAll("nums").map(Number);

      const url = createSolutionUrl(longURLBase, 
                                    Number(goal),
                                    nums);

      const fetchData = async () =>  {
        const response = await fetch(url);
        console.log(response);
        const json = await response.json();
        console.log(json);  
        const sols: Array<Result> = [];
        for (const val of json) {
            const ins: number[] = nums.filter((value, index): value is number => 
            (!val.outsol.includes(value) && value !== null));
            sols.push({insol: ins, outsol: val.outsol, ops: val.ops});
        }
        setSolutions(sols);
      }

      fetchData();

    }}, [query]);

  if (solutions === null) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
    <Results results={solutions} url={longURLBase} />
    </div>
  );
}
