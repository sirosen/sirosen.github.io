---
layout: post
---

Hello, GitHub Pages
===================

I have started using GitHub pages to host my personal homepage.
It seems to work quite well, and Jekyll templating is fairly smooth.
My only major complaint about the system is that it is not possible to render the site without installing Jekyll &c locally.
This is a step backwards from HTML that can be opened in any browser, but it seems worth it for shared headers, footers, and so forth.

Redirecting Correctly
=====================

It actually took a bit of looking to learn what is considered the best practice for redirecting using HTML.
Apparently the `<meta>` tag can sometimes be ignored, and since javascript may be disabled, there is no sure-fire way of doing an automatic redirect.
The next best solution is to try everything you can, and provide an explicit link, just in case.

My old site at `http://people.cs.uchicago.edu/~sirosen/` now serves up the following HTML:
```
<!DOCTYPE HTML>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="1;url=http://sirosen.github.io/">
        <script type="text/javascript">
            window.location.href = "http://sirosen.github.io/"
        </script>
        <title>Page Redirection</title>
    </head>
    <body>
        If you are not redirected automatically, follow the <a href='http://sirosen.github.io/'>link to sirosen.github.io</a>
    </body>
</html>
```

When browsers ignore `<meta>`, they fail over to the javascript rewrite to `window.location`.
This is still very responsive because the script is so small, and loading the target page through this redirect is seamless.
