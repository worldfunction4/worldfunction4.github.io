---
title: 远程ssh云服务器无法登录
date: 2026-08-26
category:
  - 知识库
  - 遇到的一些问题
---
今天想用自己的云服务器做一些练习以及实现，但是遇到了一些问题：

<!-- more -->
![ssh_error.png](/knowledge-base/knowledge/遇到的一些问题/imgs/ssh_error.png)

结果发现是密钥信息过期了，所以执行了`ssh-keygen -R ip`删除原有信息
但是又出现了这个错误：admin@ip: Permission denied (publickey).
似乎是没有使用私钥进行连接，在我使用-i加上私钥的地址再次访问时，结果又报错信息不一致，经排查发现是两边信息不一致...

![someProblem.png](/knowledge-base/photos/question/someProblem.png)