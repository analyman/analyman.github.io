---
title: LLE
date: 2020-09-07 20:11:00
tags: [LLE, Dimensionality Reduction]
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

$$\epsilon(W) = \sum\limits_i\left|\vec{X_i} - \sum_jW_{ij}\vec{X_j}\right|^2$$

