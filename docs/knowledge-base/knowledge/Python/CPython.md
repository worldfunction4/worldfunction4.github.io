---
title: CPython
date: 2026-08-19
category:
- Python
---
# CPython

日常说的「Python」几乎都是 **CPython**：用 C 写的官方解释器，运行 `.py` 时就是它在执行字节码、管对象、管内存。

<!-- more -->

[GIL(全局解释器锁)](<../专业术语/GIL(全局解释器锁).md>)、[引用计数](引用计数.md) 都是 **CPython 实现上的选择**，不是语言语法规定的。换解释器行为会变：

| 实现 | 特点 |
|------|------|
| CPython | 默认，第三方库兼容最好，有 GIL |
| PyPy | JIT，不少纯 Python 代码更快，兼容性略差 |
| Jython / IronPython | 跑在 JVM / .NET 上，没有 GIL，C 扩展基本不能用 |

所以绕 GIL 的常见办法（多进程、C 扩展放锁）是冲着 CPython 去的。写网络脚本、用 [Netmiko库](Netmiko库.md)，默认环境就是它。
