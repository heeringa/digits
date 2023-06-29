import pytest
from digits import combine, generate_solutions


def test_combine():
    assert combine('+', 1, 2) == 3
    assert combine('-', 5, 2) == 3
    assert combine('*', 5, 2) == 10
    assert combine('/', 4, 2) == 2
    with pytest.raises(ZeroDivisionError):
        combine('/', 4, 0)


def test_generate_solutions():
    DIGITS = [1, 2, 3]
    OPS = ['+', '-', '*', '/']
    GOAL = 7

    expected_result = {
        (7,): [[('*', 3, 2), ('+', 6, 1)]]
    }

    sols = generate_solutions(DIGITS, OPS, GOAL)

    assert sols == expected_result


def test_generate_solutions_no_solution():
    DIGITS = [1, 2, 3]
    OPS = ['+', '-', '*', '/']
    GOAL = 100

    expected_result = {}  # No solution expected

    sols = generate_solutions(DIGITS, OPS, GOAL)

    assert sols == expected_result
