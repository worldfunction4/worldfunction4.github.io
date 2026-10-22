---
title: NetDevOps
date: 2026-08-19
category:
- Python
tag:
- NetDevOps
---
# NetDevOps

用软件工程的方式做网络：配置不再只靠人手一台台敲，而是脚本、版本库、流水线去管交换机和路由器。对个人来说，最具体的就是 **Python + SSH/API 去改设备**。

<!-- more -->

典型路径：[Netmiko库](Netmiko库.md) 连设备 → 备份/巡检 → 再考虑模板（[jinja2模板](jinja2模板.md)）和并发。

这类工作几乎都是 [I/O 密集型](IO密集型和CPU密集型.md)：时间花在等 SSH 返回，不在算圆周率。所以 [GIL(全局解释器锁)](<../专业术语/GIL(全局解释器锁).md>) 对巡检脚本影响很小——线程在等网络时会放锁，多线程仍然能同时挂很多台设备。CPU 真热起来（大规模解析配置、正则）再考虑 [multiprocessing模块](multiprocessing模块.md)。

相关：[Netmiko库](Netmiko库.md)、[远程连接到华为设备](../计算机网络/远程连接到华为设备.md)、[关于开发](../关于经验/关于开发.md)
