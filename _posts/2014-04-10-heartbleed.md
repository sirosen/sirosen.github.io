---
layout: post
---

<div class="opening-notes"><h4>Collaborators</h4>
Written in collaboration with Josh Schwartz.
</div>

UNDER CONSTRUCTION
==================

This page is an incomplete work in progress.
Feedback and comments are still appreciated.

I have started working with Josh Schwartz, a close friend of mine, to assemble a more comprehensive higher quality document.

Heartbleed and GnuTLS: From the Technophile to the Technophobe
==============================================================

In March and April of 2014, two major internet security bugs were uncovered.
The first was a bug in a security system known as GnuTLS that exposed many browsers to man-in-the-middle attacks, a type of eavesdropping between computers.
And the second, known as Heartbleed, was a bug in OpenSSL, an even more widely used standard, that affected about ⅔ of secured websites on the publicly-accessible internet.
Even the most casual internet user has probably heard of Heartbleed by now.
Even so, the exact nature of these bugs has remained shrouded in mystery to most readers: between lines of code and obscure discussions of security protocol, it was difficult to discern what was really going on.

We aim to change that.

"Any sufficiently advanced technology is indistinguishable from magic:" this is Arthur C. Clarke’s first law. But the technology and coding that powers the internet is *not* magic.
It is not indecipherable or impossible for lay-people to understand -- and, as our world becomes more reliant on the internet, it has become imperative that more people do understand it.
Even more so with Heartbleed: we want to make it clear to *everyone* what their personal risks are, and what’s really happening behind the scenes.

Our goal in presenting this information, simply stated, is to accommodate an audience that ranges from the technically proficient to the layman.
This is a goal not adequately satisfied by any of the sources that we know of regarding the Heartbleed OpenSSL or GnuTLS bugs.
We have placed more basic information side-by-side with the source code and patches.
You can ignore any part of this guide that doesn’t suit your interest or proficiency: If you understand the introductory material, feel free to skip it.
Likewise, if you find that some of this seems archaic, please do not feel obliged to read the entire thing.
We want to provide as much relevant information as is reasonable, and let you choose what parts of it you want to engage with.

Heartbleed, the Short Version (courtesy of Randall Munroe)
----------------------------------------------------------

Heartbleed is a more widespread and more severe bug than the GnuTLS bug, and if you just want a quick and dirty explanation of it, Randall Munroe's XKCD is simple and accurate:

![XKCD Number 1354](http://imgs.xkcd.com/comics/heartbleed_explanation.png )

This covers most of what goes wrong in Heartbleed.
We will dive into deeper detail here, both about exactly what the bug exposes, and what went wrong inside of OpenSSL's code.

These Bugs Affect Everyone
--------------------------

Here’s the bottom line: if you use any web services -- anything like email and cloud storage which you interact with through a web browser -- your information has most likely been endangered.
Some retailers were also vulnerable.
So was Netflix.
And that’s what makes Heartbleed and the GnuTLS bug so unusual.

Historically, we’ve actually had a pretty good track record with regards to global data security.
Either our success so far has made us complacent, or we’ve just been lucky; either way, these new bugs are major holes in core cryptographic libraries with unprecedented impact.
They stand out both with regards to the wide range of services and users affected, and the severity of the security holes.

The broader range of these problem is easy to explain.
Most security holes pertain to specific versions of specific software or operating systems.
Like remember how in Windows 98, you could use the printing help menus to bypass the login screen ([we do, and haven’t stopped laughing about it since](http://i.imgur.com/JPxql.gif))?
That was a pretty typical, albeit hilarious, security hole.
It was a problem caused by a single developer, in a single product.

But the GnuTLS and OpenSSL (heartbleed) bugs are different.
GnuTLS and OpenSSL are technologies that  underlie many other pieces of software -- from Netflix logins, to printer drivers,  to secure FTP.
And as a result, GnuTLS and OpenSSL are involved in at least two thirds of encrypted traffic on the web, and the vulnerability is not restricted to a single software development firm or operating system.
Numerous companies and services are responsible for ensuring that these bugs are fixed - not just, say, Microsoft.

The severity of these security holes is also pretty understandable.
The holes were practically unlimited in depth: any interaction which you have with a server running the bugged code is at risk.
We say "at risk" rather than "definitely compromised" for a reason.
One of the unfortunate realities of security breaches of this nature is that there is no way to be certain of what information has been leaked.
So to be safe, we have to assume the worst: whatever important data of yours that *might* have been exposed is exactly the information that *has* been leaked.
In practice, it’s probably not as dire as all that, but there’s just no way to know.

But before we dive in deeply into the peculiarities of these bugs, we’re going to take a step back.
The next few sections will be about basic cryptography.
They’ll help give some perspective about what happened, who is responsible, and what you, as a user of web sites and services, should do to protect yourself.

<div class="textbox">
<h2>What’s SSL? What’s TLS?</h2>

<p>For our purposes, there is no meaningful distinction between the Secure Sockets Layer (SSL) and Transport Layer Security (TLS).
The two are names for the same type of security, although TLS generally is only used to refer to later versions of SSL.
TLS version 1.0 is a refinement of SSL 3.0, <a href="http://tools.ietf.org/html/rfc2246" title="RFC 2246">standardized by IETF</a> in 1999, sometimes refered to as SSL version 3.1, and the taxonomy of these protocols is generally a mess.
Names used include SSL, TLS, SSL/TLS, and sometimes, very incorrectly, HTTPS (HTTPS is actually just a name for HTTP secured with SSL/TLS), and we may use any of the three correct variants.
They all mean the same thing.</p>

<p>What matters for us is that this is the standard for protecting traffic on the web, in particular over the Hypertext Transfer Protocol Secure (HTTPS).
This is the security standard used by every browser to talk to webservers and pull up private data like email, bank accounts, and tax filings.
SSL/TLS refers to the use of these protocols to protect data, and the fact that they have been compromised means that everything from your Google password to your bank PIN are at risk.</p>

<h2>SSL/TLS Has Not Been Mathematically "Broken"</h2>

<p>One of the careful distinctions that we have to make here is that SSL/TLS has not been proven to be insecure in their design, or had the underlying mathematics proven incorrect.
There is a great deal of comfort we can take from this, as it means that it is possible that the patched versions of GnuTLS and OpenSSL are secure.
It is equally possible that they contain more crippling bugs, but the <i>idea</i> of SSL/TLS still appears to be correct, as long as it is implemented correctly.</p>
</div>

What is Cryptography, Anyway?
=============================

(Skip this section if you just want to get to the technical bits)

No, seriously, what is it?
The word gets thrown around a lot, but is rarely explained.
There really should be no mystery: cryptography is simply the art (and the mathematics) of making information available only to the people who should have access to it.

More specifically, cryptography focuses on finding ways of making proofs-of-identity -- often called "credentials" or "keys" -- necessary in order to read a message.
It’s a simple idea, but can be complex in practice.
Still, if everything works properly, a message that has been encrypted should be safe to expose to the public.
It should only be decipherable by the intended recipient, who has the appropriate credentials to decode it.

Cryptography in the Stone Age
-----------------------------

Although "Stone Age" may be a bit of an exaggeration, cryptography has been around for a very, very long time.
Romans may have used it to relay messages between officers of the Roman Empire; the Ceasarian cipher, a common cryptographic method, was so named ostensibly because it was frequently used by Julius Caesar himself.

Fortunately for us, the Ceasarian cipher is pretty easy to understand (many of Caesar’s potential eavesdroppers were illiterate, so strong security probably wasn’t a high priority), and so it makes a good introduction to the subject.

Basically, a Caesarian cipher works by shifting every alphabet letter in a message to another letter.
Every letter is shifted by the same amount: if the letter A is shifted five letters to the right to become F, then the letter B is also shifted five to the right, to become G.
So eventually, the entire alphabet looks like this:

<pre><code>ABCDEFGHIJKLMNOPQRSTUVWXYZ
FGHIJKLMNOPQRSTUVWXYZABCDE</code></pre>

That is, if we used "5" as our shifting number; every letter has been shifted to the right by five.
Sounds complicated?
It’s really not.

Take this (perhaps historically viable!) sentence:

ATTACK AT DAWN

If it has been encoded with our own Caesarian cipher, it will appear as:

FYYFHP FY IFBS

When someone receives the message, he can just shift everything back by five in order to recover the original meaning.
Caesarian ciphers don’t have to shift by five, of course -- they can shift by any number between 1 and 25 (after which the alphabet loops back around).
So our attack orders could also be "GZZGIV GZ JGCT" or "HAAHJW HA KHDU," if we chose six or seven, rather than five, as our shifting value.

###Breaking a Caesarian Cipher###

Imagine that you have intercepted a message encrypted with a Caesarian Cipher, and you wish to decrypt it.
The original message reads

> Rkvp k vokqeo, rkvp k vokqeo,<br />
> Rkvp k vokqeo yxgkbn,<br />
> Kvv sx dro fkvvoi yp Nokdr<br />
> Byno dro csh rexnbon.<br />
> "Pybgkbn, dro Vsqrd Lbsqkno!<br />
> "Mrkbqo pyb dro qexc!" ro cksn:<br />
> Sxdy dro fkvvoi yp Nokdr<br />
> Byno dro csh rexnbon.

To decipher the message, assuming (or even better, somehow knowing) that it is protected with a Caesarian cipher, all you need to do is guess the correct shift value -- and there are only 25 to guess from.
A computer can do this easily, but honestly, it’s not too hard for a human, either.
If you write a small program to do this (or use a pen and paper), you would find that with a shift value of -10, the message decodes to the first verse of *The Charge of the Light Brigade*:

> Half a league, half a league,<br />
> Half a league onward,<br />
> All in the valley of Death<br />
> Rode the six hundred.<br />
> "Forward, the Light Brigade!<br />
> "Charge for the guns!" he said:<br />
> Into the valley of Death<br />
> Rode the six hundred.

So our surprisingly literary message-writer must have encoded his message with a shift value of +10.

It's pretty clear from the above that Caesarian ciphers aren’t particularly secure, but we’ve come a long way since then!
Also, our enemies are literate, and necessity is the mother of invention.
Breaking encryption is no longer so easy.

<div class="textbox">
<h2>Terms: Key, Credential, and Token</h2>

<p>The words "key", "credential", and "token" all refer to proofs-of-identity.
There are subtle differences between these, but for our purposes they are all the same.</p>
</div>

Bob and Alice: Protecting Messages
----------------------------------

When talking about cryptography, computer scientists often use a convoluted story about two people who want to send private messages.
These two people are always named Bob and Alice for some reason, and they are always trying to conceal some information from an eavesdropper named Eve (yup, for [eavesdropper](https://www.youtube.com/watch?v=mgIsd7q0SI4)).[^punny]
Here’s the scenario in one of its typical forms:

Bob and Alice are neighbors, but they never speak to one another, because apparently they are mute.
Instead, Bob and Alice exchange written notes, left in one another's mailboxes.
They want the information in these notes to be private, especially from Eve, who they think might be trying to read their correspondence.
How can they maintain their privacy when the note contents themselves are publicly available?
Eve could take the mail from their mailboxes and copy it with or without Bob or Alice knowing; they may or may not be able to detect that she has opened and read a message.

Bob and Alice are analogues for a website (more accurately, a web server), and an internet browser.
Just like Bob and Alice, your browser and the servers for CitiBank, Netflix, Google, and many other sites want to exchange information securely.
In order to achieve this kind of security, both the servers and the browser will have to agree on a standard set of procedures for protecting information.
This set of procedures, known as a protocol, has to be publicly available so that anyone can use it, and it needs to operate even though the messages might be intercepted and copied; a Caesarian cipher is an example of a basic protocol.
The nature of the protocol is therefore also public information, and that only makes things harder.

[^punny]: Puns are actually the death of wit.

###Solution 1: Shared Secret###

Shared secret cryptography, often called "symmetric cryptography", is the simplest solution to Bob and Alice’s conundrum.
Using shared secret cryptography, Bob and Alice would use a piece of information only known to themselves to protect their information.
That information -- the shared secret -- would have to be exchanged by some other means before the secure communication begins.

For example, if Bob and Alice met once and agree on a Caesarian Cipher before beginning to exchange mail, then the shared secret would the choice of how much to shift text.
In this scenario, the protocol employed would be the Caesarian Cipher.

But there’s a problem: Bob and Alice can meet in person, but your browser and a web server can’t.

More broadly, in order to safely communicate a shared secret, some secure means of communication needs to already be possible, and that constraint is exactly as circular as it sounds.
So we’ll need to restrict poor Bob and Alice a bit further: now, they can never meet; they can only send one another notes.
From the very beginning, their communications are at risk of being intercepted.
And using shared secret cryptography, their challenge is now  largely insurmountable.[^DHE]

[^DHE]: There are ways -- most notably the [Diffie-Hellman key exchange](http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)

<div class="textbox">
<h4>Aside: The Duffman-Whoguy What Exchange?</h4>

<p>Diffie-Hellman Key Exchange, often abbreviated to Diffie-Hellman or even DH, is a technique developed by Whitfield Diffie and Martin Hellman in a paper in 1976.
Understanding Diffie-Hellman will be important later, when we discuss Perfect Forward Secrecy -- a technique that relies on the key exchange algorithm.
We present DH below, but first we will lay a foundation of simple arithmetic processes.</p>

<p>To read the procedure, you need familiarity with the "modulus" operation, which given <code>a</code> and <code>b</code> is defined: <code>a modulo b</code> equals the remainder of <code>a/b</code>.
The important thing to note about modulus is that if you apply it before and after an arithmetic operation or just afterwards, you get the same result.
That is, <code>(a+1) modulo b</code> is precisely the same as <code>((a modulo b) + 1) modulo b</code>, and likewise for subtraction, multiplication, division, and exponentiation.
Another way to think of it is that if we view the entire world of integers through the lens of a modulus, pretty much all of your beliefs about arithmetic hold true, although there are some notable exceptions like <code>(a*b) modulo b = 0</code>.
Typically, mathematicians and computer scientists are interested in the case where <code>b</code> is prime, since that precludes the possibility of there being two numbers <code>a < b</code> and <code>c < b</code> such that <code>(a*c) modulo b = 0</code>.</p>

<p>With a basic understanding of modulus under our belts, onwards to the key exchange procedure.
In brief, this is the procedure for DH between Alice and Bob,</p>

<ol>
  <li>Alice and Bob agree in public on a large prime number, <code>p</code></li>
  <li>Alice and Bob agree in public on a number <code>n</code> which is less than <code>p</code></li>
  <li>Alice chooses a secret number <code>x</code> and Bob chooses a secret <code>y</code>, which are never shared (even with one another)</li>
  <li>Alice sends Bob <code>n^x modulo p</code> and Bob sends Alice <code>n^y modulo p</code></li>
  <li>Alice and Bob each raise the values they received to their chosen secrets, modulo <code>p</code></li>
  <ol>
    <li>Alice produces <code>(n^y modulo p)^x modulo p = n^y^x modulo p</code></li>
    <li>Bob produces <code>(n^x modulo p)^y modulo p = n^x^y modulo p</code></li>
  </ol>
  <li>These final values are equivalent because <code>n^x^y = n^y^x</code>, so Bob and Alice use them as the shared secret</li>
</ol>

<p>An important note is that all communication between Alice and Bob is considered to be public during the key exchange.
The public information, therefore, includes <code>n</code>, <code>p</code>, <code>n^x modulo p</code>, and <code>n^y modulo p</code>.
However, an attacker would have to deduce <code>x</code> and <code>y</code> from this information in order to compromise the shared secret, and this, as it turns out, is a very hard problem known as the Discrete Logarithm Problem.</p>

<p>DH is cryptographically sound and strong, but in practice it relies on the security of both Bob and Alice.
If someone obtains the shared secret from Alice or Bob, not necessarily both, then the entire communication is compromised.</p>
</div>

###Solution 2: Public and Private Keys###

The use of Public and Private Keys, more often called Public Key Cryptography or Asymmetric Cryptography, is the commonly accepted solution to Bob and Alice's plight.
The basic principle at play is that each of Bob and Alice will have a pair of values unique to each of them.
One of the values is a piece of public information, and the other one is an unshared secret -- the public information for Bob is Bob's public key, and the one for Alice is her public key, while the secrets are their respective private keys.
In order to be useful, the pairs of keys, "keypairs", need to have a few properties.
First, the private key must not be possible to derive from the public key.
Second, information encrypted with the public key must be possible to decrypt only with the private key.
Third, and finally, information encrypted with the private key must be possible to decrypt only with the public key.

What arises once these constraints are met?
Bob and Alice can make their public keys open information, writing them on their houses or mailboxes if they like.
In order for Bob to send Alice a message, he just encrypts it with her public key, and puts it in her mailbox.
Only Alice has her private key, so only she can decrypt the message.
Not even Bob can perform this step, even though he created the encrypted message!

If Eve intercepts an encrypted message, even though she has both Bob's and Alice's public keys, she cannot decrypt the message.
If she ever obtains a private key, she can decrypt all messages sent to the owner of that key, but not the other way around.
In practice, however, asymmetric cryptography is slower, and is therefore often used to agree upon a shared secret used for symmetric cryptography.
As a result, if either key is compromised, the entire communication using the shared secret is exposed.
This is not exactly the technique of SSL/TLS, but it is very similar.

####Breaking Public/Private Key Cryptography####

Since TLS relies heavily on Public/Private keys, it bears taking a moment to talk about what would be necessary in order to break this type of cryptography.
Asymmetric cryptography relies on the fact that we have no good mathematical techniques to factor the products of very large primes.
The private key is a pair of large primes, `p` and `q`, each with at least a couple hundred digits, and the public key is simply their product, `N = p*q`.
In truth, there is a little bit more information at play, but this is the key to understanding the mathematics.

It's very easy to see that the public key can be derived from the private key.
What is less clear is that it is extraordinarily hard to deduce the private key from the public key.
There is a great deal of research in number theory on the distribution of primes, and there are some [very old unsolved problems](http://en.wikipedia.org/wiki/Riemann_hypothesis) in this domain.
Barring a breakthrough in number theory, the only approach we can take is a variation guess-and-check.

Let's take that guess-and-check approach and examine what we know about how long it will take as we increase the size of `N`.
In order to guess the prime roots of `N`, in the worst case we have to count as high as <code>&#8730;(N)</code>.
Any higher than that and the number can't be a prime root of `N`.
If `p` and `q` each have over 200 digits, then <code>&#8730;(N) > 10<sup>200</sup></code>, so in the worst case we have to perform <code>10<sup>200</sup></code> guesses.
At the time of this writing, China's Tianhe-2 supercomputer, with a computing capacity of 33.86 PetaFLOPS, is the fastest in the world.
By a rough estimate, that means that it can make <code>33,860,000,000,000,000 = 3.386 * 10<sup>16</sup></code> guesses every second.
So the most powerful computer in the world, at the time of this writing, could take around <code>10<sup>184</sup></code> seconds or <code>3*10<sup>177</sup></code> years to break typical cryptography.

Of course, this is a fairly generous estimate, as we may be able to narrow down the scope of guesses with some clever arithmetic.
Let's say that we're able to cut down the number of guesses by precisely a factor of <code>10<sup>184</sup></code>, so that we can guess correctly within a second in the worst possible case.
This would be a pretty absurd improvement in our ability to guess private keys, but without improving upon the approach we take it does not bear very fruitful results.
What then happens when we increase `p` and `q` to 400 digit primes?
Then we have to make <code>10<sup>400</sup></code> guesses, so that even with our factor of <code>10<sup>184</sup></code> improvement, it will take <code>10<sup>200</sup></code> seconds or <code>3*10<sup>193</sup></code> years to break.

All of these back-of-the-envelope calculations are meant to give a vague sense of how strong public key cryptography is in its mathematics.
That said, all of this is moot if there are holes in the implementation of this security.
We can therefore assume that the theoretical background of SSL/TLS is very strong, and not a subject of immediate concern.
If someone finds a way to factor large numbers quickly that can't be beaten by just increasing the size of `N`, we may have a problem in that domain, but for now the risk that anyone breaks SSL/TLS on a mathematical level is quite low.

Proving Identity: Challenge-Response and Cookies
------------------------------------------------

A common case, especially for web services, in which a private or shared secret is used is authentication.
"Authentication" generally refers to any action which proves your identity to a server or service.
You've probably gone through a straightforward form of this at some point, if you live in the US, when a bank or telecom agent has asked for your SSN over the phone.
In terms of security, Social Security Numbers are only marginally better than asking for first and last name -- if the phone agent were a computer system, you could guess well over ten thousand possible values in the blink of an eye -- but the principle is the same.
In SSL protected web services, your credential is generally a file managed by your browser called a "cookie".

By way of example, I may have a cookie on my computer, peculiar to me, named "ID.AMAZON" which is a credential proving my identity to Amazon's services.
Whenever I attempt to open Amazon.com, my browser uses a public key for Amazon's webservers to encrypt "ID.AMAZON" and send it to the webservers.
They then decrypt it and verify that it is valid.
At that point, the browser has satisfied the webserver about its identity, and communication can begin.
This is how websites remember your identity and allow you to login without always having to enter your username/password pair.

Another typical communication to perform this action is the "Challenge-Response" in which Amazon first sends me a message that reads "If you really are Stephen Rosen, reply with the square root of this integer: 400" encrypted so that only "ID.AMAZON" can decrypt it.
The browser decrypts the message, and then sends the reply "The square root of 400 is 20" encrypted so that only Amazon's secret key can be used to decrypt it.
Challenge-Response type authentication is often preferred because the authentication token, "ID.AMAZON", is never sent, so that if communications are intercepted or leaked, the eavesdropper can't impersonate the user.
If all you intercept is "The square root of 400 is 20", you still don't know the contents of "ID.AMAZON".

In practice, both of these strategies are used, and a service's implementation of authentication can have dramatic affects on who can impersonate you in the presence of a security bug like Heartbleed.

GnuTLS: A Bug You Probably Don't Care About
===========================================

GnuTLS is an implementation of SSL/TLS used to protect interactions between clients and servers.
It is significantly less popular than OpenSSL, but many pieces of software, especially those related to network printing, rely on it to implement SSL.
Part of the reason that you probably don't care about this bug is that GnuTLS is not used in any major browser or webserver, and as a result is rarely handling credentials like username/password pairs.
However, it is important to understand what went wrong with the GnuTLS bug to realize just how fragile our Internet ecosystem is.

A Bug in the Wild
-----------------

We often talk about security bugs that are actively exposing servers and users as being "in the wild", and one of the big concerns about security holes during the post-mortem is how long they were in this state.
A bug that is active for less than a day is likely one that was discovered during a final round of testing against the new version of a system.
If a bug is only active for a brief window, then only users and system administrators who updated their software during that windows need to be concerned.
The GnuTLS bug was not, however, active for a mere day.

As mentioned before, the bug was discovered in March of 2014, but it was set loose on the world in 2005!
A whopping eight years of imperiled data!
How did this happen?
Who do we hold responsible, and how to we respond?

Exposure to Man-in-the-Middle
-----------------------------

In terms of effects, the GnuTLS bug exposed software like browsers relying on it to a type of attack called a "Man-in-the-Middle" attack.
A "Man-in-the-Middle" attack is a classic case of eavesdropping in which the attacker intercepts traffic between the server and client, usually forwarding it along and keeping a copy.
Usually, a challenge-response type communication between the server and client protects against this, as the eavesdropper can store messages but can't decrypt them.

In GnuTLS, however, the eavesdropper could obtain the contents of a communication by masquerading as another server.
When a browser goes to a page, for example "twitter.com", the Twitter webservers send along a Public Key called a Certificate.
The Certificate essentially states "I am twitter.com, and you know this document was not forged because it bears the signatures of these trusted authorities: ..."
Leaving the signing mechanism out of the picture, those authorities are built into your system, and are trusted third parties, like Verisign, whose sole purpose is to validate Certificates.
The failure of GnuTLS was to incorrectly mark Certificates not bearing these signatures as valid, meaning that an attacker could forge a certificate and go undetected.
The attacker then claims to be "twitter.com" and forces the user to authenticate against it, using that information to authenticate against the real Twitter servers.
It forwards the traffic back and forth between the user and the Twitter servers, neither party ever knowing that all of their communications are entirely exposed.

Disciplined Testing
-------------------

Probably the biggest problem with the GnuTLS bug is that it took so long for it to be identified.
How could a bug of this magnitude have been sitting around for so long?
The clear answer is that the code was never tested.
No one working on GnuTLS ever fed it a bad certificate and verified that the verification step spat it back out.
More acurately, no one ever fed it a certificate carefully crafted to bypass verification, or attempted to input every different variation on a certificate, both valid and invalid, conceivable.

For such a critical piece of code, its quite shocking that this was never done.
There are well-built tools for testing C code, like CUnit, and we have to strongly fault the GnuTLS team as a whole, not just the programmer who created this bug, for omitting this kind of testing.
Testing code is hard, typically much harder than writing it in the first place, but the more important the code is, the more important it becomes to test it thoroughly.

Testing, however, is not the sole domain of the creators of software.
That's something which is important to keep in mind when we shift our attention to the OpenSSL Heartbleed bug.

###C Programming: What Constitutes Failure?###

Let's take a brief moment to investigate the exact cause of this bug.
The original source code was inside of a check for certificate validity, and looked like this:

<pre><code>    result =
        _gnutls_x509_get_signed_data (issuer->cert, "tbsCertificate",
                                    &issuer_signed_data);
    if (result < 0)
        {
        gnutls_assert ();
        goto cleanup;
        }

// ... elided

    cleanup:
        // cleanup type stuff
        return result;</code></pre>

For the non-programmers and non-C programmers in the audience, this body of code has the following meaning:

  * Set "result" to an integer computed by `_gnutls_x509_get_signed_data`
  * Check if "result" is less than 0, and if it is, use it as the result of the validity check

But what does it mean if I ask "is this certificate valid?" and the code replies "-1"?
This is the core ambiguity because in C there are three ways to interpret that answer, two of which are considered standard.
The first way is "it's a negative value, so the certificate is invalid".
The second way is "it's a nonzero value, so the certificate is valid".
The third and final way is "it's a nonzero value, so the certificate is invalid".

Consider the patched version of the code:

<pre><code>    result =
        _gnutls_x509_get_signed_data (issuer->cert, "tbsCertificate",
                                    &issuer_signed_data);
    if (result < 0)
        {
        gnutls_assert ();
        goto fail;
        }

// ... elided

fail:
    result = 0;

cleanup:
    // cleanup type stuff
    return result;</code></pre>

Again, for those who aren't C programmers, the meaning of this code:

  * Set "result" to an integer computed by `_gnutls_x509_get_signed_data`
  * Check if "result" is less than 0, and if it is, change it to 0
  * Use "result" as the result of the validity check

This disagrees with the convention in the former piece of code.
The trouble with GnuTLS is that it was using the wrong one of these conventions, considering a non-zero value to mean the certificate is valid, even though
`_gnutls_x509_get_signed_data`
was using the convention that negative values mean that its invalid.

The bug is subtle and easy to miss, and it occurred when GnuTLS was switching amongst these conventions for the meanings of integer results.
Such a small difference -- the interpretation of a single integer -- is the difference between being exposed to an attacker and not.
Many debates are now raging about what we could have done differently, but clearly we need to take a closer look at how we produce and distribute critical security-related code.

###GOTO Is Not Inherently Evil###

One of the biggest and loudest ways in which GnuTLS was criticized was for reliance on `goto` statements.
Generally, programs can be read top to bottom, like prose on a page, but `goto` statements are essentially like the choices at the bottom of "Choose-Your-Own-Adventure" books, jumping from point to point.
As a result, badly structured programs which use `goto`s irresponsibly are very hard to read, and the `goto` statmenet itself is often frowned upon in the programming community.
The notion that this bug arose because GnuTLS uses `goto`s was reinforced by the memory of Apple's recent security bug in OS X 10.8, which revolved around a misplaced `goto`.

In spite of all of the noise that was made at the time this bug surfaced, `goto` is not responsible.
Nor could it ever be.
The core problem with the GnuTLS bug is correctness, not elegance, and programmers seem to forget about the real issues when subjects of contentious debate, like `goto`, surface.
The only known ways to ensure correctness that have ever met with real success are to write extensive test suites for software, or to use languages which forbid, by design, entire classes of errors.
In practice, almost all mission critical code in wide use is written in C, so the only choice is to write numerous tests and insist that your tests cover every line of code and every possible way for each component to run.

Free and Open Software, and Development Burden
----------------------------------------------

Once we've established that the GnuTLS bug was bad, and that the people who made it should have done better, it makes sense to take a closer look at who those people are.
GnuTLS is a open source community project, which means that it is globally maintained by anyone who has the spare time to work on it.
In fact, there are a small number of people who play leading roles in the project, but they don't exercise the same kind of control over contributions that a manager does at a software firm.

There are many advantages to community maintained projects, one of which is the notion that if anyone can look at and alter the code, with the approval of the maintainers, then the code will be of higher quality.
There are two major problems with this idea.
The first, and obvious one, is that working on a Free, Open Source project is pro-bono work, so many people won't be interested.
The second, perhaps more nefarious one, is that precious few people are well enough versed in the subtleties of SSL/TLS to properly audit the code in GnuTLS.
Many hands make light work when they're all well qualified, but they do shoddy work otherwise.

In practice, GnuTLS is maintained by a small core group of programmers who receive little more than name recognition for their efforts.
Given the criticality of the software, this is quite surprising.
Large companies using the software may sometimes submit changes to the developers, but in practice they are more likely to be using OpenSSL.
Without diving into why OpenSSL is more popular, it is fair to say that GnuTLS's nature as an underdog in this domain means it receives much less attention than it needs.
Of course, that's not to say that OpenSSL is impervious to bugs...

OpenSSL Heartbleed, or "How I Learned to Stop Worrying and Love the Bug"
========================================================================

Heartbleed has been described variously as "the worst security bug to date" and "on a scale from 1 to 10, this is an 11".
An estimated two thirds of the encrypted traffic on the web is protected by a server running OpenSSL.

Heartbleed can leak almost any information exchanged with a server, including the private key which it uses to decrypt traffic sent with its certificate.
If an attacker obtains the server's private key, he or she can decrypt any traffic bound towards the server, so long as he or she intercepts it.
The situation is the same as that of Alice and Bob if Eve obtains Bob's private key: if Alice leaves a message in Bob's mailbox, and Eve makes a copy of it, she can decrypt and read it using his private key.
Furthermore, such an eavesdropping attack on communications between Alice and Bob would, itself, be undetectable.

Part of the trouble with Heartbleed is that there is no indication that the initial attack, attempting to obtain the server's private key, has been carried out.
As a result, there is no way for service providers like Google, Twitter, Amazon, and Yahoo to know whether or not their keys have fallen into the hands of a malicious party.
At the end of this section, we will take note of the practice of "Perfect Forward Secrecy", which can protect communications from Eve decrypting past communications.
Once Eve has the private key, however, she can impersonate the server, and Forward Secrecy does not protect communications in this scenario.

What are Heartbeats?
--------------------

Heartbleed revolves around one of OpenSSL's TLS extensions (additions to the core TLS protocol), which adds "heartbeats" to the protocol.
A heartbeat, often called a "keepalive" in other protocols, is a message whose sole purpose is to ensure that the connection between client and server is still active.
In OpenSSL, Heartbeats take the form of a request for the server to repeat a message back to the client.
The OpenSSL server is sent a message of the form

<pre><code>Heartbeat Request.
Message Length: 15.
Please reply with my message:
This is an echo!</code></pre>

and the server sends back a message

<pre><code>Heartbeat Reply.
Your message was:
This is an echo!</code></pre>

Programmers typically refer to this kind of interaction as an "echo server" because the server "echoes" the original message.

What Happens on Badly Formulated Heartbeat Requests?
----------------------------------------------------

Imagine an ill-formed heartbeat request, something like

<pre><code>Heartbeat Requestasdfasdf.
Message Length: 15.
Please reply with my message:
This is an echo!</code></pre>

Although to a human eye the intent is understandable, it's very, *very* hard to write code that reasons at such a high level.
The safest behavior for the server is to note that "Heartbeat Requestasdfasdf" is not the same message type as "Heartbeat Request" and either refuse to reply or send back a message akin to

<pre><code>Received Invalid Request Type:
Heartbeat Requestasdfasdf.</code></pre>

There are, however, more nefarious malformed requests which are harder to detect:

<pre><code>Heartbeat Request.
Message Length: 5.
Please reply with my message:
This is an echo!</code></pre>

The message length doesn't match the actual message, but that's much harder to catch.
The server needs to check the total length of the request -- not included here, but available to OpenSSL -- and make sure that it's consistent with the declared message length.
If it fails to do so, it might send a message

<pre><code>Heartbeat Reply.
Your message was:
This </code></pre>

instead of something more like

<pre><code>Received Invalid Request of Type "Heartbeat Request".
Specified length: 5 doesn't match actual length: 15.</code></pre>

Exploiting Heartbleed, a Lying Request
--------------------------------------

This kind of invalid request detection, which is explicitly specified as the intended behavior of heartbeats, was not done correctly in OpenSSL.
Consider the following request:

<pre><code>Heartbeat Request.
Message Length: 64000.
Please reply with my message:
I'm not 64000 letters long.</code></pre>

64000 bytes (one byte is one "character" or letter), 64 kilobytes, is the maximum length for a heartbeat message.

This is a classic security hole known as a "buffer overread" attack, in which a requester asks for more information than is actually available.
Without correctly checking the length of the message, the server attempts to reply with 64 kilobytes (KB) of text.
Where does that text come from?

###Memory Allocation, Safety, and "Random" Data###

Memory Allocation is the process by which programs, in our case OpenSSL, create space in which to work.
They do this by invoking a component of the C language called "malloc", short for "memory allocate", which creates a new block of space of whatever size is requested.
All of the space under discussion is in RAM or Main Memory -- the general purpose scratchpad for all computer programs.

In order to keep programs from stepping on their own toes, blocks created by malloc are always non-intersecting.
That means that if I ask at one time for space for 100 integers at one time, and later ask for space for 20 characters, I don't need to worry that changing one of my 100 integers might alter some of my 20 characters, and vice versa.
Without this constraint, writing correct programs would be more or less impossible.

When I'm done working with my 100 integers, I can release that space so that it can be used the next time I invoke malloc and ask for more space.
This process is called "freeing" the memory, and a good C programs responsibly free memory as they are able, which keeps their total RAM usage down.
Importantly, freeing those 100 integers doesn't alter them in any way -- they may remain exactly where they were without being overwritten for some time.
This is mostly a time saving measure within C, which was designed for maximal performance in many regards, since there's no reason to try to obscure that data -- the next time it's allocated for a new use it will just be overwritten anyway.

The absence of any clearing actions when memory is allocated or freed is important to understanding Heartbleed fully.
It is possible to write slower, more foolproof, C code which explicitly rewrites all values when they are allocated or before they are freed, but this was not the practice of the OpenSSL team.
When an exploitative heartbeat request is sent, the extra data sent back to the attacker is produced by allocating as much memory as is specified by the request, and then only copying over the beginning segment.
So the reply to the request above might look like

<pre><code>Heartbeat Reply.
Your message was:
I'm not 64000 letters long.LS0tCmxheW91dDogZGVmYXVsdAotLS0KPGgxPjxhIG5hbWU9ImFib3V0IiBjbGFz...</code></pre>

The data following the message I sent is not so much "random" as it is "unknown" data.
It could be anything which was stored in memory in the past, but is not anymore.
Since OpenSSL encrypts and decrypts data, that could include username/password pairs, the decrypting private key, account information like balances, phone numbers, and addresses, and so on and so forth.
Any data that ever moves in either direction between your browser and the webserver is either encrypted or decrypted by OpenSSL, so it is stored unencrypted in memory at some point.

What Can't be Exposed by Heartbleed?
------------------------------------

The short answer is "nothing".
It has become clear that Heartbleed can be used to obtain a server's private key, which allows decryption of any past or future traffic which uses the matching certificate for encryption.
The only information safe from Heartbleed, therefore, is data which has never passed over an OpenSSL encrypted channel in which the end-server is relying on an affected version of OpenSSL for encryption.

In practical terms, you can't do anything to protect your SSN, address, or phone number if they have been exposed.
The only proactive step available is to change your passwords for any websites that were affected but are now secure.

The exception is for any service that has been practicing Perfect Forward Secrecy, in which no all communications are protected by a shared secret determined using Diffie-Hellman on top of OpenSSL's encryption.
This technique prevents decryption of past communications in the event that the server's private key is exposed.
Some major companies like Google, Twitter, and Amazon have been experimenting and even using Perfect Forward Secrecy for a few years now, but the practice is far from widespread.
In February 2014, Amazon added this capability to the Amazon Web Services public cloud, so it may become more prevalent in the near future.
The safest assumption, however, remains that none of the services you're using have been leveraging Forward Secrecy.

How did Heartbleed Get Into the Wild?
-------------------------------------

You might be thinking "Heartbleed sounds really, really bad!"
If so, you would be entirely correct.
So how did such a dangerous bug make it not only into the OpenSSL codebase, but onto tens of thousands of servers?

###Why Have Heartbeats Self-Report Length?###

Every heartbeat request includes the length of its message, but we've mentioned before that a server needs to check that this is correct.
An obvious question that this raises is "if this can be checked elsewhere, why include it at all?"
In truth, the inclusion of message length is less brain-dead than it sounds -- it's a necessary part of a clever networking trick called "piggybacking."

The basic idea of piggybacking is to send two messages packaged together, like including two letters in one envelope.
A request might look something like this:

<pre><code>Heartbeat Request.
Message Length: 16.
Please reply with my message:
This is an echo!

Basic Authentication Request.
Username Length: 7
Password Length: 6
Username: vizzini
Password: iocane</code></pre>

The great benefit of doing this is that the flat costs of sending a request to
the server -- the metaphorical equivalent of the postage stamp -- are only paid
once, even though two requests are being made.

The server receiving these requests knows the total length of the message that
it received, but it doesn't know where in the messages sent the heartbeat
request ends unless the heartbeat itself specifies how long its message is.

Consider the following malformed version of the above request:

<pre><code>Heartbeat Request.
Message Length: 103.
Please reply with my message:
This is an echo!

Basic Authentication Request.
Username Length: 7
Password Length: 6
Username: vizzini
Password: iocane</code></pre>

The server will understand the message in the heartbeat request to have been

<pre><code>This is an echo!

Basic Authentication Request.
Username Length: 7
Password Length: 6
Username: vizzini
Password: iocane</code></pre>

And why shouldn't it? Why can't the words "Basic Authentication Request" be
part of the message?

However, as long as the information sent back is limited by the total size of
the packet or "envelope" received, the server can't be sending back information
that the sender didn't already have.
