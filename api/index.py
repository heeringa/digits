from typing import List, Optional
from fastapi import FastAPI, Query
import queue


def combine(op: str, x: int, y: int) -> int:
    """
    Combine two numbers with the given operation.
    @param op: the operation as a string
    @param x: the first number
    @param y: the second number
    @return: the result of the operation
    @raise ValueError: if the operation is not +, -, *, or /
    """
    if op == '+':
        return x + y
    elif op == '-':
        return x - y
    elif op == '*':
        return x * y
    elif op == '/':
        return x // y
    else:
        raise ValueError('Invalid operation: ' + op)


def generate_solutions(digits, ops, goal):
    """
    Generate all solutions for the given digits, operators, and goal.
    Symmetries in operations are not considered, but symmetries in
    order are.
    @param digits: a list of digits
    @param ops: a list of operators as strings
    @param goal: the goal number
    @return: a dictionary mapping each final solution set (i.e.
             the set of numbers remaining) to a list of all possible
             paths to that solution set
    """

    def extract_solutions(seed, history):
        """
        Extract all solutions from the given seed and history.
        This is backtracking code throught the dynamic programming
        table.  It chases parent pointers and assembles solutions
        via recursive calls to extract_solution
        @param seed: the seed entry to extract solutions from
        @param history: the dynamic programming table
        @return: a list of all possible paths to the solution
        """
        results = []
        for op, x, y, remaining in history[seed]:
            orig = remaining + [x, y]
            orig.sort()
            sols = extract_solutions(tuple(orig), history)
            if len(sols) == 0:
                sols = [[]]
            for sol in sols:
                sol.append((op, x, y))
            results.extend(sols)
        return results

    sols = []
    history = {}
    digits = sorted(digits)
    history[tuple(digits)] = []
    q = queue.Queue()
    q.put(digits)
    while not q.empty():
        lst = q.get()
        length = len(lst)
        if length > 1:
            for i in range(0, length):
                for j in range(i+1, length):
                    x = max(lst[i], lst[j])
                    y = min(lst[i], lst[j])
                    for op in ops:
                        if op == '/' and (y == 0 or x % y != 0):
                            continue
                        result = combine(op, x, y)
                        # the list of digits sans x and y
                        remaining_orig = lst[:i] + lst[i+1:j] + lst[j+1:]
                        # create the new remaining digits, with the
                        # result, sorted
                        remaining = remaining_orig[:]
                        remaining.append(result)
                        remaining.sort()
                        remaining_frozen = tuple(remaining)
                        if remaining_frozen not in history:
                            q.put(remaining)
                            if result == goal:
                                sols.append(remaining_frozen)
                        # add the current operation as a parent pointer
                        # to the new result
                        l = history.setdefault(remaining_frozen, [])
                        l.append((op, x, y, remaining_orig))

    return {sol: extract_solutions(sol, history) for sol in sols}


app = FastAPI()


@app.get("/api/fullsolution")
def solution(goal: int, nums: Optional[List[int]] = Query(None)):
    print(goal, nums)
    return generate_solutions(nums, ['+', '-', '*', '/'], goal)


@app.get("/api/shortsolution")
def solution(goal: int, nums: Optional[List[int]] = Query(None)):
    
    def ops_to_str(ops) -> List[str]:
        print("OPS = {}".format(ops))
        return ["{} {} {}".format(op[1], op[0], op[2]) for op in ops]

    print(goal, nums)
    sol = generate_solutions(nums, ['+', '-', '*', '/'], goal)

    print(sol)
    sol2 = [ {"insol": [], "outsol": k, "ops": ops_to_str(v[0])} for k, v in sol.items()]
    
    print()
    print(sol2)
    #return {str((45,90)): ["a", "b", "c"]} #sol2
    return sol2

