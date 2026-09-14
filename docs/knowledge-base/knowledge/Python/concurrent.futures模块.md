---
title: ThreadPoolExecutor（线程池执行器）
date: 2026-08-19
category:
  - Python
---
上次整理了一下[多进程VS多线程](/knowledge-base/knowledge/Python/多进程VS多线程.md)的区别，运用到Python中大概就是如标题所示的模块

# ThreadPoolExecutor（线程池执行器）

**ThreadPoolExecutor** 是基于线程的异步执行器。它最适合处理 **I/O 密集型（I/O-bound）** 任务。一般情况下，Python是没办法使用多线程的，是因为[GIL（全局解释器锁）](/knowledge-base/knowledge/专业术语/GIL（全局解释器锁）.md)的存在。不过[ Python 3.13](/knowledge-base/knowledge/专业术语/GIL（全局解释器锁）.md#Python 3.13 的“无锁”实验 )似乎开始尝试去掉它了。

### 核心原理

它预先创建一组线程。当你提交任务时，任务会被放入队列，空闲的线程会从队列中取出任务并执行。

### 适用场景

- 网络请求（爬虫、API 调用）。
    
- 文件读写（虽然 Python 的 I/O 有 GIL，但线程在等待 I/O 时会释放 GIL）。
    
- 数据库操作。
### 关键参数：`max_workers`

- **默认值**：在 Python 3.8+ 中，默认为 `min(32, os.cpu_count() + 4)`。
    
- **配置建议**：由于 I/O 任务大部分时间在等待，`max_workers` 可以设置得比 CPU 核心数大得多。

```Python
from concurrent.futures import ThreadPoolExecutor

def fetch_data(url):
    # 模拟网络请求
    return f"Data from {url}"

urls = ["url1", "url2", "url3"]

with ThreadPoolExecutor(max_workers=5) as executor:
    # 这里的 map 是批量提交的快捷方式
    results = executor.map(fetch_data, urls)
```


# ProcessPoolExecutor（进程池执行器）

**ProcessPoolExecutor** 则是基于多进程的异步执行器。它通过利用多核 CPU 来实现真正的并行，最适合处理 **CPU 密集型（CPU-bound）** 任务。虽然它不受[GIL（全局解释器锁）](/knowledge-base/knowledge/专业术语/GIL（全局解释器锁）.md)的约束，但也不适合用来代替多线程的任务，因为这会浪费资源。

### 核心原理

它使用 [multiprocessing模块](/knowledge-base/knowledge/Python/multiprocessing模块.md)。每个进程都有自己独立的 Python 解释器和内存空间。

- **绕过 GIL**：因为每个进程有自己的 GIL，所以它能实现真正的多核并行。
    
- **序列化（Pickling）**：注意！因为进程间内存不共享，数据必须通过[pickle序列化](/knowledge-base/knowledge/Python/pickle序列化.md)后才能在进程间传递。如果函数或参数无法被 pickle，程序会报错。
    

### 适用场景

- 大规模数学计算。
    
- 图像或视频处理。
    
- 重型数据加密/解密。
    

### 关键参数：`max_workers`

- **默认值**：通常默认为机器的 CPU 核心数。
    
- **配置建议**：通常不要超过 CPU 核心数，否则进程间的上下文切换开销反而会降低性能。

```Python
from concurrent.futures import ProcessPoolExecutor

def compute_heavy_task(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__": # 进程池在 Windows 下必须放在此判断下
    with ProcessPoolExecutor() as executor:
        futures = [executor.submit(compute_heavy_task, 10**6) for _ in range(4)]
```

# as_completed（高效的结果获取器）

`as_completed(fs, timeout=None)` 是一个生成器，它接收一个 Future 列表，并在任务**完成时**（无论顺序）立即 [yield](/knowledge-base/knowledge/Python/yield.md) 出该 Future。

默认情况下，如果我们按顺序遍历 Future 列表并调用 `.result()`，如果第一个任务很慢，你会一直阻塞在那里，即使后面的任务都已经做好了。`as_completed` 解决了这个问题：**谁先跑完，就先处理谁。**
```Python
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def variable_task(n):
    time.sleep(n) # 休眠时间不同
    return f"任务经过{n}s完成"

with ThreadPoolExecutor() as executor:
    # 提交任务：5s 的任务先提交，1s 的任务后提交
    futures = [executor.submit(variable_task, n) for n in [5, 1, 3]]
    
    print("等待结果中...")
    for future in as_completed(futures):
        # 即使 5s 的任务先提交，这里也会先打印 1s 的任务结果
        print(future.result())
        
```

# 两个池执行器的对比

| **维度**     | **ThreadPoolExecutor** | **ProcessPoolExecutor** |
| ---------- | ---------------------- | ----------------------- |
| **并发机制**   | 多线程（单进程内）              | 多进程（多套解释器）              |
| **资源消耗**   | 较轻量，内存开销小              | 较重，每个进程都有独立内存           |
| **数据共享**   | 极其简单（直接共享内存变量）         | 困难（需要序列化/IPC 通信）        |
| **GIL 限制** | 受 GIL 限制，无法实现真正并行计算    | **不受 GIL 限制**，实现并行计算    |
| **缺点**     | CPU 计算过于密集             | 传递的数据量巨大（序列化开销大）        |
# Future 对象

- **`submit()`**：返回的是 `Future` 实例。它代表一个“未来”才会完成的操作。我们可以查询它的状态（running, done, cancelled），也可以手动获取结果或捕获异常。
    
- **`map()`**：在内部也创建了 `Future`，但它对用户**隐藏**了这些对象，直接通过迭代器返回最终结果。

# submit() 和 map()

- submit()：灵活的单任务投放
- map()：高效的批量处理
## submit()

`submit(fn, *args, kwargs)` 每次只提交**一个**任务，并立即返回一个 **Future 对象**。

### 特点：

- **非阻塞**：提交后立即返回，可以继续做别的事情。
    
- **高度灵活**：可以为不同的任务传递不同的参数，甚至提交完全不同的函数。
    
- **Future 对象**：返回的 Future 像是一个“取货凭证”，可以用它来检查任务是否完成、取消任务或获取结果。

```Python
from concurrent.futures import ThreadPoolExecutor
import time

def task(n):
    time.sleep(1) # 模拟函数的处理过程消耗的时间
    return n * 2 

with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交单个任务
    future1 = executor.submit(task, 10) # 参数说明：task可以看作处理方式，10算是处理的数据
    future2 = executor.submit(task, 20)
    
    # 在需要时获取结果（会阻塞直到任务完成）
    print(f"Result 1: {future1.result()}")
    print(f"Result 2: {future2.result()}")
```
## map()

`map(func, *iterables)` 类似于内置的 `map()` 函数，它将一个函数并行地映射到一个可迭代对象（如列表）的每个元素上。

### 特点：

- **简洁**：一行代码处理整个列表。
    
- **有序性**：返回的结果迭代器会**严格按照输入序列的顺序**产生结果，即使后面的任务先执行完，也会等你前面的任务。
    
- **直接返回结果**：它不返回 Future 对象，而是直接返回结果的迭代器。

```Python
from concurrent.futures import ThreadPoolExecutor

def task(n):
    return n * 2

nums = [1, 2, 3, 4, 5]

with ThreadPoolExecutor(max_workers=3) as executor:
    # 批量提交并获取结果迭代器
    results = executor.map(task, nums)
    
    for res in results:
        print(res)  # 顺序始终是 2, 4, 6, 8, 10
```

## 两者对比

| **特性**   | **submit()**                         | **map()**                  |
| -------- | ------------------------------------ | -------------------------- |
| **参数传递** | 非常灵活，支持各种参数和关键字参数                    | 仅支持从可迭代对象中获取参数             |
| **返回对象** | 返回单个 `Future` 对象                     | 返回一个结果迭代器                  |
| **结果顺序** | 取决于如何获取（配合 `as_completed` 可实现谁先完谁返回） | **严格保持**输入参数的原始顺序          |
| **异常处理** | 只有在调用 `future.result()` 时才会抛出异常      | 在迭代 `results` 过程中遇到错误会抛出异常 |
| **适用场景** | 复杂逻辑、不同任务、需要精细控制每个任务状态               | 简单的批处理、对一组数据执行相同的操作        |

# 参考链接

- [Python 官方文档：concurrent.futures](https://docs.python.org/zh-cn/3.14/library/concurrent.futures.html))