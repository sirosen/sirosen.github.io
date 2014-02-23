---
layout: post
---

SALVE Logo & Icons
==================

If you go to the SALVE site now, you'll see the new project logo at the top of the page, and a new favicon in place.
I bought these on Shibe Mart for an insignificant quantity of DOGE, having no artistic capabilities of my own.
Not only am I pleased to have found a use for my DOGE, but I'm actually quite happy with the images as well.
They're crisp and simple, which is how SALVE should feel inside and out.
Since I only spent a few cents on them, I admit that I was not expecting quality, but I'm happily surprised with how they look on the site.

Briefcase and Notebook
----------------------

The briefcase and notebook were objects I chose to represent the project because they are a nice physical parallel to the kinds of configuration that the project handles.
Just as a briefcase carries articles of work -- pencils, notebooks, portfolios, and so forth -- SALVE carries the articles of technical work: your vimrc, elisp files, and keymaps.
In the future, when I have time to build a plugin framework, it will be able to carry your apt and yum packages, your git repositories, and even openssl protected credentials.

Site-Wide Changes
=================

Putting the icons in place inspired me to start mucking more with the CSS, template setup, and general design of the site.
Overall, the changes came out being fairly small on a cosmetic side, but required a fairly deep amount of rewriting.
Ultimately, there were very few changes, but they were satisfactory.

New Images, Icons, and Button Layout
------------------------------------
Among the smaller changes, I've made the "About the Author" less prominent, and reskinned the GitHub project button entirely.
There's a lot of space up in the header now, and I might revisit this later.
Removing the GitHub link to the sidebar ultimately had a pretty strongly positive cosmetic effect on the site.

Subsections
-----------
The links on the site have been steadily growing, and it's quickly becoming apparent that the site needs more structure if it is going to continue to be useful.
The major change I made today was to break the language description into its own directory, and display different links when within that directory.
It's a trivial sounding change, but required surprisingly much learning and re-learning about CSS, Liquid, and Jekyll.
More on the pain-points below.

Jekyll and Paths
----------------
Much of the pain during the rewrite came from html files changing directories.
As far as I can tell, Jekyll doesn't have any very graceful ways of handling path rewrites, so fetching CSS from "../stylesheets/style.css" is generally unworkable.
The easiest path out of this that I could find was to rewrite all of these to fetch resources from the site itself over HTTP.
Browsers cache the CSS and images after the first fetch anyway, so it's still just as fast.
