---
layout: post
---

# Elevate Your `pytest` Usage: Param Classes

_This write-up was inspired by Ned Batchelder's really nice posts
[introducing new pythonistas to pytest parametrize](https://nedbatchelder.com/blog/202508/starting_with_pytests_parametrize)
and [using functions to build test parameters](https://nedbatchelder.com/blog/202602/pytest_parameter_functions).
Thanks, Ned!_

***

`pytest` has all sorts of useful features, and many of them have layers and nuance.
They make me think "oooh, how can I build something which synergizes with this?" or, alternatively, "hey, how can I hack this to solve my problem?"

I like APIs which encourage out of the box thinking -- they remind me of the fun and playful elements of programming.

As part of that faffing about and fiddling, there's a pattern I've found myself using for using `pytest`'s `parametrize` helper which I call "Param Classes".
Param Classes are a way of structuring your use of `parametrize` to define test cases which are readable, render nicely, and pack a lot of functionality into a small box.

Pytest parameters are usually lightweight objects, like primitive types (`int`, `bool`, ...) or built-in containers (`tuple`, `dict`, ...).

For example, this test of a `fast_factorial` function only takes integers:
```python
import pytest

@pytest.mark.parametrize(
    "num, expect_result",
    [
        (1, 1),
        (3, 6),
        (10, 3628800),
    ]
)
def test_fast_factorial(num, expect_result):
    assert fast_factorial(num) == expect_result
```

Each of the parameters here, `num` and `expect_result`, are simple primitive types.

There are a couple of interesting things to think about here.

The first is, what are the test cases named? e.g., How will I refer to the third test?
If we run it, we'll see

```
test_factorial.py::test_fast_factorial[1-1] PASSED
test_factorial.py::test_fast_factorial[3-6] PASSED
test_factorial.py::test_fast_factorial[10-3628800] PASSED
```

The part in brackets is the ID of the test case -- both the input and the output are included, hyphenated.
I could run `pytest "test_factorial.py::test_fast_factorial[10-3628800]"` to run *just* that test case again.

But `10` and `3628800` are sort of redundant in this case. What if I wanted to identify the case just by the input, `10`?
There are a couple of ways that `pytest` lets us do this.
One is with `pytest.param()`:
```python
import pytest

@pytest.mark.parametrize(
    "num, expect_result",
    [
        pytest.param(1, 1, id="1"),
        pytest.param(3, 6, id="3"),
        pytest.param(10, 3628800, id="10"),
    ]
)
def test_fast_factorial(num, expect_result):
    assert fast_factorial(num) == expect_result
```

It works, and when you have a lot of parameters, `pytest.param()` can be really handy because it lets you write down a complex scenario and then describe it like...
```
pytest.param(8, 9, 1000, id="coprime-elements-in-large-grid")
```

or whatever your problem demands.
But for such this case, `pytest.param()` is a bit awkward.
I have to repeat the parameter, and nothing prevents me from accidentally writing `pytest.param(1, 1, "11")`.
That could be confusing later.

Wouldn't it be nice if we could just tell `pytest` to take the first value and use it as the ID?
`parametrize` allows for `ids` as a function that tries to convert parameters to their IDs.

So what if we try that?

```python
@pytest.mark.parametrize(
    "num, expect_result",
    [
        (1, 1),
        (3, 6),
        (10, 3628800),
    ],
    ids=lambda x: x[0]
)
def test_fast_factorial(num, expect_result):
    assert fast_factorial(num) == expect_result
```

That looks nice. And if we run it?

```
[...snip...]

E   ValueError: test_factorial.py::test_fast_factorial: error raised while trying to determine id of parameter 'num' at position 0
```

Rats! `pytest` treats `ids` as applying to each parameter, not the pairs of parameters.

So we could smush them together:

```
@pytest.mark.parametrize(
    "pair",
    [
        (1, 1),
        (3, 6),
        (10, 3628800),
    ],
    ids=lambda x: x[0]
)
def test_fast_factorial(pair):
    assert fast_factorial(pair[0]) == pair[1]
```

And if we run it?
```
test_factorial.py::test_fast_factorial[1] PASSED
test_factorial.py::test_fast_factorial[3] PASSED
test_factorial.py::test_fast_factorial[10] PASSED
```

It works! But we seem to have lost something.
We had nicely named parts, `num` for the input and `expected_result` for the output, but now we just get `pair`.

Hmm... I wonder how I can hack this idea?
What if I try bundling together the parameters, but keeping their names?

```python
import dataclasses

import pytest


@dataclasses.dataclass
class IntFuncParam:
    num: int
    expect_result: int


@pytest.mark.parametrize(
    "factorial_param",
    [
        IntFuncParam(1, 1),
        IntFuncParam(3, 6),
        IntFuncParam(10, 3628800),
    ],
)
def test_fast_factorial(factorial_param):
    assert fast_factorial(factorial_param.num) == factorial_param.expect_result
```

That feels pretty tidy to use. How does it look when it runs?

```
test_factorial.py::test_fast_factorial[factorial_param0] PASSED
test_factorial.py::test_fast_factorial[factorial_param1] PASSED
test_factorial.py::test_fast_factorial[factorial_param2] PASSED
```

Not quite right. `pytest` doesn't know what to do with this class, so it gives up and uses the name plus a counter.
But now I could use that `ids` capability!
Plus, let's give `IntFuncParam` a `__str__`:

```python
@dataclasses.dataclass
class FactorialParam:
    num: int
    expect_result: int

    def __str__(self):
        return str(self.num)


@pytest.mark.parametrize(
    "factorial_param",
    [
        FactorialParam(1, 1),
        FactorialParam(3, 6),
        FactorialParam(10, 3628800),
    ],
    ids=str
)
def test_fast_factorial(factorial_param):
    assert fast_factorial(factorial_param.num) == factorial_param.expect_result
```

And the output?

```
test_factorial.py::test_fast_factorial[1] PASSED
test_factorial.py::test_fast_factorial[3] PASSED
test_factorial.py::test_fast_factorial[10] PASSED
```

Perfect!

But is this really better than `pytest.param()`?
"Better than" would suggest that `pytest.param()` is bad -- which it isn't, it's great -- this is just another tool to put in your kit.
It plays a little differently.

For example, here's a usage from inside of a larger project testsuite, where we're looking at python package data:
```python
@dataclasses.dataclass
class PackageVersionParam:
    """
    An object for writing ergonomic test parameters.

    This describes a published package with a version.
    """

    # package name
    name: str
    # (unparsed) version string
    version: str
    # a description of this version (for use in ids)
    description: str

    def __str__(self) -> str:
        return f"{self.name}-{self.version}-{self.description}"

    def as_req(self) -> str:
        return f"{self.name}=={self.version}"

        
@pytest.mark.parametrize(
    "setuptools_version_info",
    (
        PackageVersionParam("setuptools", "82.0.0", "published-2026-02-08"),
        PackageVersionParam("setuptools", "75.3.0", "published-2024-10-29"),
    ),
    ids=str,
)
...
```

Notice that I was able to add a method onto the collection of data, `as_req()`, which will render `"setuptools==82.0.0"` and `"setuptools==75.3.0"` for me.

When you start looking at `parametrize` values as potentially being classes of your own design, more options open up.
What other methods might you want to put in there? What else could you encode?

It's all enabled by defining your own very small class, and using that for your test parameters.
I've started to call these "param classes".
A param class:

- Uses a custom type which defines its contents, and may include useful methods.
- Provides its own short string representation for use as a `pytest` id.
- Is designed for the purpose of describing complex information for a test case.
- Canonically has a name that ends in `Param`, to remind you what it's for.

I would probably not use a param class in practice for `test_fast_factorial()`, but I do use them in more complex cases, and enjoy the added capabilities they offer.
When you're having trouble wrangling large numbers of complex test parameters, give it a try!
Worst case scenario, you'll have a fun little adventure.
