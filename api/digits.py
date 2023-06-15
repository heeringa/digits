from typing import Iterable, List, TypeVar, Generator
import itertools

def combine(op, x, y):
    if op == '+':
        return x + y
    elif op == '-':
        return x - y
    elif op == '*':
        return x * y
    elif op == '/':
        return x / y

def eval_digits_for_display(opsstr, perm):
    assert(len(opsstr) == len(perm)-1)
    history = []
    prev = perm[0]
    for op, x in zip(opsstr, perm[1:]):
        y = combine(op, prev, x)
        history.append("{} {} {} = {}".format(prev, op, x, y))
        prev = y
    return history

def eval_digits(opsstr, perm):
    """
    Evaluate a list of digits with a list of operators from left to right
    @param opsstr: a list of operators
    @param perm: a list of digits
    """
    assert(len(opsstr) == len(perm)-1)
    prev = perm[0]
    for op, x in zip(opsstr, perm[1:]):
        prev = combine(op, prev, x)
    return prev


def generate_solutions(digits, ops, goal):
    sols = {}
    # Generate all permutations of all the subsets
    # of the digits and evaluatte them against 
    # all possible operator strings
    for length in range(2, len(digits)+1):
        for perm in itertools.permutations(digits, length):
            for op_str in itertools.product(ops, repeat=len(perm)-1):
                if eval_digits(op_str, perm) == goal:
                    sols.setdefault(length-1, []).append((perm, op_str))
    return sols 


if __name__ == '__main__':
    DIGITS = [3, 7, 11, 13, 19, 20]
    OPS = ['+', '-', '*', '/']
    GOAL = 428

    sols = generate_solutions(DIGITS, OPS, GOAL)
    for k,v in sols.items():
        for sol in v:
            history = eval_digits_for_display(sol[1], sol[0])
            print("{}: {}".format(k, " :: ".join(history)))

