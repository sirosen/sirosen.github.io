---
layout: post
---

# 8 Myths and Facts About Editors

Recently, after at least a decade of using `vim`, I've started trying out a new
editor, [Helix](https://docs.helix-editor.com). Simply using something new has
pushed me to rethink how I look at what an editor is and does, what makes one
good or bad, and why I like what I like.

For fun, I've chosen to approach this topic by writing out **8 Myths and Facts
About Editors**. At the end, I'll share some specifics about Helix and how I've
adapted to it.

There will be hot takes about 30 year old software. Let's get into it.

## Myth: Editors Are Tools for Editing Text Files

We call these tools "text editors" and abbreviate it to "editor" for short. And
sure, there are some of them which really _do_ exclusively work on editing text.
`nano`, `pico`, `vi`, and so forth really are just there to edit text files.

But! Emacs is an editor. Vim is an editor. VSCode is an editor. RStudio is an editor.

Editors come in various "thicknesses". They may be very thin, like `nano`,
only offering you access to a text file. Or they may be thicker, like VSCode,
offering text editing, integrated test runners and debuggers, `git` tooling,
project management, and so forth.

When an editor is really thick, people call it an "IDE", "Integrated Development
Environment". And some people contend that IDEs aren't editors. _Some people_
are big snobby jerks about this, suggesting that IDEs aren't "real editors".

It's not so simple. Editors come in various thicknesses, within a continuum.
Helix is a little thinner than Vim, which has been interesting for me, since I
always thought that Vim was very thin.

## Fact: Modal Editors are Unintuitive

It really is true.
A modal editor is an editor with various "modes", which you switch between to
do different sub-tasks while editing. The prototypical example of these is Vim,
which has "Normal Mode" for navigation, searching, and entering commands (like
"open a file", "save and quit"), "Visual Mode" for highlighting and selecting
text, and "Insert Mode" for typing out text. Vim is famously confusing for
beginners because it defaults to Normal Mode, not Insert Mode, so you need to
learn to switch modes just to enter text (press `i`). And saving and quitting
requires that you learn how to switch _back_ to Normal Mode (`escape`, then
`:wq`, obviously!).

It only takes a little bit of play, perhaps half an hour, to get comfortable
enough with Vim to be able to switch modes, do some editing, and save your work.
Vim enthusiasts will sometimes point to this initial learning phase to say "see,
it's really easy!" But this is only scratching the surface of the editor. Using
it in this way is no better, arguably a lot worse, than using a less abstruse
editor like Sublime Text.

No, contrary to what enthusiasts say, modal editors really *are* unintuitive,
as a rule. There's no instinct, learned from other computer interactions, which
should tell you that `:` is the key you press, while in Normal Mode, to enter
a new command. That `Ctrl+]` means "go to definition". Or that `yy` means "copy
the current line of text". Unless, of course, you've used Vim and are expecting
a Vim-like experience. Mode switching is essential to proper use of these
editors, because modes are what enable keyboard-based navigation.

Keyboard-based navigation is a new skill to learn, which you probably haven't
practiced in any other program you use. Unless you play a lot of Nethack.

And modal editors like Vim and Helix really require you to learn that skill in
order to make good use of them. If you use these editors without using their
navigational capabilities, you aren't getting value for your effort.

## Myth: Emacs vs Vim is a Huge Divide

If you've heard anything about editors, you may have heard about the huge,
multi-generational war between the Emacs Nation and the Vim Tribe. Cities
destroyed, civilizations laid to waste, countless hard-tabs burned. eshell vs
the terminal buffer. Org mode vs... okay, `vim` doesn't have an equivalent to
org mode.

This framing is sometimes fun, but there is no global editor war.

Emacs users and Vim users get along with one another quite well. The communities
include toxic, awful people _because of course they do_. But the normal folks
who are focused on actually using the power of the editors to *do something*
in the world? No problems. Some of my best friends are Emacs users, and I don't
even hold it against them!

To court controversy a bit more, I'll say that Emacs and Vim are *very* similar.
They exist somewhere towards the middle of the spectrum between IDEs, which aim
to offer a complete operating environment, and bare editors like `nano`, which
try to only, very narrowly, edit text.

Emacs, by having an internal shell (for Vim this is a relatively new
capability), aims to put you into a mode of operation in which you never leave
the tool. You do everything you need in there. Except... that can't really be
true, since so little of the web works in ELinks. Emacs may be geared towards
_more_ of your activity happening within your editor, but users get to choose
how much they do in or out of the editor.

Emacs is a bit thicker than Vim. The classic quip is that "Emacs is a great
operating system, I just wish it shipped with a decent editor". In fact, both
editors are pluggable systems, with their own bespoke scripting languages for
customization, offering a variety of workflows centered around editing. Emacs
users _tend_ to customize their editor more heavily than Vim users, evidence
that there is a cultural divide. But the people are remarkably similar in style,
and their editors are tremendously alike as well -- maybe more-so than their
users even realize.

## Myth: You Should Learn Vi Because it's Installed Everywhere

_`vi` is the predecessor to `vim`. Almost everywhere, it's an alias to `vim`
run in "compatibility mode". Sometimes, as a special surprise for engineers when
we've been really good and done all of our chores, it really is the original `vi`._

Have you heard this one? I've heard this one. In fact, I distinctly remember
being a CS student and using a tool called `hwsubmit` to submit my homework
assignments. It would always open `vi` with the submission window. (Turned out,
`EDITOR` on the CS lab cluster machines defaulted to `vi`.)

Generally, the story goes that `vi` will be installed on every crufty old server
you interact with, especially those servers which have been running continuously
since the First Ice Age. So learning it will prepare you well.

Here's the thing though:

1. Actually, not even `vi` will be installed there because there is no God.
2. It will probably have `pico` or `nano`.
3. Are you planning to work as a sysadmin on legacy systems? No? Then the rules are different.

There really are some domains in which you'll find a lot of machines with `vi`
available, but not `emacs`. Being comfortable with `vi` could be handy. But this
storied wisdom only applies if you are working in a specific situation in which
you know that you will benefit from learning to use `vi`.

Plus, one of the new fun contexts for software these days is a minimal container
build, often Alpine Linux based, where you might not have `vi` or even `nano`
installed. Get ready to use your shell in creative ways.

So no, you don't need to learn `vi`.

## Fact: Learning a Modal Editor Can Make You Faster

Ever heard of [VimGolf](https://www.vimgolf.com/)? It's a puzzle game in which
the goal is to make `vim` do something in the fewest possible keystrokes.

VimGolf is a bunch of artists styling on the rest of us "Vim pedestrians" --
people are rewriting big Ruby hashes into JSON blobs in under 20 keystrokes.

But you don't need to learn all of these tricks or "git gud" in order to be
faster and more efficient with a modal editor than you are with a traditional
tool like Notepad, GEdit, or Sublime. Typically, you only need a few commands
to unlock a great deal of expressive power. For Vim, consider that `w` and `b`
move you forward and back a word, and these compose with modifiers: `cw` to
delete the next word and enter Insert Mode (semantically, "replace word"), `5w`
to jump to the fifth next word. And there are other navigational shortcuts: `G`
to jump to the end of the current file, `f(` to jump to the first `(` on the
current line, `A` to jump to the end of the current line and drop into Insert
Mode (semantically, "append"), `:%s/vim/hx/g` (looks like `sed`, no?) to replace
all instances of `vim` with `hx` in the current file. `dd` to delete (and copy)
the current line. `p` to paste it. As a user, you find some usages which are
comfortable, and then you start to expand.

Once you are really comfortable navigating using the keyboard, it can be _much_
faster than mouse-based navigation. Especially if you don't have great accuracy
with the mouse.

Some `vim` evangelists say "you shouldn't use the arrow keys" or "you shouldn't
use the mouse". I think they've fixated on the wrong parts of the story here.
Go ahead and use the arrow keys, if you like. Use the mouse. As long as you
are trying to learn the navigational keys while you use the tools which are
comfortable for you, you are likely to get value out of trying a modal editor.
If you invest in learning the navigational commands, you'll probably find you
don't reach for the mouse as much, as a natural consequence of knowing how to do
what you want faster and more accurately from the home-row of your keyboard.

## Myth: Learning to Use an Editor Well Will Make You a Better Programmer

Sub "Programmer" for "Engineer", "Cult Leader", "Person", "Scientist", "Judge of
Character", or "Ferret Wrangler for Hire" as appropriate.

This is pretty much categorically false. A good editor, which you have learned
well, will enhance your work, be it programming or something else. It will
integrate well with what you already want to do and make the work more enjoyable
for you. It may grease the wheels a bit, or save you some time in aggregate over
a year of use.

But these tools don't do anything without human input. And you need to decide
what you want to do.

I've heard some people say that you should work on typing speed to be a better
developer. What a load of ableist horseshit. There are world-class engineers
with all kinds of disabilities. Don't buy into this baloney for a minute. The
hard part of software isn't writing a bunch of stuff. It's figuring out what
to write.

In fact, there is a pathology which runs counter to this: a really good editor
could make you worse. A great editor makes it trivial to copy paste text,
to macro-expand one bit of text to a lot of boilerplate, and to jump around
maze-like project layouts to get from a function's usage site to its definition.
Having to repeat yourself too much -- which copy-paste-replace features can hide
-- or navigate confusing structures -- which jump-to-definition obfuscates -- is
usually a sign that something else is going wrong with your work. But you might
never notice it if you're too used to your editor hiding these problems.

## Myth: Vim is a Minimal Editor

When comparing Vim vs Emacs, some enthusiasts like to suggest that Vim is
smaller or more minimal as an inherent property.

There are multiple actively maintained plugin frameworks for Vim. Numerous ways
of hooking in external tools, not even counting `vim-lsp`. Neovim is built in
part around allowing you to use Lua rather than vimscript as the configuration
language.

It's a stretch to suggest that any editor which supports tabs, windowing,
splits, and terminal sub-windows out of the box, plus an extensive plugin
ecosystem, is minimal.

*Having plugins at all* is an architectural choice. *Having scriptable
configuration* is a choice. These are not the choices of a truly "bare bones"
tool. And to be clear, that's okay. There aren't points awarded for using the
most minimal, zero-config editor. `vim` isn't ultra-thick, like VSCode, but it's
not minimal. You want minimal? Look at `nano`.

## Fact: Using Different Editors Will Expand Your Understanding of Technology

When you use the same tools -- or the same _kinds_ of tools -- for too long,
their assumptions become normative. We select text via click-and-drag because
that's how we have done it since time immemorial. `Ctrl+Z` means Undo.
`Ctrl+F` means "Find"/"Search". The escape key is useless. The way to extend
functionality is with plugins. The space key inserts a space character. There is
only one cursor.

Helix and [Kakoune](https://kakoune.org/), another new modal editor, support
multi-selection. You can have several pieces of text selected (highlighted) at
once. You can expand or move the selections around using keyboard navigation,
and you can even replace, sort, reorient, delete, insert-before, or insert-after
all of the selections at once. Because the assumption made by almost every other
editor -- that there is only one cursor -- was an assumption. And if we do away
with it, new things are possible.

Breaking down your assumptions allows you to enrich your understanding. You are
able to see decisions which previously didn't look like decisions at all.

`Ctrl+Z` means Undo. Was that a thoughtful choice, to mirror other applications?
Or perhaps the application's authors didn't see that there was a choice to be
made? In Helix, `u` is undo, and that's way easier to type than `Ctrl+Z` (this
matches `vim`), and `U` is redo, which is nicely symmetrical (but in `vim` it's
`Ctrl+R`). Undoing and redoing things is pretty common, so they should be easy,
right?

What other assumptions have we made about how the computer should be used? Try
new tools and open up your thinking.

## Helix vs Vim

I've given you my **8 Myths and Facts About Editors**, which I hope was
entertaining. Let's do some side-by-side between Helix and Vim, since that's the
switch I just made.

### Learning & Switching Cost

Helix and Vim both offer built in "tutor" modes, meant to walk you through some
basic usage. I can't remember the vimtutor, other than it went on too long and I
gave up. But the helix tutor is short, maybe 10-15 minutes to work through, and
beginner friendly enough that it helped me get my bearings.

There is a difference in expectation between the tools. While Vim phrasing
is `d5w` (delete, 5 words), Helix phrasing is `v5wd` (select mode, 5 words,
delete). The ordering is different and I rely much more on visual mode, which
Helix calls "select mode", than I did in Vim. The "Helix way" seems to be much
more oriented towards selections in visual mode, and it's taking time to adjust.

10 years of muscle-memory doesn't come undone overnight. I'm several weeks in
and I still occasionally type a Vim command, then act all puzzled and flustered
when something unexpected happens.

However, Helix has a couple of features aimed at usability which are simple
delighters, making the transition easy.

One such feature: Space Mode. Space Mode is an auxiliary or "minor" mode, a
sub-mode of the other modes, triggered by the space key (hey, the name says
what it is!). For Vim users, Space Mode is like hitting your `<leader>` key.
A wide variety of commands are mapped to Space followed by a key. For example,
`<Space>y` copies a selection to the clipboard in Select Mode, and `<Space>k`
shows docs (via LSP) for the item under cursor in Normal Mode. The sauce is
this: Space Mode shows you a command palette, so you can actually see what
you're about to do. Can't remember what the key was to reopen the file picker
window you just closed? `<Space>`-read-the-palette-`'`, and you're set.

A similar usability piece which Vim could really do with for new users:
when entering a command (`:` followed by some long name), Helix pops open
the suggestion window automatically. `vim` lets you tab through commands,
but you have to know that the feature is there, and you have to start the
command correctly. `:dir` in Helix shows me that I can tab-complete to
`:show-directory`.

In general, the command palettes, command entry, and "hinting" are all around
far superior to the experience which I have learned to accept as "necessary"
in Vim.

### Plugins, Scripting, & Customization

Helix has no plugins. That's in contrast with Kakoune as well. At first, that
might sound like a failing, but if you're anything like me, plugins constitute
a kind of mental load you carry with your editor. Are you up to date on your
plugins? Are there new ones you should be using? Did someone make a replacement
for that old thing you've been using since 2010? Having an experience with no
plugins at all is actually a kind of relief.

As a new editor, LSP support is more or less a requirement. LSPs are the only
form of generic extension which Helix supports, and the integration is blessedly
simple -- I'll share my current Helix configs down below.

The only thing which really seemed to be missing from my vim config, which I
wanted, were a few custom commands I had written.

Helix _does_ let you add custom keybindings. So, for example, I found the
defaults for making text uppercase and lowercase (`` ` `` and `` Alt+`
``) uncomfortable. This bit of config  is all it takes to make `Alt+U` and
`Alt+Shift+U` do the same job:
```toml
[keys.normal]
"A-u" = "switch_to_lowercase"
"A-U" = "switch_to_uppercase"
```

Keymaps can be macros, and they can be _lists of commands_, so you can get
fairly creative with these. It's certainly less capable than a scripting
language, but even after a few weeks of usage, I find I don't need much.

### Using the Shell, Pipes, and Why There's No Terminal

You can look around for issues which discuss why Helix doesn't have certain
features, and lots of them offer some insight into the developers' philosophy
around the tool. Some things are just not done yet. But a terminal window inside
the editor? That's not coming.

Helix takes the stance that it is a single tool in your toolchain, aiming to be
the best option for viewing and editing text. If you want something more, run
that _alongside_ Helix. It's not a do-everything tool and you shouldn't expect
it to be one or become one.

One feature which makes this "make sense" is the way that calling out to custom
shell commands is done. The entire organization of the editor is very "unix-y".

I often want to mark commits in GitHub with a Co-Authored-By line, and here's
how it's mapped:

```toml
[keys.select]
"A-g" = ":pipe github-coauthor -"
```

That is, `Alt+G` calls `:pipe` when in Select Mode. It passes the current
selection to a command -- `github-coauthor -` -- and replaces the selection with
the output.

There are a few other calling methods for shell commands, but they all feel
quite similar to this. You are able to integrate external tools into your
editor, but in a precise, text-oriented way.

By the way, here's `github-coauthor`, if you want to use it:
```bash
#!/bin/bash
# SPDX-License-Identifier: MIT

set -eo pipefail
username="$1"
if [ -z "$username" ]; then
    exit 1
fi
set -u
if [ "$username" = "-" ]; then
    username="$(cat)"
fi

response="$(curl -s "https://api.github.com/users/$username")"
id="$(jq .id <<<"$response")"
name="$(jq -r '.name // .login' <<< "$response")"
printf "Co-authored-by: %s <%d+%s@users.noreply.github.com>\n" "$name" "$id" "$username"
```

### My Helix Config

Just for interest, and this is of course available for you to crib, my current
Helix config is as follows...

I have a symlink to work with my dotfiles repo:
	 `~/.config/helix` -> `~/dotfiles/helix/helix`

I've installed Helix as `hx`. Helix doesn't seem to specify if the executable
should be `hx` or `helix` -- both appear online in various forums. So I went
with the short option.
 
`~/.config/helix/config.toml`:
```toml
# SPDX-License-Identifier: MIT
theme = "gruvbox"

[editor]
auto-pairs = false
indent-heuristic = "tree-sitter"
indent-guides.render = true

[editor.inline-diagnostics]
cursor-line = "error"

[keys.normal]
"A-u" = "switch_to_lowercase"
"A-U" = "switch_to_uppercase"

[keys.normal."\\"]
r = ":reflow"

# "\f" is "reformat" via pre-commit
f = [
  ":w",
  # using `:sh` to execute seems to block, and the reload fails to run
  # nesting in an echo "forces" it
  ":echo %sh{pre-commit run --files %{buffer_name} > /dev/null || true}",
  ":reload",
]

[keys.select]
"A-u" = "switch_to_lowercase"
"A-U" = "switch_to_uppercase"

"A-g" = ":pipe github-coauthor -"
[keys.select."\\"]
r = ":reflow"
```

You can see that I've defined `\` as a custom minor mode, to let me have extra
keymaps without risking a collision with anything built-in. And `\f` is using
some trickery to handle some constraints around both Helix and pre-commit.

I also have `~/.config/helix/languages.toml`:
```toml
# SPDX-License-Identifier: MIT
[[language]]
name = "python"
text-width = 88
rulers = [88]

[language-server.pylsp.config.pylsp]
# plugins.mypy.enabled = true
# plugins.rope_completion.enabled = true
# plugins.jedi_completion.enabled = false

plugins.ruff.enabled = false
plugins.black.enabled = true
plugins.flake8.enabled = true

plugins.jedi.extra_paths = ["./src"]
```

My primary development language is Python, so the LSP configuration is all
Python-focused. I'm also learning Rust, but haven't yet found any need to
customize the out-of-the-box LSP Rust toolchain.
