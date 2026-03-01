---
layout: post
---

# Claude Is Not Your Co-Author

...and related thoughts about LLM usage in open source.

Everyone has a take.
You have a take; your friends have takes; the guy who wants to strike up
conversation at the grocery checkout has a take.
Some are good takes. Some are bad takes.

This one is mine.

***

There's a lot happening in open source communities as we grapple with the deluge
of spam produced by text extrusion engines.
In my habitual corner of the broader community, the Python ecosystem, more and
more projects are being forced to adopt explicit policies.

Having a written policy for acceptable conduct is good.
Being forced to write one under duress is not good.

One *particular* detail of these policies has jumped out at me, which is
how we treat LLMs as they appear in commit `Co-Authored-By` lines.

If you're not familiar with it, the `Co-Authored-By` annotation is a line in a
commit message used to cite your co-authors.
I use it all the time -- I even have editor macros for adding co-authors.
It's a great way to share credit with your ~~co-conspirators~~ colleagues and
peers.
For example, here's what a commit[^1] with a co-author looks like:

```
commit 819ea3ca6836026bc611d0c8ea1cd5e95cbefc09
Author: Savannah Ostrowski <savannah@python.org>
Date:   Sun Feb 22 10:43:35 2026 -0800

    Refactor jit.yml (#144577)
    
    Co-authored-by: Hugo van Kemenade <1324225+hugovk@users.noreply.github.com>
```

[^1]: Savannah is the release manager for Python 3.16 and 3.17, and Hugo is the
      manager for 3.14 and 3.15 .
      It makes sense that they'd collaborate, but really I just picked a random
      cpython commit from the past few weeks with two authors.


Recently, it's become common to see a non-human co-author cited in these, e.g.

```
commit blahdeblahhashgoeshere
Author: Stephen Rosen <sirosen0@gmail.com>
Date:   Friday, Feb 31st 11:00:01 2026 -0500

      Fix the thing (#404)

      Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Which would indicate that I wrote the commit using -- and it's not clear to what
degree relying upon -- Anthropic's Claude.
I'm not sure who came up with this, but I think it's very clever (not
necessarily in a good way) and a bit weird.

But first, let's look at the policy angle, which can help us understand the
landscape.

The `attrs` Python library recently added an
[AI policy document](https://github.com/python-attrs/attrs/blob/97432db1abbd8d58f1b9712efc6580b7f613f625/.github/AI_POLICY.md).
In it, they ask contributors to explicitly remove any LLM co-author tags.
The rationale for this is clear in the context of the policy: you are asked to
take full ownership of the code you submit, and so you must do some explicit
work to acknowledge that.
It also means that `attrs` won't have those co-author tags in its history, which
may have interesting knock-on effects.[^2]

[^2]: There has been some rather hostile interrogation of "which projects
      are using AI?" going about.
      Although it's reasonable to be concerned about how projects are
      safeguarded against poor quality or stolen work, I find much of the
      public discourse to be making much too much of a weak signal.
      At any rate, `attrs` may be inoculated against some of this accusatory
      behavior.

At the same time, `pytest` is working on their own
[AI policy document](https://github.com/pytest-dev/pytest/pull/14223).
In it, they ask contributors to credit LLM tools via co-author tags.
The rationale for this is sensible in the context of the policy: you may not
have written each line of code yourself, and you should communicate that clearly
and honestly with the maintainers.

And many policies don't say anything at all about this.
For example, the `pip-tools` one
[I just wrote](https://github.com/jazzband/pip-tools/blob/7cbd492ffca99436f57e038951a0c563f2511016/CONTRIBUTING.md#llm-generated-contributions),
with a lot of help and community input, does not mention the co-authored lines,
and neither does the
[SciPy policy](https://github.com/scipy/scipy/blob/d5d3faa73f9822859851bdb0a6f5c936b38a5b2f/doc/source/dev/conduct/ai_policy.rst)
which I used as one of my references.

In terms of my beliefs and values, I'm probably closer to the opinion expressed
in the `attrs` policy than not.
You shouldn't have those co-authored lines: *you* wrote and submitted the code,
regardless of what tools you used.

Do I mark every commit I make from `vim` with `Co-Authored-By: Bram Moolenaar` or `Co-Authored-By: vim`?
Have you ever seen an artist sign their name on a painting?
Did they sign it "co-created by Blick"?[^3]
Do book acknowledgements typically feature a shout-out to Logitech for the author's mouse?
If you cook a dish for guests, do you bring it to the table with a "I hope you
all enjoy this, I cooked *with Cuisinart*"?
Think about it a bit.
Isn't it slightly wrong to call your tool a co-author on your work?

[^3]: My spouse rightly pointed out that "influencers" would do exactly this, as part of their sponsorship deals.
      I found this to be a ringing endorsement of my opinions.

There are two things about the co-authored lines that I do not like.

1. Just as co-authorship can be used to share credit, it can be used to subtly disperse responsibility.

2. I consider those co-authored tags to be a supremely clever bit of guerrilla marketing. I don't like having advertisements in my community spaces.

By ostentatiously showing off where their product is being used, Anthropic[^4]
is able to further normalize its use and claim an undefined amount of credit for
*other people's work*.
Not that there's anything deeply wrong with marketing your product.
I just don't think the code artifacts of the open source community are the
appropriate forum for that.

[^4]: It really seems like Claude is the only tool which appears in commits like this, presently.
      I'm sure other vendors will start doing it too.

It's possible that the `pip-tools` policy will adjust to have an explicit stance
regarding these tags.
It may or may not reflect my personal opinion.
For now, I won't demand that anyone changes what they're doing.

But please, consider removing those tags.
And if you don't feel comfortable owning the code you're submitting, don't submit it.
