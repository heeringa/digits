from typing import Iterable, List, TypeVar, Generator
import itertools

T = TypeVar('T')

def subsets(my_list: List[int], min_length: int) -> Generator[List[int], None, None]:
    """
    Generates all subsets of my_list with length >= min_length
    @param my_list: the list to generate subsets of
    @param min_length: the minimum length of the subsets to generate
    """
    for i in range(min_length, len(my_list) + 1):
        for subset in itertools.combinations(my_list, i):
            yield list(subset)

# my_list = [1, 2, 3]
# for subset in subsets(my_list, 2):
#     print(subset)


def generate_lists(tokens: List[str], N: int) -> List[List[str]]:
    if N == 0:
        return [[]]  # Base case: Return a list with an empty list as the only element    
    result = []
    for token in tokens:
        # Recursively generate lists of length N-1 using the remaining tokens
        sublists = generate_lists(tokens, N - 1)
        # Append the current token to each sublist of length N-1
        for sublist in sublists:
            result.append([token] + sublist)
    
    return result


# Test the generate_lists function
tokens = ['A', 'B', 'C']
N = 3
lists = generate_lists(tokens, N)
for lst in lists:
    print(lst)


def combine(op, x, y):
    if op == '+':
        return x + y
    elif op == '-':
        return x - y
    elif op == '*':
        return x * y
    elif op == '/':
        return x / y

def eval_digits(opsstr, perm, goal, history=[]):
    assert(len(opsstr) == len(perm)-1)
    perm = perm[:]
    x = perm.pop()
    if len(opsstr) == 0:
        if x == goal:
            return True, history
        else:
            return False, []
    else:
        y = perm.pop()
        op = opsstr.pop()
        result = combine(op, x, y)
        perm.append(result)
        history.append("{} {} {} = {}".format(x, op, y, result))
        return eval_digits(opsstr, perm, goal, history)    

DIGITS = [3, 7, 11, 13, 19, 20]
OPS = ['+', '-', '*', '/']
GOAL = 428

for ss in subsets(DIGITS, 2):
    l = len(ss)
    for perm in itertools.permutations(ss):
        for opstring in generate_lists(OPS, l-1):
            o = opstring[:] 
            #print("Considering {} with {}".format(perm, opstring))
            success, history = eval_digits(opstring, perm, GOAL, [])
            if success:
                print("Considering {} with {} and found {}".format(perm,o,history))
                
        






