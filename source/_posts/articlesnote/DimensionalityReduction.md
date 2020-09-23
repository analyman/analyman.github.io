---
title: Dimensionality Reduction
date: 2020-09-22 22:00:00
tags: [LLE, PCA, SVD, Dimensionality Reduction]
categories: [笔记]
---

## Dimensionality Reduction 简述
**Dimensionality Reduction** 即将**高维**的数据转化为**较低维**的数据, 
当然这个变换要保持原有高维数据的一些特征才有意义。

通常高维度的数据因为**Curse of dimensionality**是比较稀疏(Sparse), 比较地难以处理地。
在某些情景下**Dimensionality Reduction**就会很有用, 当然前提是保持想要地特征。

**Dimensionality Reduction**的方法通常可以分为*线性*和*非线性*两种,
也可以分为*Feature Selection*和*Feature Extraction*。Dimensionality Reduction
可以用在诸如噪声消除(Noise reduction), 数据可视化(Data visualization), 
聚类分析(Cluster analysis), 以及一些分析的中间过程。

### Feature Selection

### Feature Extraction

## Principle Component Analysis

有一个$n$维线性空间中采样得到的$m$个样本, 记为数据集$X_{(m\times n)}$。
PCA 用于求此数据集$X_{(m\times n)}$的主成分(Principal Component aka. PC),
可以看作是求 "对数据达到最佳拟合的子空间 (lines and planes of closest fit to system of points in space)"。
而后可以用求得的主成分来改变原本数据的基, 这里可能只会用到值相对较大的 $PC$,
忽略那些值相对较小的 $PC$。 因为值相对小的成分有可能是数据中的噪声, 并没有价值。

PCA 在一些领域中有不同的名称, 如在数值分析中叫 **Singular Value Decomposition (SVD)**,
在物理中被称为 **特征向量分析(Eigenvector Analysis)** 或者 **特征分析(Characteristics Analysis)**,
还有一些其他学科中也有不同的名称。

### 分析

PCA 被定义为一个正交线性变换$V_{(n\times n)}$, 其将数据变换到一个新的坐标系统。
设$x_i$为数据集的第$i$个样本即$X$的行向量, $v_j$为正交变换$V$的行向量即新坐标系统的第$j$个基,
那么可以得到第$i$个样本在新坐标系统中第$j$个基的坐标

{% katex '{"displayMode": true}' %}
s_{i,j} = x_i\cdot v_j
{% endkatex %}

那么所有数据在$v_j$上的分量的平方和为$\sum\limits_{i=1}^ns_{i, j}^2$.
在此基础上可以认为所有样本数据在$n$维线性空间中最主要的方向为所有样本在
该方向的分量的平方和为最大, 设为$w$, 则有

{% katex '{"displayMode": true}' %}
\begin{aligned}
w &= \arg\max\limits_{\left||w\right||_2 = 1} \sum\limits_{i=1}^n\left(x_i\cdot w\right)^2\\
  &= \arg\max\limits_{||w||_2 = 1} ||Xw||_2\\
  &= \arg\max\limits_{||w||_2 = 1} w^TX^TXw
\end{aligned}
{% endkatex %}

$X^TX$是一个$n\times n$的对称矩阵, 并且是一个半正定矩阵。 以上的$w$为$X^TX$最大特征值对应的特征向量,
其可以用多种方式求得, 这里用 SVD 分解。

第二主要的方向可以通过减去最主要的方向的分量, 再利用上式求得。剩余的其他方向也是类似的。


### Singluar Value Decomposition (SVD)

对任意一个矩阵$A_{(m\times n)}$有以下分解
{% katex '{"displayMode": true}' %}
A = U\Sigma V^T = \sum\limits_{i=1}^{r}\sigma_iu_iv_i^T
{% endkatex %}

+ $U$: $(m\times m)$正交矩阵
+ $\Sigma$: $(m\times n)$对角矩阵
+ $V$: $(n\times n)$正交矩阵
+ $r$: 矩阵$A$的秩
+ $u_i$: $U$的行向量
+ $v_i$: $V$的行向量
+ $\sigma_i$: 对角矩阵的第$i$个对角分量, 此处可以设$i>j\Longrightarrow\sigma_j\ge\sigma_i$

其中$U$是$AA^T$的特征矩阵, $V$是$A^TA$的特征矩阵, 并且$\mathrm{diag}(\sigma_i^2)$为$AA^T$和$A^TA$的特征值。

#### SVD的推导与证明

设$A$的秩为$r$, 那么$AA^T$和$A^TA$的秩都为$r$(可以利用最大线性无关行向量组进行证明),
$U_{(m\times m)}$为$AA^T$的特征矩阵, $V_{(n\times n)}$为$A^TA$的特征矩阵, 那么有
{% katex '{"displayMode": true}' %}
U^TAA^TU = \mathrm{diag}(p_i) \qquad(i = 1, \dots, m)
{% endkatex %}

以及

{% katex '{"displayMode": true}' %}
V^TA^TAV = \mathrm{diag}(q_i) \qquad(i = 1, \dots, n)
{% endkatex %}

这里$p_i$和$q_i$分别为$AA^T$和$A^TA$的特征值, 可以设为降序的。
设$U^TA = W_{(m\times n)}$, 有
{% mathjax '{"conversion": {"display": true}}' %}
U^TAA^TU = U^TA(U^TA)^T = WW^T = \mathrm{diag}(p_1, \dots, p_n)
{% endmathjax %}

对$U$的第$i$个列向量$u_i$ ($i = 1,\dots,r$), 那么$W$的第$i$个行向量有$w_i = u_i^TA$, 
有$||w_i||_2 = \sqrt{p_i}$, 设$h_i = {w_i\over ||w_i||_2} = {w_i\over \sqrt{p_i}}$, 即
$h_i^T = {w_i\over ||w_i||_2} = {u_i^TA\over \sqrt{p_i}}$, 下面证明$h_i^T$是$A^TA$的特征向量

{% mathjax '{"conversion": {"display": true}}' %}
\begin{aligned}
(A^TA)h_i &= {(A^TA)(A^Tu_i)\over\sqrt{p_i}} = \frac{A^T(AA^Tu_i)}{\sqrt{p_i}} \\
            &= {A^T(p_i\cdot u_i)\over \sqrt{p_i}} = p_i{A^Tu_i\over \sqrt{p_i}} \\
            &= p_i{(u_i^TA)^T\over\sqrt{p_i}} = p_ih_i
\end{aligned}
{% endmathjax %}

所以$p_i$也是$A^TA$的特征值, $h_i$为对应$p_i$的特征向量, 并且可以得出$p_i = q_i,(i=1,\dots,r)$。
设$V_{(n\times n)}$的第$i$列向量为$v_i$, 那么当$i=1,\dots,r$时, 有$v_i = h_i$。
设$\sigma_i = \sqrt{p_i}$, $\Sigma_{(m\times n)} = \mathrm{diag}(\sigma_1,\dots,\sigma_r)_{(m\times n)}$
当 $i=r+1,m$ 时, 有$u_i^TAA^Tu_i = 0$, 所以有$A^Tu_i = 0$, 同理可以得出$Av_i = 0$。

综上所述, 对于正交矩阵$U_{(m\times m)}$, 正交矩阵$V_{(n\times n)}$, 以及$\Sigma_{(m\times n)}$, 有
{% mathjax '{"conversion": {"display": true}}' %}
U^TAV = \Sigma \quad\Longleftrightarrow\quad A = U\Sigma V^T
{% endmathjax %}

### PCA的局限


## Local Linearly Embedding


{% bibliography %}
[Svante Wold, Kim Esbensen, Paul Geladi], Princial Component Analysis, Elsevier Science Publishers, 1987
[Wikipedia], Principal Component Analysis
[Sam Roweis, Lawrence Saul], Nonlinearly Dimensionality Reduction by Locally Linear Embedding, Science, 2000
[Sam Roweis, Lawrence Saul], An Introduction to Locally Linear Embedding
{% endbibliography %}

