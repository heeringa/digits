import queue

def combine(op, x, y):
    if op == '+':
        return x + y
    elif op == '-':
        return x - y
    elif op == '*':
        return x * y
    elif op == '/':
        return x // y

def generate_solutions(digits, ops, goal):
    """
    Generate all solutions for the given digits, operators, and goal.
    Symmetries in operations are not considered, but symmetries in order are.
    @param digits: a list of digits
    @param ops: a list of operators as strings
    @param goal: the goal number
    @return: a dictionary mapping each final solution to a list of 
             all possible paths to that solution
    """

    def extract_solutions(seed, history):
        results = []
        for op, x, y, remaining in history[seed]:
            orig = remaining + [x,y]
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
            for i in range(0,length):
                for j in range(i+1,length):
                    x = max(lst[i], lst[j])
                    y = min(lst[i], lst[j]) 
                    for op in ops:
                        if op == '/' and (y == 0 or x % y != 0):
                            continue
                        result = combine(op, x, y)
                        # the list of digits sans x and y
                        remaining_orig = lst[:i] + lst[i+1:j] + lst[j+1:]
                        # create the new remaining digits, with the result, sorted
                        remaining = remaining_orig[:]
                        remaining.append(result)
                        remaining.sort()
                        remaining_frozen = tuple(remaining)
                        if remaining_frozen not in history:
                            q.put(remaining)
                            if result == goal:
                                sols.append(remaining_frozen)
                        # add the current operation as a parent pointer to the new result                            
                        history.setdefault(remaining_frozen, []).append((op, x, y, remaining_orig))
    
    return {sol: extract_solutions(sol, history) for sol in sols}



if __name__ == '__main__':
    DIGITS = [3, 7, 11, 13, 19, 20]
    OPS = ['+', '-', '*', '/']
    GOAL = 428

    sols = generate_solutions(DIGITS, OPS, GOAL)
    for k,v in sols.items():
         for sol in v:
             print(k,sol)

