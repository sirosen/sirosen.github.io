---
layout: post
---

# Demystifying Magical Robot Farts

**A Pragmatic Guide to `awk`**

* [Introduction](#introduction): What this guide is for

* [Cheat Sheet](#cheat-sheet): Simple commands which demonstrate awk features

* [Explanation](#explanation): How awk "really" works

  * [awk is Line Oriented](#awk-is-line-oriented): The programming paradigm of awk

  * [Usage](#usage): Command-line `awk` usage

  * [Options](#options): Command-line options for the `awk` command

  * [Quoting Rules](#quoting-rules): Guidelines for quoting `awk` command inputs

  * [awk Variables](#awk-variables): How variables work in `awk`, and a list of useful built-in variables

  * [The Structure of an awk Program](#the-structure-of-an-awk-program): The common layout for all `awk` programs

  * [Matching Patterns](#matching-patterns): Common styles of matching rules `awk` can use to filter its inputs

  * [Imperative Flow Control](#imperative-flow-control): `awk` support for `if`, `else`, `while`, etc

  * [Notes of Caution and Weirdness](#notes-of-caution-and-weirdness): Even after all this, `awk` can still be weird

## Introduction

A lot of people interact with a terminal or shell[^1], but don't spend all day working there.

This leads to a common situation in which we know that the shell can solve a problem, but we're not sure quite how to do it.

> I want to extract the second column from this CSV, but only for rows where the fifth column is '0' or 'nil'.
> <footer class="blockquote-footer">Poor Unfortunate Soul</footer>

After a bunch of searching, we come to a Stack Overflow answer that serves up this tidbit:

> This gets the average of the fourth column divided by the sum of the fifth column of the CSV when the third column is '1' or the twelfth column DOES NOT start with the letter 'p'.
>
> ```bash
> awk -F',' '$3==1||$12!~/^p/{sum4+=$4;sum5+=$5}END{print (sum4/NR)/sum5}'
> ```
>
> <footer class="blockquote-footer">T3H_L337z0rz_SO_UZER</footer>

After a bunch of fiddling around, you may or may not be able to adapt this *magical robot fart* to your use case.

But wouldn't it be better, wouldn't it be easier, if we knew what we were doing?

## Cheat Sheet

<table class="table table-bordered">
<tbody>

<tr>
<td><p>print text with no changes</p></td>
<td>
<pre><code class="bash">awk '{print $0}'</code></pre>
<p>This program is equivalent to the `cat` command</p>
</td>
</tr>

<tr>
<td><p>Choose a column</p></td>
<td>
<pre><code class="bash">awk '{print $4}'</code></pre>
<p>Print the fourth column from whitespace-separated data</p>
</td>
</tr>

<tr>
<td><p>Alter a CSV</p></td>
<td>
<pre><code class="bash">awk -F ',' '{print $2 "," $3}'</code></pre>
<p>Split text on commas, printing the second and third columns, comma separated in the output</p>
</td>
</tr>

<tr>
<td><p>Filter by a column</p></td>
<td>
<pre><code class="bash">awk -F '|' '$2==8{print $0}</code></pre>
<p>Split text on pipe (<code>|</code>) characters, printing whole lines when the second column is equal to 8.</p>
</td>
</tr>

<tr>
<td><p>Compute an average</p></td>
<td>
<pre><code class="bash">awk 'BEGIN{sum=0}{sum+=$3}END{print "sum=" sum ",avg=" (sum / NR) ",rows=" NR}'</code></pre>
<p>Get the sum and average of the third column, plus the number of rows of data</p>
</td>
</tr>

<tr>
<td><p>Filter a CSV</p></td>
<td>
<pre><code class="bash">awk -F ',' '$2~/^3/{print $0}'</code></pre>
<p>Filter a CSV to lines where the second column starts with a 3</p>
</td>
</tr>

<tr>
<td><p>Filter with multiple rules</p></td>
<td><pre><code class="bash">awk -F ',' '$2~/^3/ && $1%2==0{print $0}'</code></pre>
<p>Filter a CSV to lines where the second column starts with a 3 and the first column is even</p>
</td>
</tr>

</tbody>
</table>


## Explanation

`awk` is a fully fledged programming language.
It can do anything you can do in R, Matlab, or Python.

*The subtext here is that just because you can doesn't mean that you should.*
*Use awk only until it's no longer the right tool for the job.*

#### awk is Line Oriented

`awk` is centered around processing lines of input, one at a time.

It's part of a whole array of tools which share this line-oriented thinking.
`grep` works one line at a time.
So do `cut`, `sort`, `uniq`, `sed`, and many other classic unix tools.
There is a whole paradigm for programming centered around processing lines of input.

What this means is that if you want to slurp in a bunch of lines of data, and make changes to lines matching a specific rule, or filter down the data to lines matching some rule, it's a good bet that `awk` will fit that problem space nicely.

### Usage

The general form of `awk` usage is
```bash
awk [OPTIONS] PROGRAM FILE
```

When `awk` is given a file on standard input (e.g. in a pipeline), then the filename argument is omitted.

<table class="table table-bordered">
<thead>
<tr><td>Reading from a file</td><td>Reading from stdin</td></tr>
</thead>
<tbody>
<tr>
<td><pre><code class="language-bash">awk '{print $2}' foo.txt</code></pre></td>
<td><pre><code class="language-bash">cat foo.txt | awk '{print $2}'</code></pre></td>
</tr>
</tbody>
</table>

### Options

While you can see full information using `man awk`, the following flag is the single most important one to know about...

#### Field Separator

`-F` sets the field separator, or "delimiter", which is used to split lines into columns.
It defaults to splitting on any whitespace.

To split on commas, `-F ","`. To split on dots, `-F "."`. And so forth.
You can set it to be multiple characters. For example, `-F ',:\t'` will split on commas, colons, and tab characters.

### Quoting Rules

You should always single-quote your awk programs with `'`. Don't use double quotes, `"`.

Why?

In the shell, a double-quoted string can contain variable substitutions using the `$` character. e.g.

```bash
$ FOO=1
$ echo "FOO has the value $FOO"
FOO has the value 1
```

But single-quoted strings are treated verbatim.

```bash
$ echo 'FOO has the value $FOO'
FOO has the value $FOO
```

When you run a command in the shell, variable substitutions and other manipulations of a string are done by the shell before the program is run.

`awk` uses `$` and several other characters that may have special meanings to your shell.
Always use single-quotes so that your program is given to `awk` exactly as written.

### awk Variables

#### Builtin Variables

There are a few special variables which are necessary for referring to the input.
First, `$0` refers to the whole line of input.
`$1` is the first column, `$2` the second, and so forth.

Very often, you'll want to know the number of fields (columns) in a line, or the number of records (lines) that awk has processed so far.
These are `NF` and `NR`.

There are additional builtin variables, like `OFS` (the Output Field Separator, which defaults to a space), but you are unlikely to need these.
`man awk` has full details on all of the built-in variables.

#### Declaring Variables

You can declare your own variables with `=`, and the operator-assignments `+=`, `-=`, `*=`, and `/=` are all supported.

Variables are named when they are declared, and accessed simply by using that name in a valid expression.
For example, if we write `sum=0` to set `sum` to `0`, then `sum+=$1` to add `$1` to `sum`, and `print sum` to print out `sum`.

### The Structure of an awk Program

`awk` programs are always organized in the same way.

A series of imperative "do this" expressions are written in curly braces.
Those expressions may be preceded by matching expressions or selectors.

Each line of input is fed to the selectors and, if it matches, the imperative pattern in the curly braces is run.
If there is no selector -- or you can think of this as "the selector is blank" -- then all lines match the pattern.

There are also two special selectors, `BEGIN` and `END`, which run before any lines of input are processed and after all lines are processed, respectively.

That is, an awk program always looks, in principle, something like this

```nolanguage
SELECTOR_1 { EXPRESSION_1 }
SELECTOR_2 { EXPRESSION_2 }
.
.
.
SELECTOR_N { EXPRESSION_N }
```

Newlines are not needed between the expressions, which is why tidbits like

```awk
BEGIN{sum=0}{sum+=$1}END{print sum}
```

work well in the middle of pipelines.

Many awk programs manipulate all lines of input have no selector at all, and begin and end with `{` and `}`.
This is the aforementioned "selector is blank" case, meaning that all lines match -- that is why commands like `awk '{print $2}'` work the way they do.

### Matching Patterns

The selectors used to match lines in awk are capable of expressing a great many things!
But for the most part, you'll want to use one of the following simple kinds of matching rules.

Check an arithmetic expression on a column or columns, as in:

```awk
# check if the product of columns two and three is over 100
$2 * $3 > 100{print $0}
```

Check that a column of input matches a regular expression[^2]:

```awk
# column 2 starts with a 1 and ends with a 0
$2~/^1.*0$/{print $0}
```

This checks that column 2 matches `^1.*0$`, meaning it starts with a 1, ends with a 0, and has any number of characters inbetween.

Check that a column of input *does not* match a regular expression:

```awk
# column 2 does not start with a 1 and end with a 0
# note that these values for column 2 match: '103', '200', '01', '1', '0'
$2!~/^1.*0$/{print $0}
```

Check that a whole line of input matches a regular expression:

```awk
# print out lines which start with 1 and end with 0
/^1.*0$/{print $0}
```

Note that you don't need to write `$0~/.../`.


Combine two or more selectors with `&&` for "and" or `||` for "or".

```awk
# $2 starts with a 1 and ends with a 0
# OR
# $3 is odd
$2~/^1.*0$/ || $3 % 2 == 1 {print $0}
```

or

```awk
# $2 starts with a 1 and ends with a 0
# AND
# $3 is odd
$2~/^1.*0$/ && $3 % 2 == 1 {print $0}
```

All of the above examples print out the lines of input matching the filter.

### Imperative Flow Control

In spite of the capabilities of the selectors to find lines of input which match desired rules, there are cases in which a good old-fashioned `if-else` block would really be the easiest way to write something.
`awk` has `if`, `switch`, `while` and many other control-flow structures.

These can be used inside of the `{ ... }` expressions.
For example, imagine we filter to the lines we want, in order to collect an average from matching records:

```awk
# we're counting up an average when $3 is '1' or $4 is 900-909
# '[[:digit:]]' in an awk regex means any character 0-9
# note that we use our own counter, not NR, because NR will count all records,
# not just those matching our expression
BEGIN{counter=0}
$3==1||$4~/^90[[:digit:]]$/{counter+=1; sum +=$2}
END{print sum/counter}
```

But then we decide we want to collect a second average, in a subset of these conditions.
`if` can make this easy!

```awk
# this program is similar to the above, but we collect a second counter and sum
# those values are only counted when the fifth colum is zero
BEGIN{counter=0; counter2=0}
$3==1||$4~/^90[[:digit:]]$/{counter+=1; sum +=$2; if ($5==0) {counter2+=1; sum2+=$6} }
END{print sum/counter; print sum2/counter2}
```


### Notes of Caution and Weirdness

Some of the behavior of `awk` is unintuitive, if not downright weird.
These are things to know about.

#### Warning! awk is Line Oriented!

Remember that note about `awk` being line-oriented before?
It can have some not-quite-obvious effects.

Consider what the classic "Hello world" program looks like in `awk`.
Some other languages might write

```python
print("Hello world!")
```

But in awk, we must be careful to print it only once, not once for every line of input!
Write

```awk
BEGIN{print "Hello world!"}
```

or

```awk
END{print "Hello world!"}
```

but not

```awk
{print "Hello world!"}
```

The first two are basically equivalent. But the last one is different!

#### Empty Input, Odd Output

Several examples given in this guide compute averages.
But consider what happens when the input is empty and you try to find a quotient...

```awk
BEGIN{n1=1; n2=0}
{n1+=$2; n2+=$3}
END{print n1/n2}
```

Empty input? Not good.

#### Uninitialized Variables are 0

If a variable is used with operator-assignment like `+=` or `-=` without having been previously declared, it gets a value of `0` to start.
That means that the two following programs are identical in meaning:

<table class="table table-bordered">
<tbody>
<tr>
<td><pre><code class="language-awk"># sum is set to 0 in a BEGIN block
BEGIN{sum=0}
{sum+=$5}
END{print sum}</code></pre></td>
<td><pre><code class="language-awk"># sum is set to 0 on the first line where $5 is added to it
{sum+=$5}
END{print sum}</code></pre></td>
</tr>
</tbody>
</table>

When you see `awk` code which seems to materialize variables out of nowhere, it's a good bet that this is what's going on.

#### print with no arguments

In this guide, we have written `{print $0}` for the program which prints full lines of data.
However, this can also be written `{print}`.
If `print` is not given any arguments, it's the same as passing it `$0`.

#### print with or without commas

The `OFS` (Output Field Separator) defines what `awk` does when comma-separated arguments are given to `print`.
It defaults to a single space.

However, the arguments to `print` may also be given *without* commas, meaning that they are combined by string concatenation (no spaces).
The difference is not always obvious.

<table class="table table-bordered">
<tbody>
<tr>
<td>
<pre><code class="bash"># with a comma
$ echo '' | awk 'END{print "1", "2"}'
1 2
</code></pre>
</td>
<td>
<pre><code class="bash"># without a comma
$ echo '' | awk 'END{print "1" "2"}'
12
</code></pre>
</td>
</tr>
</tbody>
</table>


#### awk vs gawk

`awk` on Linux has fancy bells and whistles. `awk` on macOS only has the standard features.

If you're running on Linux, or something linux-like (e.g. WSL on Windows), your version of `awk` is "GNU awk" or `gawk`.
This version of the `awk` program has various features which have been added over the years.

However, on any BSD-like system, e.g. macOS, your version of `awk` will be "BSD awk".
This version of the program only implements the features which have been established as part of the POSIX standard for `awk`.

Hopefully this never matters for you, dear reader.
But when moving scripts from a Linux environment to macOS, be aware that commands which were written on `gawk` may not behave correctly.


## Conclusion

When you first see someone else's `awk` commands, they're mystical.
It's not clear what they do, and you mgiht try them out on your data just to try to see how they behave.

Hopefully, with just a little bit more effort to make them understandable, these magical robot farts can be seen to have a consistent structure and logic.

***


[^1]: 'shell' means bash or zsh. 'terminal' means anything where you can input commands like `grep`.
[^2]: This guide will not cover the many fabulous powers of regular expressions, but they are very useful. Be aware that regular expressions can vary a little depending on the implementation being used. awk's regular expressions are more than satisfactory, similar to what `grep` offers, but can't do everything that regular expressions in Python, R, and other languages can do.
