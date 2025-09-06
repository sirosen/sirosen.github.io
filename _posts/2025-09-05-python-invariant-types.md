---
layout: post
---

# Python Type Hints: Invariant Types

For many Python engineers, type hints are a useful everyday tool.
They act as inline documentation, enable analysis and linting, and can even
drive runtime behavior.

But many practitioners have a limited understanding of a specific, often
irksome, topic in the type system: Type Variance.
When variance comes up, it's usually because

- you have a deadline to meet
- your team requires your code to pass all checks in CI
- your code is meticulously tested, and passes your testsuite
- the type checker box in CI is red

That is, type variance is a topic likely to come up when engineers are at their
least receptive to learning.
"The code is good, just let me ship it."

A better understanding of type variance can help avoid these situations, and
make it feel more like you are working with the type checker, rather than
against it.
This post will focus on one kind of types, Invariant Generics.

## Type Hinting in the Wild: Invariance Appears!

Type hints are usually first explained in terms of simplistic examples which
"make sense", like

```python
def my_sum(data: list[int]) -> int:
    if not data:
        return None  # Error! This isn't an int!
    return sum(data)
```

A type checker can catch that `None` doesn't match the `-> int` (return type), and warn you.

Then you can fix it, e.g.:
```python
def my_sum(data: list[int]) -> int:
    if not data:
        return 0
    return sum(data)
```

But when you start exploring on your own, you'll quickly run into issues which don't match these
happy cases. For example, consider this function:

```python
def sum_the_ints(data: list[int | str]) -> int:
    integers = [x for x in data if isinstance(x, int)]
    if not integers:
        return 0
    return sum(integers)
```

This seems... pretty reasonable, right?
`sum_the_ints` takes a mixed list of integers and strings, and gets you a sum of
just the integer parts.

Does it type-check?
```bash
$ mypy script.py 
Success: no issues found in 1 source file
```

Great!

So now let's use it:
```python
def make_some_ints() -> list[int]:
    return list(range(10))


print(sum_the_ints(make_some_ints()))
```

Looks great, we should get an integer printed!
```bash
$ python script.py 
45
```

Cool. Let's check it:
```bash
$ mypy script.py 
script.py:12: error: Argument 1 to "sum_the_ints" has incompatible type "list[int]"; expected "list[int | str]"  [arg-type]
script.py:12: note: "list" is invariant -- see https://mypy.readthedocs.io/en/stable/common_issues.html#variance
script.py:12: note: Consider using "Sequence" instead, which is covariant
Found 1 error in 1 file (checked 1 source file)
```

Zoinks! That's no good!

## list is Invariant

The `mypy` error links you to a useful page in its docs about variance, and it
suggests using `Sequence`, which we'll get back to.
All-in-all, a pretty good error!

The pages on variance are clear and detailed, but because of the level of detail,
it's easy to get lost.
And it can be hard to connect what you're reading back to the error you got.

The key bit is `note: "list" is invariant`. What does that _mean_?

When you declare a `list` type, you can declare the type of the `list`'s
contents, i.e. `list[int]` means "this list contains integers" and `list[int | str]`
means "this list contains a mix of integers and strings".

Note that `list[int | str]` is a different type from `list[int] | list[str]`!
One describes a `list` which may be heterogeneous, like `[2, "apples", 3, "oranges"]`,
and the other describes a `list` (still singular) which is homogeneous, but could be
either filled only with integers or filled only with strings, `[2, 3]` or `["apples", "oranges"]`.

Any type which has some "slot" or "slots" which can be filled in, like `list`, is a `Generic`.
All of the basic container types -- `list`, `dict`, `set`, `tuple` -- are generics because we can
describe the type of their contents.

Type variance describes how a generic type interacts with its inputs, the "type arguments", within
the confines of the type system.
Invariance, in particular, is the rule which says "the type arguments must match exactly".
If you look back at the erroring example above, you'll see that the types do not match --
one is `list[int]` and the other is `list[int | str]`!

So, to summarize,

- `list` is invariant
- invariance means that "type arguments must be an exact match"
- `list[int]` is not *exactly* `list[int | str]`

That explains it! ... Sort of. But it raises more questions. Why is `list` invariant?

## Mutable Containers are Usually Invariant

The key feature of `list` (at runtime) which makes us describe it as invariant (at typing-time)
is that we can mutate its contents freely with methods like `append()` and
`pop()` and indexed assignment (`__setitem__`).

If you have a list of integers, you can add integers to it:
```python
data: list[int] = [1, 2, 3]
data.append(4)
```

And functions which take `lists` can do this too:
```python
def incr_append(data: list[int]) -> None:
    if not data:
        data.append(0)
    else:
        data.append(data[-1] + 1)
```

`incr_append()` reads and writes integers from and to its input.
It assumes that data which comes out of the list is always an integer,
and that data going in can be an integer.

So, can we use it on a mixed list?

```python
items: list[int | str] = [1, 2]
incr_append(items)
print(items)
```

Well, at runtime no problem:
```bash
$ python script.py
[1, 2, 3]
```

But if we try to type check it, this errors.
```bash
$ mypy script.py 
script.py:9: error: Argument 1 to "incr_append" has incompatible type "list[int | str]"; expected "list[int]"  [arg-type]
Found 1 error in 1 file (checked 1 source file)
```

Which makes sense, if we think about what `incr_append` is expecting in that `else` branch:
we assume a nonempty list is ending in an integer, and it might not be if we allowed `list[int | str]`!

`incr_append` can also show us what goes wrong in the converse case, where the types mismatch in
the other direction.
Maybe we want to allow strings which represent integers.

```python
def incr_append(data: list[int | str]) -> None:
    if not data:
        data.append(0)
    else:
        last = int(data[-1])
        data.append(last + 1)
```

(We'll assume we're okay with `int()` raising an error on bad inputs.)

That fixes the problem on the snippet we just had!
```python
items: list[int | str] = [1, 2]
incr_append(items)
print(items)
```
will now type-check okay in `mypy`.

But what if we change it, to...
```python
items: list[str] = ["1", "2"]
incr_append(items)
print(items)
```

Well, it works again at runtime, but it's clear now why it should fail type-checking:
```bash
$ python script.py
['1', '2', 3]
$ mypy script.py
script.py:10: error: Argument 1 to "incr_append" has incompatible type "list[str]"; expected "list[int | str]"  [arg-type]
script.py:10: note: "list" is invariant -- see https://mypy.readthedocs.io/en/stable/common_issues.html#variance
script.py:10: note: Consider using "Sequence" instead, which is covariant
Found 1 error in 1 file (checked 1 source file)
```

`items` was a list of strings, but we accidentally changed it to start containing integers.

## Handling Invariance by Declaring More Variants

`mypy` suggests using the `Sequence` type, which has some nice properties, but
may require you to restructure your code.

In some cases, a nice way to handle invariant types is to simply get a little
bit more explicit about exactly what your functions support.

For example, the version of `incr_append` which accepts `list[int | str]` won't allow us to use it
on a list of strings (good! it appends integers!), but it also won't allow us to use it on lists
of integers!
The type checker can't tell "how" we aren't matching types, and the invariance
rule is strict.

So this code won't type-check:
```python
def incr_append(data: list[int | str]) -> None:
    if not data:
        data.append(0)
    else:
        last = int(data[-1])
        data.append(last + 1)


items: list[int] = [1, 2]
incr_append(items)
```

even though we can see that it's perfectly safe.

One simple option is to expand the possible types for the input to `incr_append`, like so:
```python
def incr_append(data: list[int | str] | list[int]) -> None: ...
```

Now, we're declaring that `incr_append` accepts _either_ a heterogeneous list of
integers and strings or a homogeneous list of integers.
In either of those two cases, `append(last + 1)` is safe.

When you know what all of the variations are, you can write down all of the
individually invariant types you support and get a good result.

## Avoiding Invariance by Using Immutable Containers

`mypy` suggested using `Sequence` "because it is covariant".
Perhaps a better way to understand the advantage of `Sequence`, at least
vis-a-vis `list`, is that `Sequence` is immutable, because it only describes a
small subset of the capabilities of `list`, and it doesn't include mutation.
Being immutable is _why_ `Sequence` is "covariant".

Unlike `list`, `Sequence` would not allow for a call to `append()`.
As a result, many of the concerns about accidentally adding the wrong type of
thing to a list disappear.

Consider the earlier example, updated to use `Sequence`:
```python
from collections.abc import Sequence


def sum_the_ints(data: Sequence[int | str]) -> int:
    integers = [x for x in data if isinstance(x, int)]
    if not integers:
        return 0
    return sum(integers)
```

Because the type checker can see that `data` doesn't necessarily support `append()`,
this is now safe to call on a `list[int]`.

## Ȍ̶̺h̵̢͉̐ ̵̣͔͐n̴͉̫̿o̷̯͊,̸̨́͊ͅ ̴̰̮͌i̵͕͛̋ṣ̵̼͋í̵̫͋n̵̰̏s̷̭̳̐ṫ̶͖̞ȧ̷̗̺̚n̷͈̍c̷̱̩̃̀ë̸͉̘́͝(̸̖̈̐)̴̖̙́̅!̵͔̬͝

Nothing is sacred!
"`Sequence` is immutable" is one of the many soundness holes in the Python type system!

Python is a *very* dynamic language.
There are a number of well known cases which type checking cannot possibly catch
statically.

It turns out, `Sequence` combined with type narrowing leads to one of the more
surprising gaps.
Consider this version of `incr_append` from before, which returns a new list for
any sequence input:

```python
def incr_append(data: Sequence[int | str]) -> list[int | str]:
    if not data:
        return [0]
    else:
        last = int(data[-1])
        return list(data) + [last + 1]
```

This works nicely. But what if...

Let's just try something.

Right now `incr_append()` is always making new lists.
And maybe, by the way it's used in practice, we never want to use a list after
it has been rebuilt.
So it actually would be a little bit nicer if we could just do an `append()` in that case, and
return the original list.
That way, we we'll be a little bit more efficient.

So let's check if `data` is a `list` and add a special case for that!

Here's the full example:
```python
from collections.abc import Sequence


def incr_append(data: Sequence[int | str]) -> list[int | str]:
    if not data:
        return [0]
    else:
        last = int(data[-1])
        if isinstance(data, list):
            data.append(last + 1)
            return data
        else:
            return list(data) + [last + 1]


items: list[str] = ["1", "2"]
incr_append(items)
print(items)
```

Did we do a good job, does it type check?
```bash
mypy script.py
Success: no issues found in 1 source file
```

And if we run it?
```bash
$ python script.py  
['1', '2', 3]
```

Oh dear.

## Recap

**Type variance** describes how a generic type -- the easy cases to think about are containers -- interacts
with its type arguments. It's "how `list` interacts with `int` in the type expression `list[int]`".

**Invariance** is the property of `list`, or any other generic type, which says "in order for usages to be
considered safe, the type arguments must be an exact match".

Mutable container types are typically **invariant** because you need read and write access to be safe.

Immutable container types are typically less strict (**covariant**) because you
only need read access to be safe.

**Type narrowing**, as with `isinstance()`, makes it possible to coerce a
**covariant** type to an **invariant** one.

Type checking in Python is **known and understood to be incomplete**.
The demonstrated soundness hole is not a bug in `mypy` or any other particular
checker -- it's a characteristic of the current limitations on what we can do
with static types.
