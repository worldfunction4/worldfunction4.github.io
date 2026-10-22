---
title: Python
article: false
index: false
---
# Python

语法、运行时、并发和常用库。对应博客「语言 → Python」。

## 基础

- [关于列表](关于列表.md)
- [列表推导式](列表推导式.md)
- [range](<range()函数.md>)
- [正则表达式](正则表达式.md)

## 函数与语法

- [闭包](闭包.md)
- [装饰器](装饰器.md)
- [生成器](生成器.md)
- [yield](yield.md)
- [pickle 序列化](pickle序列化.md)

## 运行时与并发

- [CPython](CPython.md)
- [引用计数](引用计数.md)
- [IO 密集型和 CPU 密集型](IO密集型和CPU密集型.md)
- [多进程 VS 多线程](多进程VS多线程.md)
- [协程](协程.md)
- [multiprocessing](multiprocessing模块.md)
- [concurrent.futures](concurrent.futures模块.md)

## 思想与开发

- [关于写代码](../关于经验/关于写代码.md)
- [关于开发](../关于经验/关于开发.md)
- [编程思想](../关于经验/编程思想.md)
- [所谓掌握](所谓掌握.md)
- [软件架构](软件架构.md)
- [面向对象编程](<面向对象编程(OOP).md>)

## 库与工具

- [jinja2](jinja2模板.md)
- [difflib](difflib库.md)
- [读取方法](读取方法.md)
- [Netmiko](Netmiko库.md)
- [NetDevOps](NetDevOps.md)
- [openpyxl append() 报错](<openpyxl_append()_报错但能运行.md>)

## 其他

- [链表](链表.md)（数据结构对照，也收在 [数据结构](../数据结构与算法/README.md)）
- [AI 编程](../agent/AI编程.md)（也收在 [AI](../agent/README.md)）

## 目录

<!-- INDEX:START -->
- [ThreadPoolExecutor（线程池执行器）](concurrent.futures模块.md) — 上次整理了一下多进程VS多线程的区别，运用到Python中大概就是如标题所示的…
- [CPython](CPython.md) — 日常说的「Python」几乎都是 CPython：用 C 写的官方解释器，运行…
- [关于](difflib库.md) — 比较两个由「行」组成的序列 a 和 b（通常是 readlines() 或 t…
- [IO密集型和CPU密集型](IO密集型和CPU密集型.md) — 定义：程序的运行速度主要是受限于CPU的处理能力
- [jinja2模板](jinja2模板.md) — jinja 是一个python流行的模板语言，仿照Django模板的语言，但其…
- [multiprocessing 模块](multiprocessing模块.md) — 标准库里真正「多个 Python 解释器一起跑」的模块。每个进程有自己的内存和…
- [NetDevOps](NetDevOps.md) — 用软件工程的方式做网络：配置不再只靠人手一台台敲，而是脚本、版本库、流水线去管…
- [Netmiko 网络自动化库](Netmiko库.md) — Netmiko 是一个基于 Paramiko 的 Python 库，用于简化网…
- [openpyxl append() 报错但能运行](openpyxl_append%28%29_报错但能运行.md) — 进行openpyxl库写入excel文件测试代码时：
- [pickle 序列化](pickle序列化.md) — 把 Python 对象变成一串字节，另一端再还原。multiprocessin…
- [range()函数](range%28%29函数.md) — range（）函数是一个 Python 内置的函数，用于生成整数序列，常用fo…
- [yield](yield.md) — yield 是 生成器 的关键字，出现在函数里之后，这个函数就变成「可暂停」的…
- [关于列表](关于列表.md) — 今天在学习concurrent.futures模块时用列表生成测试数据偶然发现：
- [列表推导式](列表推导式.md) — 所有的列表推导式，其实就是一个固定公式。只要把下面这个中文公式套进去，就全明白…
- [协程](协程.md) — 简单来说，就是把多线程 中所消耗的上下文切换 时间给减去了，增强效率。
- [多进程VS多线程](多进程VS多线程.md) — 操作系统 资源分配 的最小单位。就像独立的工厂，相互隔离，拥有独立内存空间。一…
- [引用计数](引用计数.md) — CPython 用引用计数判断对象能不能销毁：有一份引用就 +1，引用没了就…
- [所谓掌握](所谓掌握.md) — AI能写出逻辑，但它不一定理解底层运行的代价。要快速掌握一门语言，必须跳过语法…
- [正则表达式](正则表达式.md) — 正则表达式是用来描述和匹配一系列字符串模式的语法规则。简单说就是一套“搜索暗号…
- [生成器](生成器.md) — 生成器是一种惰性的迭代器：需要下一个值时才算，而不是一次性把整个序列造出来。函…
- [装饰器](装饰器.md) — 装饰器（Decorators）他们是修改其他函数的功能的函数，它以@func(…
- [用于 difflib.unified_diff 函数 的读取方法](读取方法.md) — 使用 readlines() 方法读取文件内容的好处主要体现在以下几点：
- [软件架构](软件架构.md) — 之前的脚本可能是一个文件写到底（几千行代码连着发请求、处理数据、存数据库）。现…
- [C++ 与 Python 链表底层内存心法](链表.md) — 链表就像一列火车，每个节点都是一节车厢。它的特点是内部数据类型不统一：既要装载…
- [闭包（Closure）](闭包.md) — 假设你要写一个函数，每次调用就+1，记录调了多少次：
- [面向对象编程(OOP)](面向对象编程%28OOP%29.md) — 面向对象编程（Object-Oriented Programming，简称 O…
<!-- INDEX:END -->
