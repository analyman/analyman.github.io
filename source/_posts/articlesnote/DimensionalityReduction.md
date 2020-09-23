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

## Principle Component Analysis

有一个$n$维线性空间中采样得到的$m$个样本, 记为数据集$X_{(m\times n)}$。
PCA 用于求此数据集$X_{(m\times n)}$的主成分(Principal Component aka. PC),
可以看作是求 "对数据达到最佳拟合的子空间 (lines and planes of closest fit to system of points in space)"。
而后可以用求得的主成分来改变原本数据的基, 这里可能只会用到值相对较大的 $PC$,
忽略那些值相对较小的 $PC$。 因为值相对小的成分有可能是数据中的噪声, 并没有价值。

PCA 在一些领域中有不同的名称, 如在数值分析中叫 **Singular Value Decomposition (SVD)**,
在物理中被称为 **特征向量分析(Eigenvector Analysis)** 或者 **特征分析(Characteristics Analysis)**,
还有一些其他学科中也有不同的名称。

### 简略的分析

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

由于 PCA 是通过线性变换来降低数据的维数, 所以对于非线性的流形生成的数据达不到
降低数据维数和精简数据的效果。


## Local Linearly Embedding

与PCA相似的, LLE 可以将高维的数据映射到一个低维的空间。
与PCA不同的是, LLE 可以在某种程度下学习到数据的拓扑结构, 
将其映射到低维的空间并且保持数据的拓扑结构。

### LLE的示例
{% slameImage %}
https://cs.nyu.edu/~roweis/lle/images/swissRoll.gif, Swiss Roll, Swiss Roll
https://cs.nyu.edu/~roweis/lle/images/twinPeaks.gif, Twin Peaks, Twin Peaks
https://cs.nyu.edu/~roweis/lle/images/tfiga.gif, LLE translated faces, Tranlated Face
https://cs.nyu.edu/~roweis/lle/images/faceex1.gif, LLE faces, Faces
{% endslameImage %}


### 拓扑 (Topology)

设$X$是一个集合, $X$的一个子集族$\tau$称为拓扑, 如果满足
+ $X, \emptyset\in\tau$
+ $K$是一个指标集, $\forall i\in K$, 有$A_i\in \tau$, 则$\bigcap\limits_{i\in K}A_i\in\tau$
+ $A, B\in\tau\quad\Longrightarrow\quad A\cup B\in\tau$

记$(X, \tau)$为拓扑空间, $\tau$中的元素称为**开集**


#### 连续性
映射$f: X\mapsto Y$ 在一点$x\in X$处连续, 如果对于$Y$中任意包含$f(x)$的开集$V\in \tau_Y$,
有$f^{-1}(V)\in \tau_X$。


#### 连续映射
映射$f: X\mapsto Y$对任意$x\in X$都连续, 则$f$都是连续映射


#### 同胚映射
如果映射$f: X\mapsto Y$是一一对应的, 并且$f$及其逆$f^{-1}: Y\mapsto X$都是连续的,
则称$f$是**同胚映射**, 或者**拓扑变换**。

如果存在$X$和$Y$的同胚映射时, 称$X$和$Y$是同胚的。


### 流形 (Manifold)

在数学上, 一个流形是一个拓扑空间其局部地和一个欧几里得空间相似(resembles)。更加具体的
$n$维流形是一个拓扑空间其任意一点都存在一个领域
([neighborhood](https://en.wikipedia.org/wiki/Neighbourhood_(mathematics))), 其和一个$n$维欧几里得空间同胚。

例如, 曲线是一个1维的流形、球面是一个2维的流形。

### LLE 算法

设有$N$个$D$维向量空间中的实值向量$\vec X_i$, 其数据从某个光滑的流形进行采样。
假设有足够的数据, 即该流形被完整及良好的采样。

通过对每一个点选择$K$个最近的邻近点, 并且将该点用$K$个最邻近的点进行线性表示, 如下
{% mathjax '{"conversion": {"display": true}}' %}
\vec X_i^\prime = \sum_{j}W_{i,j}\vec X_j
{% endmathjax %}

此处$\vec X_i^\prime$表示由$K$个$\vec X_i$的最邻近点对$\vec X_i$的近似线性表示。
并且对于不是$\vec X_i$ $K$-邻近点 的$W_{i,j}$置为$0$。为了得到$W_{i,j}$的值, 可以优化
Loss 函数
{% mathjax '{"conversion": {"display": true}}' %}
\begin{aligned}
\epsilon(W) &= \sum_i\left|\vec X_i - \vec X_i^\prime\right|^2 \\
            &= \sum_i\left|\vec X_i - \sum_jW_{i,j}\vec X_j\right|^2
\end{aligned}
{% endmathjax %}

对于$W_{i,j}$要求$\sum_{j}W_{i,j} = 1$, 基于以上的$\epsilon(W)$形式,
这可以保证在数据进行平移、旋转、缩放后还有相同的$W_{i,j}$,
因为这些操作不会改变各个点之间的相对距离。$W_{i,j}$反应了数据的一些本质的性质
不会再平移、旋转、缩放下改变。

设LLE 的目标空间维数为$d, d\lt D$, 对每一个$\vec X_i$, 在这个低维的线性空间下
有$\vec Y_i$与之对应。LLE 所应达到的效果为在新的$d$维空间中,
保持每一个点都可以都可以利用其邻近的$K$个点根据$W_{i,j}$进行重建, 既有
{% mathjax '{"conversion": {"display": true}}' %}
\vec Y_i^\prime = \sum_j W_{i,j}\vec Y_j
{% endmathjax %}

与之前类似的, 为了求得$\vec Y_j$, 需要对一个 Loss 函数优化, 即
{% mathjax '{"conversion": {"display": true}}' %}
\Phi(Y) = \sum\limits_{i}\left|\vec Y_i - \sum_j W_{i, j}\vec Y_j\right|^2
{% endmathjax %}

由此可以得到对应每个$\vec X_i$在$d$维空间的表示$\vec Y_i$

{% bibliography %}
[Svante Wold, Kim Esbensen, Paul Geladi], Princial Component Analysis, Elsevier Science Publishers, 1987
[Wikipedia], Principal Component Analysis
[Wikipedia], Manifold
[Sam Roweis, Lawrence Saul], Nonlinearly Dimensionality Reduction by Locally Linear Embedding, Science, 2000
[Sam Roweis, Lawrence Saul], An Introduction to Locally Linear Embedding
{% endbibliography %}

