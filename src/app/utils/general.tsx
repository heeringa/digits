
export function createSolutionUrl(pathname: string, goal: number, nums: Array<number>): string {
    const inputsAsString = nums.map(i => `nums=${i}`).join('&');  
    const url = `${pathname}?goal=${goal}&${inputsAsString}`;
    return url;
}


export function combine(op: string, a: number, b: number): number {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: throw new Error("Unsupported operation");
    }
  }
  

