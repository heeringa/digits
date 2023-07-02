from typing import List, Optional
from fastapi import FastAPI, Query
from digits import generate_solutions

app = FastAPI()


@app.get("/api/fullsolution")
def solution(goal: int, nums: Optional[List[int]] = Query(None)):
    print(goal, nums)
    return generate_solutions(nums, ['+', '-', '*', '/'], goal)


@app.get("/api/shortsolution")
def solution(goal: int, nums: Optional[List[int]] = Query(None)):
    print(goal, nums)
    sol = generate_solutions(nums, ['+', '-', '*', '/'], goal)
    return {k: v[0] for k, v in sol.items()}

