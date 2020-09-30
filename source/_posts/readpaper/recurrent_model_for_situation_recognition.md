---
title: Recurrent Model for Situation Recognition
---

### What is the problem that is being solved?
predict structured 'image semantics' - actions and noun entities fulfilling semantic roles
related to the action.

对指定图片用结构化的语言进行描述

action recognition $\Longrightarrow\limits{generalize}$ situation recognition

#### what the situation recognition differs with caption generation ?


### What are the metrics of success?
Outperform previous state of Conditional Random Field (CRF) based model

优于论文之前的基于CRF的模型


### What are the key innovations over prior work?
I DON'T KNOW


### What are the key results?
using seperate networks for predicting the action verb and the noun entities higher accuracy than
jointing training a visual representation for the two tasks.

Knowledge gained from situation prediction can improve perfomance of captioning image

分别用模型去预测图片中的动作(Action)和物体(entities)相比
仅用一个模型预测有更好的性能。


### What are some of the limitations and how might this work be improved?
IMPROVEMENT IS SMALL, a lot of works should do

### How might this work have long term impact?
I DON'T KNOW


{% bibliography %}
[Arun Mallya, Svetlana Lazebnik], Recurrent Model For Situation Recognition, Urbana-Champaign: University of Illinois, 2017
{% endbibliography %}

