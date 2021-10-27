---
layout: post
---

# repl.it awk

I've recently started looking into repl.it for interactive code demos, which
could be embedded into a documentation site.

What would be a good demo of this functionality?

Well, what if I used it to show how some of my `awk` examples from my last
post?

## awk repl is a bash repl

This demo will use a `bash` repl, not an awk-specific one.
Once we're in `bash`, we can use `awk` freely, however, as it's part of the
suite of core utilities expected under POSIX.

## the source for the embed

How is it embedded in this site? repl.it documents use of an iframe.

Like so:

    <iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@sirosen/awk-demo?embed=true"></iframe>

## the repl

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@sirosen/awk-demo?embed=true"></iframe>
