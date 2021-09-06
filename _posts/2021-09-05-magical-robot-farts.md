---
layout: post
---

# Demystifying Magical Robot Farts

**A Pragmatic Guide to `awk`**

* [Introduction](#introduction): What this guide is for

* [Cheat Sheet](#cheat-sheet): Simple commands which demonstrate awk features

* [Explanation](#explanation): How awk "really" works

## Introduction

A lot of people interact with a terminal or shell[^1], but don't spend all day working there.

This leads to a common situation in which we know that the shell can solve a problem, but we're not sure quite how to do it.

e.g.

> I want to extract the second column from this CSV, but only for rows where the fifth column is '0' or 'nil'.

After a bunch of searching, we come to a Stack Overflow answer that serves up this tidbit:

> This gets the average of the fourth column divided by the sum of the fifth column of the CSV when the third column is '1' or the twelfth column DOES NOT start with the letter 'p'.

```bash
awk '$3==1||$12!~/^p/{sum4+=$4;sum5+=$5}END{print (sum4/NR)/sum5}'
```

After a bunch of fiddling around, you may or may not be able to adapt this *magical robot fart* to your use case.

But wouldn't it be better, wouldn't it be easier, if we knew what we were doing?

## Cheat Sheet

<table class="table table-bordered">
<tbody>

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
<p>Split text on pipe (`|`) characters, printing whole lines when the second column is equal to 8</p>
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

While you can see full information using `man awk`, the following flag is the single most important one to know about:

`-F` sets the field separator.
It defaults to splitting on any whitespace.

To split on commas, `-F ","`. To split on dots, `-F "."`. And so forth.
You can set it to be multiple characters. For example, `-F ',:\t'` will split on commas, colons, and tab characters.

### Quoting Rules

You should always single-quote your awk programs with `'`. Don't use double quotes, `"`.

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

There are a few special variables which are necessary for referring to the input.
First, `$0` refers to the whole line of input.
`$1` is the first column, `$2` the second, and so forth.

Very often, you'll want to know the number of fields (columns) in a line, or the number of records (lines) that awk has processed so far.
These are `NF` and `NR`.

You can declare your own variables with `=`, and the operator-assignments `+=`, `-=`, `*=`, and `/=` are all supported.
One oddity with `awk`: if a variable is used with operator-assignment without having been previously declared, it gets a value of `0` to start.
That means that the two following programs are identical in meaning:

<table class="table table-bordered">
<tbody>
<tr>
<td><pre><code class="language-awk">BEGIN{sum=0}
{sum+=$5}
END{print sum}</code></pre></td>
<td><pre><code class="language-awk">{sum+=$5}
END{print sum}</code></pre></td>
</tr>
</tbody>
</table>

There are additional builtin variables, like `OFS` (the Output Field Separator, which defaults to a space), but you are unlikely to need these.
`man awk` has full details on all of the built-in variables.

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

#### awk is Line Oriented

`awk` is centered around processing lines of input, one at a time.

It's part of a whole array of tools which share this line-oriented thinking.
`grep` works one line at a time.
So do `cut`, `sort`, `uniq`, `sed`, and many other classic unix tools.
There is a whole paradigm for programming centered around processing lines of input.

What this means is that if you want to slurp in a bunch of lines of data, and make changes to lines matching a specific rule, or filter down the data to lines matching some rule, it's a good bet that `awk` will fit that problem space nicely.

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

### Matching Patterns

The selectors used to match lines in awk are capable of expressing a great many things!
But for the most part, you'll want to use one of the following simple kinds of matching rules:

Check an arithmetic expression on a column or columns, as in:

```awk
$2 * $3 > 100{print $0}
```

Check that a column of input matches a regular expression[^2]:

```awk
$2~/^1.*0$/{print $0}
```

This checks that column 2 matches `^1.*0$`, meaning it starts with a 1, ends with a 0, and has any number of characters inbetween.

Check that a column of input *does not* match a regular expression:

```awk
$2!~/^1.*0$/{print $0}
```

Check that a whole line of input matches a regular expression:

```awk
/^1.*0$/{print $0}
```

Note that you don't need to write `$0~/.../`.


Combine two or more selectors with `&&` for "and" or `||` for "or".

```awk
$2~/^1.*0$/ || $3 % 2 == 1 {print $0}
```

or

```awk
$2~/^1.*0$/ && $3 % 2 == 1 {print $0}
```

### Imperative Flow Control

In spite of the capabilities of the selectors to find lines of input which match desired rules, there are cases in which a good old-fashioned `if-else` block would really be the easiest way to write something.
`awk` has `if`, `switch`, `while` and many other control-flow structures.

These can be used inside of the `{ ... }` expressions.
For example, imagine we filter to the lines we want, in order to collect an average from matching records:

```awk
BEGIN{counter=0}
$3==1||$4~/^90[[:digit:]]$/{counter+=1; sum +=$2}
END{print sum/counter}
```

But then we decide we want to collect a second average, in a subset of these conditions.
`if` can make this easy!

```awk
BEGIN{counter=0; counter2=0}
$3==1||$4~/^90[[:digit:]]$/{counter+=1; sum +=$2; if ($5==0) {counter2+=1; sum2+=$6} }
END{print sum/counter; print sum2/counter2}
```

## Conclusion

When you first see someone else's `awk` commands, they're mystical.
It's not clear what they do, and you mgiht try them out on your data just to try to see how they behave.

Hopefully, with just a little bit more effort to make them understandable, these magical robot farts can be seen to have a consistent structure and logic.

***


[^1]: By 'shell', I mean bash or zsh. And by 'terminal', I mean any PTY. iTerm on macOS is a PTY, as is the built-in terminal pane in RStudio. If you're not familiar with these terms, that's okay, here's a simple heuristic: anywhere you can use 'grep' qualifies.
[^2]: This guide will not cover the many fabulous powers of regular expressions, but they are very useful. Be aware that regular expressions can vary a little depending on the implementation being used. awk's regular expressions are more than satisfactory, similar to what `grep` offers, but can't do everything that regular expressions in python, R, and other languages can do.
