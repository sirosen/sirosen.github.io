---
layout: post
---

Update: 2018-04-04
---

As of 2018-04-04, I'm no longer using the suggested script anywhere.

I stand by the assessment of this as a gap in the chef-vault toolchain --
accessing vault data outside of the context of a chef-client run -- albeit a
small one.


Scripting Against Chef Vault
===

[Chef Vault](https://github.com/Nordstrom/chef-vault) is an awesome library from Nordstrom.
Yeah, [Nordstrom](http://nordstrom.com), the clothing company.
I was kind of surprised to learn that too, but not because I have any beef with the
company -- it's just unusual for any big company from outside of the software
world to produce FOSS of any consequence.

It is, by general consensus, the most complete solution for managing secrets in
Chef.
Noah Kantrowitz (coderanger) has a
[very nice post](https://coderanger.net/chef-secrets/) about the different
options, which I've seen used often as a point of reference when people talk
about this topic.

But I'm not here to plug Chef Vault.
I'm here to talk about plugging a hole in Chef Vault.

Chef Vault is awesome when you want to decrypt secrets during the a run of
`chef-client`, but, like the standard encrypted data bag items in Chef, the
tooling gets much much weaker when you want to handle secrets outside of this
context.

My Use Case
---

My specific need was to write a script which pulls down a vault secret, hands
it off to some python scripts written by another developer, and then removes it
from disk.
We have this constraint so that the secret is available for certain infrequent
manual actions on our databases, but isn't required during a typical
`chef-client` run.

This lets us keep our servers from being able to read the secret during normal
operations, but still leverage the Chef Vault tooling when it is time to put
our super-secret data on one or more machines.

The chef-vault Command
---

Vault comes with a commandline utility as part of its gem distribution, and
since the `chef-vault` cookbook just `chef_gem` installs the gem, it's
available on any machine where you're running the cookbook.
Sadly, the `chef-vault` command is bad -- it's the only part of Chef Vault
that I have any gripes about, but it really isn't up to snuff.

Not unusable garbage, but just not suitable for any reasonably complex
scripting case.
`chef-vault` takes a vault, vault item, and a single top level key into that
item as a hash.
It produces, as its output, a stringified ruby hash of the value at that top
level key.
Plus, it can't be run to produce the entire item; it requires that key into the
item.
That constraint just stinks to high heaven, and a ruby hash as a string isn't
nice at all.
I would have expected it to have some output formatting options, kind of like
`knife` commands, but it does not.

I want JSON for my python scripts, and I want all of it, not a limited sample.
So, how do we get our vault secrets as JSON?
We should have all of the necessary tools, since `chef-client` can do it, so
can we, right?

First Attempt, Process chef-vault Output
===

I'd like to look at the first thing I hacked while working on this.
It's so atrociously horrible that it should immediately convince you that this
is the *wrong way* to do this.

<pre class="prettyprint"><code class="language-sh">#!/bin/bash

/opt/chef/embedded/bin/chef-vault --chef-config-file /etc/chef/client.rb \
  -v "$1" -i "$2" -a "$3" | \
  tr '\n' ' ' | \
  sed -e 's/^[^{]*{/{/' -e 's/=>/:/g'</code></pre>

Where the arguments are the vault name, the vault item, and the "attribute" of
the vault item (the key into it required).
Note that we need to do nasty `tr` and `sed` to make the ruby hash into JSON,
and there's no guarantee that this will work in all cases (although it worked
in my tests).

Round Two, Doing it Right
===

Because `chef` and `chef-vault` are gems which can be loaded from the embedded
ruby interpreter on a chef node, we can do everything much more nicely in a
ruby script.
It gives us direct access to the `ChefVault` module, so the code should even look
and smell similar to recipes using Chef Vault.

Generally, I'm against templating scripts when it can be avoided, but for
robustness the shebang line should be pointed at `Chef::Config.embedded_dir`.
It's possible to do this in a somewhat less sturdy way by just hardcoding
`/opt/chef/embedded/bin`, as above, but I think it's marginally nicer to set
the shebang line programmatically.
That way, if the embedded `/bin/` dir ever moves, the script won't break.

So, here's the solution I ended up with, and I'm actually surprised by how
happy I am with it.

<pre class="prettyprint linenums"><code class="language-rb">#!<%= File.join(Chef::Config.embedded_dir, 'bin', 'ruby') %>

require 'chef'
require 'chef-vault'

Chef::Config.from_file('/etc/chef/client.rb')

puts ChefVault::Item.load(ARGV[0], ARGV[1]).to_json</code></pre>
