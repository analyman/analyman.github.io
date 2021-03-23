---
title: Enigma: Decentralized Computation Platform with guaranteed privacy
tags: [blockchain, privacy preseving]
categories: [read paper]
---

### What is the problem that is being solved ?

The incumbemt blockchain face privacy issues that caused by inherent 
distributed schema of blockchain. Which limits application of blockchain
in many area. The paper proposes a method **MPC** schema that can do computation
in private data in premise of not revealing private data.

### method ?

#### threshold shared secret

A threshold cryptosystem is defined by \((t+1,n)\) - *threshold*, where $n$ is the number of parties
and $t+1$ is the minimal number of parties required to decrypt a secret encrypted with threshold 
encryption.

For a secret $s$, assign every partys with a value $[s]_{p_i}$

{% mathjax '{"conversion": {"display": true}}' %}
\begin{aligned}
q(x) &= a_0 + a_1x + \cdots + a_tx^t,\cr
     &  a_0 = s, a_i \sim U(0, p - 1), [s]_{p_i} = q(i).
\end{aligned}
{% endmathjax %}

It is additively homomorphic and addition and multiplication by a scalar operations could be performed directly on the shares,
namely for a secret $s1$, $s2$

{% mathjax '{"conversion": {"display": true}}' %}
\begin{aligned}
[s]_{p_i} &= (s_1 + s_2) + (a_1^1 + a_1^2)\times i + \cdots + (a_t^1 + a_t^2)\times i^t = [s_1]_{p_i} + [s_2]_{p_i} \cr
[s]_{p_i} &= (c + s_1) + (a_1^1)\times i + \cdots + (a_t^1)\times i^t = c + [s_1]_{p_i}\cr
[s]_{p_i} &= (c \times s_1) + (c\times a_1^1)\times i + \cdots + (c\times a_t^1)\times i^t = c\times [s_1]_{p_i}\cr
\end{aligned}
{% endmathjax %}

{% bibliography %}
[Guy Zyskind, Oz Nathan, Alex Sandy Pentland], Enigma: Decentralized Computation Platform with Guaranteed Privacy, arXiv, 2015
{% endbibliography %}

