---
title: multiprocessing 模块
date: 2026-08-19
category:
- Python
---
# multiprocessing 模块

<!-- more -->

标准库里真正「多个 Python 解释器一起跑」的模块。每个进程有自己的内存和自己的 [GIL(全局解释器锁)](<../专业术语/GIL(全局解释器锁).md>)，所以 CPU 密集型可以吃到多核。概念对比见 [多进程VS多线程](多进程VS多线程.md)。

```python
from multiprocessing import Process, Pool

def nsq(x):
    return x * x

if __name__ == "__main__":          # Windows 下必须，否则会递归起进程
    with Pool(4) as pool:
        print(pool.map(nsq, [1, 2, 3, 4]))
```

进程之间不共享内存，参数和返回值都要 [pickle序列化](pickle序列化.md) 才能递过去。lambda、局部函数、未定义在导入模块顶层的可调用对象，经常 pickle 失败。

现在更常见的写法是 `concurrent.futures.ProcessPoolExecutor`，底层就是这套，接口和线程池统一，见 [concurrent.futures模块](concurrent.futures模块.md)。

适用：重计算。不适合海量短平快的 I/O（每进程内存贵，启动慢）。I/O 密集还是线程 / [协程](协程.md)。
