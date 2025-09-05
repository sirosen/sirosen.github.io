---
layout: post
---

# 8 Myths and Facts About Editors

After at least a decade of using Vim, I'm trying out a new
editor, [Helix](https://docs.helix-editor.com).

Using something new has pushed me to rethink what an editor is and does.

For fun, I've chosen to approach this topic by writing out **8 Myths and Facts
About Editors**. At the end, I'll share some specifics about Helix and how I've
adapted to it.

There will be hot takes about 30 year old software. Let's get into it.

## Myth: Editors Are Just Tools for Editing Text Files

We call these tools "text editors" and abbreviate it to "editor" for short. And
sure, there are some of them which really _do_ exclusively work on editing text.
`nano`, `pico`, `vi`, and so forth really are just there to edit text files.

But! Emacs is an editor. Vim is an editor. VSCode is an editor. RStudio is an editor.

Editors come in various "thicknesses". They may be very thin, like `nano`,
only offering you access to a text file. Or they may be thicker, like VSCode,
offering text editing, integrated test runners and debuggers, `git` tooling,
project management, and so forth.

When an editor is really thick and focuses on one or a few programming
languages, people call it an "IDE", "Integrated Development Environment". Some
people contend that IDEs aren't editors. To me, this makes no sense: they
may have specialized features, but they definitely edit text.

Helix is way at the other end of the spectrum, a little thinner than Vim. That
has been interesting for me, since I always thought that Vim was thin.

## Fact: Modal Editors are Unintuitive

Sorry, it's a fact.

A modal editor has various "modes", which you switch between to do different
sub-tasks while editing. The prototypical example is Vim, which has "Normal
Mode" for navigation and entering commands (like "open a file", "save and quit")
and "Insert Mode" for typing out text. Vim is *famously* confusing for beginners
because it defaults to Normal Mode, not Insert Mode. You need to learn to switch
modes just to enter text (press `i`). And saving and quitting requires that you
learn how to switch _back_ to Normal Mode (`escape`, then `:wq`, obviously!).

It only takes a little bit of play, perhaps half an hour, to get comfortable
enough with Vim to freely switch modes, write text, and save your work. "See,
it's easy!" But this only scratches the surface. Using Vim in this way is no
better, arguably much worse, than using a less abstruse tool like Sublime Text.

No, I'm afraid that modal editors really *are* unintuitive. Intuitiveness
in technology measures how well you can take what you have learned in other
contexts and bring it to bear. And these tools live in their own universe, where
"right-click" and `Ctrl+Z` lose their memetic power.

There's no instinct, learned from other computer interactions, which should tell
you that `:` is the key you press to enter a new long-command. That `Ctrl+]`
means "go to definition". Or that `yy` means "copy the current line of text".
And while most software doesn't have modes, mode switching is key to
keyboard-based navigation.

Keyboard-based navigation is a new skill to learn, which you probably haven't
practiced in any other program you use. Unless you play a lot of Nethack.

Modal editors require you to learn skills and gain expertise.
That expertise is not portable to other applications, and your prior expertise
in other tools is not applicable.

## Myth: Emacs vs Vim is a Huge Divide

You may have heard about the huge, multi-generational war between the Emacs
Nation and the Vim Tribe. Cities destroyed, civilizations laid to waste,
countless hard-tabs burned.

Emacs users and Vim users get along with one another very well. The communities
include toxic, awful people _because of course they do_. But some of my best
friends are Emacs users, and I don't even hold it against them!

Emacs and Vim are *very* similar. They exist somewhere towards the middle of the
spectrum between IDEs, which aim to offer a complete operating environment, and
bare editors like `nano`, which try to only, very narrowly, edit text.

There are cultural differences between the two editors -- Emacs folks tend to be
much more into defining their own bespoke configuration, Vim folks tend to be
looking for a palatable off-the-shelf experience which they can tweak.
And Emacs isn't modal, but most users effectively define minor modes with their
custom keymaps.
But the communities are more similar than different, and their editors are
tremendously alike as well -- maybe more-so than their users even realize.

## Myth: You Should Learn Vi Because it's Installed Everywhere

_`vi` is the predecessor to `vim`. Almost everywhere, it's an alias to `vim`
run in "compatibility mode". Sometimes, as a special surprise for engineers when
we've been really good and done all of our chores, it really is the original `vi`._

Have you heard this one?
The inherited wisdom says that `vi` will be installed on every crufty old server
you interact with, especially those servers which have been running continuously
since the First Ice Age. So learning it will prepare you.

But:

1. Actually, not even `vi` will be installed there because there is no God.
2. It will probably have `pico` or `nano`.
3. Are you planning to work as a sysadmin on legacy systems? No? Then the rules are different.

There are some domains in which you'll find a lot of machines with `vi`
available. Being comfortable with `vi` could be handy. But this only applies if
you are working in a specific situation in which you know that you will benefit
from learning to use `vi`. (And you can learn what you need in a day, really.)

Increasingly, engineers are working in containers which might not have `vi` or
even `nano` installed. Get ready to use your shell in creative ways.

So no, you don't need to learn `vi`.

## Fact: Learning a Modal Editor Can Make You Faster

Ever heard of [VimGolf](https://www.vimgolf.com/)? It's a puzzle game in which
the goal is to make Vim do something in the fewest possible keystrokes.

VimGolf is played by a bunch of artists -- by comparison to top scoring
individuals, as a mere 10 year user I know _nothing_.

But you don't need to learn fancy tricks or "git gud" in order to be faster
and more efficient with a modal editor than you are with a non-modal tool like
Notepad, GEdit, or Sublime.
Typically, you only need a few commands to unlock a great deal of expressive power.

In Vim, `w` and `b` move you forward and back a word.
`f`, followed by a character, goes to the first instance of that character in a line.
`G` goes to the bottom of the current file.
`d` _followed by any movement command_ deletes from the cursor to that movement command.
Want to delete everything up to the next parenthesis? `df(`.
Delete the two previous words? `d2b`.
The fact that movement has many modes, and can be composed with actions like
`d`, is what makes keyboard-navigation and modal editing interesting.

As a user, you find a few usages which are comfortable for you, and then you
start to expand your knowledge from there.

Once you are acclimated to navigating using the keyboard, it can be _much_
faster than mouse-based navigation.

Some Vim proponents say "you shouldn't use the arrow keys" or "you shouldn't
use the mouse". I think this phrasing fixates too much on there being "a right way".
A good tool should speak for itself. You should use it _because you want to use
it_, not because you got sprayed with a squirt bottle each time you moved your
hand to the right.

Go ahead and use the arrow keys, if you like. Use the mouse. As long as you
are trying to learn the navigational keys as well. If it "clicks", you'll find
you don't reach for those tools much, as a natural consequence of knowing how to
do what you want faster and more accurately from the home-row of your keyboard.

## Myth: Learning to Use an Editor Well Will Make You a Better Programmer

Sub "Programmer" for "Engineer", "Cult Leader", "Person", "Scientist", "Judge of
Character", or "Ferret Wrangler for Hire" as appropriate.

This is pretty much categorically false. A good editor will enhance your work.
It will integrate well with what you already want to do and make the work more
enjoyable for you. It may make some mechanical tasks easier, or save you some
time here and there.

But these tools don't do anything without human input. And you need to decide
what you want to do.

I've heard some people say that you should work on typing speed to be a better
developer. What a load of ableist horseshit.

The hard part of any kind of writing (software or otherwise) isn't getting a
bunch of stuff into a computer. It's figuring out what to write.

In fact, there is a pathology which runs counter to this: a really good editor
could make you worse. A great editor makes it trivial to copy paste text,
to macro-expand one bit of text to a lot of boilerplate, and to jump around
maze-like project layouts.
These are signs that something is going wrong with your work, but you might
not notice it if you're used to your editor hiding these problems.

## Myth: Vim is a Minimal Editor

When comparing Vim vs Emacs, a popular pastime, some enthusiasts like to suggest
that Vim is smaller or more minimal as an inherent property.

There are multiple actively maintained plugin frameworks for Vim. Numerous ways
of hooking in external tools, not even counting `vim-lsp`. Neovim is built in
part around allowing you to use Lua rather than vimscript as the configuration
language.

It's a stretch to suggest that any editor which supports tabs, windowing,
splits, and terminal sub-windows out of the box, plus an extensive plugin
ecosystem, is minimal.

*Having plugins at all* is an architectural choice. *Having scriptable
configuration* is a choice. These are not the choices of a truly "bare bones"
tool. And that's okay. There aren't points awarded for which editor you use.
`vim` isn't _very_ thick, but it's not minimal. You want minimal? Look at `nano`.

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
I regularly do global replacements in Helix by "selecting all pieces of matching
text and replacing them".

Breaking down your assumptions allows you to enrich your understanding. You are
able to see decisions which previously didn't look like decisions at all.

`Ctrl+Z` means Undo. Was that a thoughtful choice, to mirror other applications?
Or perhaps the application's authors didn't see that there was a choice to be
made? In Helix, `u` is undo (this matches `vim`), which is way easier to type
than `Ctrl+Z` . `U` is redo, which is nicely symmetrical (while in `vim` it's
`Ctrl+R`). Undoing and redoing things is pretty common, so they should be easy.

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
more oriented towards selections, and it's taking time to adjust.

10 years of muscle-memory doesn't come undone overnight. I'm several weeks in
and I still occasionally type a Vim command, then act all puzzled and flustered
when something unexpected happens.

However, Helix has a couple of features aimed at usability which are simple
delighters, making the transition easy.

One such feature: Space Mode. Space Mode is an auxiliary or "minor" mode, a
sub-mode of the other modes, triggered by the space key.
For Vim users, Space Mode is like hitting your `<leader>` key.
A wide variety of commands are mapped to Space followed by a key. For example,
`<Space>y` copies a selection to the clipboard in Select Mode. The sauce is
this: Space Mode shows you a command palette, so you can actually see what
you're about to do. Can't remember what the key was to reopen the file picker
window you just closed? `<Space>`-read-the-palette-`'`, and you're set.

A similar usability piece which is frankly wonderful:
when entering a command (`:` followed by some long name), Helix pops open
the suggestion window automatically. `vim` lets you tab through commands,
but you have to know that the feature is there, and you have to start the
command correctly. `:dir` in Helix shows me that I can tab-complete to
`:show-directory`.

In general, the command palettes, command entry, and "hinting" are all around
excellent.

### Plugins, Scripting, & Customization

Helix has no plugins. That's in contrast with Kakoune as well. At first, that
might sound like a failing, but if you're anything like me, plugins constitute
a kind of mental load you carry with your editor. Are you up to date on your
plugins? Are there new ones you should be using? Did someone make a replacement
for that old thing you've been using? Having an experience with no plugins at
all is actually a kind of relief.

As a new editor, LSP support is more or less a requirement. LSPs are the only
form of generic extension which Helix supports, and the integration is blessedly
simple -- I'll share my current Helix configs down below.

The only thing which really seemed to be missing from my vim config, which I
wanted, were a few custom commands I had written.

Helix _does_ let you add custom keybindings. So, for example, I found the
defaults for making text uppercase and lowercase
(`` ` `` and `` Alt+` ``) uncomfortable. This bit of config  is all it takes to
make `Alt+U` and `Alt+Shift+U` do the same job:
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
features. Some things are just not done yet. But a terminal window inside
the editor? That's not coming.

Helix takes the stance that it is a single tool in your toolchain, aiming to be
the best option for viewing and editing text. If you want something more, run
that _alongside_ Helix. It's not a do-everything tool and you shouldn't expect
it to be one or become one.

One feature which makes this "make sense" is the way that calling out to custom
shell commands is done. The entire philosophy of the editor is very "unix-y".

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

### Helix is "Just" a Text Editor (with LSP support)

LSP support means that Helix has out-of-the-box notions of "jump to definition",
"rename symbol", "view documentation", and other goodies. These are part of
the default suite of keybinds, meaning you'll have some pretty reasonable
settings the moment you install.

Autoformatting, e.g., running `prettier` on your JS files, or running LSP code
actions, e.g., sorting Python imports, and a lot of other "normal stuff your
editor should be able to do" is just part of the experience.

But some workflows, like creating a new file in a new nested directory,
are surprisingly a little awkward because they don't map cleanly to the
text-editing-only paradigm.

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
