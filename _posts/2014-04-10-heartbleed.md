---
layout: post
---

####Collaborators####
Written in collaboration with Josh Schwartz.

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

Terms: SSL and TLS
------------------

For our purposes, there is no meaningful distinction between the Secure Sockets Layer (SSL) and Transport Layer Security (TLS).
The two are names for the same type of security, although TLS generally is only used to refer to later versions of SSL.
TLS version 1.0 is a refinement of SSL 3.0, [standardized by IETF](http://tools.ietf.org/html/rfc2246 "RFC 2246") in 1999, sometimes refered to as SSL version 3.1, and the taxonomy of these protocols is generally a mess.
Names used include SSL, TLS, SSL/TLS, and sometimes, very incorrectly, HTTPS (HTTPS is actually just a name for HTTP secured with SSL/TLS), and we may use any of the three correct variants.
They all mean the same thing.

What matters for us is that this is the standard for protecting traffic on the web, in particular over the Hypertext Transfer Protocol Secure (HTTPS).
This is the security standard used by every browser to talk to webservers and pull up private data like email, bank accounts, and tax filings.
SSL/TLS refers to the use of these protocols to protect data, and the fact that they have been compromised means that everything from your Google password to your bank PIN are at risk.
We will discuss two implementations of this type of security, OpenSSL and GnuTLS, but for our purposes the only difference between them is the percentage of browsers and webservers using them.

SSL/TLS Has Not Been Mathematically "Broken"
--------------------------------------------

One of the careful distinctions that we have to make here is that SSL/TLS has not been proven to be insecure in their design, or had the underlying mathematics proven incorrect.
There is a great deal of comfort we can take from this, as it means that it is possible that the patched versions of GnuTLS and OpenSSL are secure.
It is equally possible that they contain more crippling bugs, but the *idea* of SSL/TLS still appears to be correct, as long as it is implemented correctly.

What is Cryptography, Anyway?
=============================

"Cryptography" is a word that gets thrown around a lot, but which is very rarely explained in layman's terms.
This is somewhat surprising, since cryptography is simply an art and mathematics of making information available only to the people who should have access to it.
That description is a more general notion of Information Security, and cryptography in particular revolves around finding ways of making proofs of identity -- often called "credentials" or "keys" -- necessary in order to read a message.
Simple as an idea, but complex in practice.

The core challenge of the field, therefore, is to take a message and a target recipient, and produce a new message which is safe to expose in public.
The original message cannot be derived from the alternate message without using a credential possessed only by the intended recipient; this is what guarantees safety and privacy.

Cryptography in the Stone Age
-----------------------------

As phrased, there is nothing restricting cryptography to modern methods.
Although "Stone Age" may be a slight exaggeration, cryptography has been possible since the dawn of written language.
To illustrate, we will consider the example of a Caesarian Cipher, so-called because it was, supposedly, used to relay messages amongst officers of the Roman Empire.

A Caesarian Cipher with the 26 letter Latin alphabet uses an integer between 1 and 25 to encode and decode text.
The simplest way to desscribe this process is as a "shift" on the alphabet.
If the integer is 5, then we shift every letter in the alphabet like so:

<pre><code>ABCDEFGHIJKLMNOPQRSTUVWXYZ
FGHIJKLMNOPQRSTUVWXYZABCDE</code></pre>

We encode "A" as "F", "B" as "G", and so forth, and likewise decode "F" as "A", et cetera.
If we have a message, "ATTACK AT DAWN", it can be encoded as "FYYFHP FY IFBS".
When someone receives the message, he can just shift everything back by 5 in order to recover the original text.

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

To decipher the message, knowing that it is protected with a Caesarian Cipher, all you need to do is guess the correct shift value -- and there are only 25 of those of interest.
It is simple enough to write a program that does this in the modern world, but even guessing with pen and paper it should be easy enough to figure out.
If you write a small program to do this, you would find that with a shift value of -10, the message decodes to the first verse of *The Charge of the Light Brigade*:

> Half a league, half a league,<br />
> Half a league onward,<br />
> All in the valley of Death<br />
> Rode the six hundred.<br />
> "Forward, the Light Brigade!<br />
> "Charge for the guns!" he said:<br />
> Into the valley of Death<br />
> Rode the six hundred.

So I must have encoded it with a shift value of +10 in the first place.

It is therefore reasonable to say that Caesarian Ciphers are not valuable for security, but breaking encryption is no longer so easy.
More on this when we discuss what it would take to break the mathematics underlying SSL/TLS.

Terms: Key, Credential, and Token
---------------------------------

The words "key", "credential", and "token" all refer to proofs of identity.
There are subtle differences between these, and specific connotations, but for the purposes of this document they are all the same.

Bob and Alice: Protecting Messages
----------------------------------

When talking about cryptography, computer scientists often use a common analogy of two people who want to send messages whose content is kept private.
These two people are always named "Bob" and "Alice", and they are always trying to conceal their information from an eavesdropper named "Eve".
Here's the scenario in one of its typical forms:

Bob and Alice are neighbors, but they never speak to one another.
Instead, Bob and Alice exchange written notes, left in one another's mailboxes, but they want the information in these notes to be private, in particular from Eve.
How can they achieve privacy of information when the note contents themselves are publicly available?
Eve could take the mail from their mailboxes and copy it with or without Bob or Alice knowing, and they may or may not be able to detect that she has opened and read a message.

Bob and Alice are analogues for a webserver, some website that you use, and browser, in this scenario.
Just like Bob and Alice, your browser and the servers for CitiBank, Netflix, Google, and many other sites want to exchange information securely.
In order to achieve this kind of security, both the servers and the browser -- analogously, both Bob and Alice -- will have to agree on a standard set of procedures for protecting information.
This set of procedures, a protocol, needs to be publicly known, so that anyone can use it, and it needs to operate even though the messages might be intercepted and copied.
The procedure in use, therefore, is also public information.

###Solution 1: Shared Secret###

Shared secret cryptography, often called "symmetric cryptography", is the simplest solution to this problem, and what you would likely do if you were really in Bob and Alice's situation.
It is a type of cryptography in which there is a piece of information known only to Bob and Alice which is used to protect information.
That secret is exchanged by another means before the communication begins.
For example, if Bob and Alice meet once before beginning to leave one another notes, and agree on a Caesarian Cipher, then the shared secret is the choice of how much to shift text.
In this scenario, the publicly known standard would be the general principle of a Caesarian Cipher.

Unfortunately, there is one major, crippling flaw with symmetric cryptography: communication of the shared secret.
In order to safely share that secret, some secure communication needs to already be possible.
For Bob and Alice, meeting in person constitutes that secure exchange of information, but there is no equivalent for your browser communicating with a webserver.
It is therefore necessary to constrain Bob and Alice further: they may never talk to one another, and only ever send one another notes.
From the very first steps, their communications are at risk of being intercepted.
There are ways around this -- most notably through the technique of [Diffie-Hellman key exchange](http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) -- but in practice shared secrets are not used as often as some other techniques.

Shared secrets do, however, share an important property with client-server interactions.
Consider what happens if Eve intercepts every message sent between Bob and Alice, and keeps them, even without being able to decipher them and at a later date obtains the shared secret.
Once Eve has the shift value for the Caesarian Cipher, then she will be able to decipher all past messages sent between Bob and Alice, including any other secure information exchanged under the cipher like passphrases.
In this scenario, the shared secret is very similar to the type of information that was exposed by the Heartbleed OpenSSL bug.

####Aside: The Duffman-Whoguy What Exchange?####

Diffie-Hellman Key Exchange, often abbreviated to Diffie-Hellman or even DH, is a technique developed by Whitfield Diffie and Martin Hellman in a paper in 1976.
Understanding Diffie-Hellman will be important later, when we discuss Perfect Forward Secrecy -- a technique that relies on the key exchange algorithm.
We present DH below, but first we will lay a foundation of simple arithmetic processes.

To read the procedure, you need familiarity with the "modulus" operation, which given `a` and `b` is defined: `a modulo b` equals the remainder of `a/b`.
The important thing to note about modulus is that if you apply it before and after an arithmetic operation or just afterwards, you get the same result.
That is, `(a+1) modulo b` is precisely the same as `((a modulo b) + 1) modulo b`, and likewise for subtraction, multiplication, division, and exponentiation.
Another way to think of it is that if we view the entire world of integers through the lens of a modulus, pretty much all of your beliefs about arithmetic hold true, although there are some notable exceptions like `(a*b) modulo b = 0`.
Typically, mathematicians and computer scientists are interested in the case where `b` is prime, since that precludes the possibility of there being two numbers `a < b` and `c < b` such that `(a*c) modulo b = 0`.

With a basic understanding of modulus under our belts, onwards to the key exchange procedure.
In brief, this is the procedure for DH between Alice and Bob,

  - Alice and Bob agree in public on a large prime number, `p`
  - Alice and Bob agree in public on a number `n` which is less than `p`
  - Alice chooses a secret number `x` and Bob chooses a secret `y`, which are never shared (even with one another)
  - Alice sends Bob `n^x modulo p` and Bob sends Alice `n^y modulo p`
  - Alice and Bob each raise the values they received to their chosen secrets, modulo `p`
    - Alice produces `(n^y modulo p)^x modulo p = n^y^x modulo p`
    - Bob produces `(n^x modulo p)^y modulo p = n^x^y modulo p`
  - These final values are equivalent because `n^x^y = n^y^x`, so Bob and Alice use them as the shared secret

An important note is that all communication between Alice and Bob is considered to be public during the key exchange.
The public information, therefore, includes `n`, `p`, `n^x modulo p`, and `n^y modulo p`.
However, an attacker would have to deduce `x` and `y` from this information in order to compromise the shared secret, and this, as it turns out, is a very hard problem known as the Discrete Logarithm Problem.

DH is cryptographically sound and strong, but in practice it relies on the security of both Bob and Alice.
If someone obtains the shared secret from Alice or Bob, not necessarily both, then the entire communication is compromised.
There is an alternative...

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

  * Set "result" to an integer computed by ```_gnutls_x509_get_signed_data```
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

  * Set "result" to an integer computed by ```_gnutls_x509_get_signed_data```
  * Check if "result" is less than 0, and if it is, change it to 0
  * Use "result" as the result of the validity check

This disagrees with the convention in the former piece of code.
The trouble with GnuTLS is that it was using the wrong one of these conventions, considering a non-zero value to mean the certificate is valid, even though
```_gnutls_x509_get_signed_data```
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
"This is an echo!"</code></pre>

and the server sends back a message

<pre><code>Heartbeat Reply.
Your message was:
"This is an echo!"</code></pre>

Programmers typically refer to this kind of interaction as an "echo server" because the server "echoes" the original message.

What Happens on Badly Formulated Heartbeat Requests?
----------------------------------------------------

Imagine an ill-formed heartbeat request, something like

<pre><code>Heartbeat Requestasdfasdf.
Message Length: 15.
Please reply with my message:
"This is an echo!"</code></pre>

Although to a human eye the intent is understandable, it's very, *very* hard to write code that reasons at such a high level.
The safest behavior for the server is to note that "Heartbeat Requestasdfasdf" is not the same message type as "Heartbeat Request" and either refuse to reply or send back a message akin to

<pre><code>Received Invalid Request Type:
Heartbeat Requestasdfasdf.</code></pre>

There are, however, more nefarious malformed requests which are harder to detect:

<pre><code>Heartbeat Request.
Message Length: 5.
Please reply with my message:
"This is an echo!"</code></pre>

The message length doesn't match the actual message, but that's much harder to catch.
The server needs to check the total length of the request -- not included here, but available to OpenSSL -- and make sure that it's consistent with the declared message length.
If it fails to do so, it might send a message

<pre><code>Heartbeat Reply.
Your message was:
"This "</code></pre>

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
"I'm not 64000 letters long."</code></pre>

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
"I'm not 64000 letters long.LS0tCmxheW91dDogZGVmYXVsdAotLS0KPGgxPjxhIG5hbWU9ImFib3V0IiBjbGFz..."</code></pre>

The data following the message I sent is not so much "random" as it is "unknown" data.
It could be anything which was stored in memory in the past, but is not anymore.
Since OpenSSL encrypts and decrypts data, that could include username/password pairs, the decrypting private key, account information like balances, phone numbers, and addresses, and so on and so forth.
Any data that ever moves in either direction between your browser and the webserver is either encrypted or decrypted by OpenSSL, so it is stored unencrypted in memory at some point.

What Can't be Exposed by Heartbleed?
------------------------------------

The short answer is "nothing".
It has become clear that Heartbleed can be used to obtain a server's private key, which allows decryption of any past or future traffic which uses the matching certificate for encryption.
The only information safe from Heartbleed, therefore, is data which has never passed over an OpenSSL encrypted channel in which the end-server is relying on an affected version of OpenSSL for encryption.

In practical terms, you can't do anything to protect your SSN, address, or phone number if they may have been exposed.
The only proactive step available is to change your passwords for any websites that were affected.

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
