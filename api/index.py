from typing import List, Optional
from fastapi import FastAPI, Query
from digits import generate_solutions

app = FastAPI()


@app.get("/api/shortsolution")
def solution(goal: int, nums: Optional[List[int]] = Query(None)):

    def ops_to_str(ops) -> List[str]:
        print("OPS = {}".format(ops))
        return ["{} {} {}".format(op[1], op[0], op[2]) for op in ops]

    print(goal, nums)
    sol = generate_solutions(nums, ['+', '-', '*', '/'], goal)
    sol2 = [{"insol": [],
             "outsol": k,
             "ops": ops_to_str(v[0])} for k, v in sol.items()]
    return sol2
