from typing import List, Optional
from fastapi import FastAPI, Query
from digits import generate_solutions

app = FastAPI()

@app.get("/api/solution")   
def solution(goal: int, nums: Optional[List[int]] = Query(None)):
    print(goal, nums)
    return generate_solutions(nums, ['+', '-', '*', '/'], goal)
    