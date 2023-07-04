from typing import List, Optional
from fastapi import FastAPI, Query
import sys
print(sys.path)
from digits import generate_solutions

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

