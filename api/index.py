from typing import List, Optional
from fastapi import FastAPI, Query
from digits import generate_solutions, combine

app = FastAPI()


def ops_to_str(ops) -> List[str]:
    return ["{} {} {} = {}".format(op[1], op[0], op[2], combine(op[0], op[1], op[2])) for op in ops]

@app.get("/api/allsolutions")
def allsolutions(goal: int, nums: Optional[List[int]] = Query(None)):
    sol = generate_solutions(nums, ['+', '-', '*', '/'], goal)
    sol2 = []
    for k, v in sol.items():
        sol2.extend([{"insol": [],
                    "outsol": k,
                    "ops": ops_to_str(ops)} for ops in v ])
    return sol2

@app.get("/api/shortsolutions")
def shortsolutions(goal: int, nums: Optional[List[int]] = Query(None)):
    sol = generate_solutions(nums, ['+', '-', '*', '/'], goal)
    sol2 = [{"insol": [],
             "outsol": k,
             "ops": ops_to_str(v[0])} for k, v in sol.items()]
    return sol2
