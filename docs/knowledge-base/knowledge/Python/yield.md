---
title: yield
date: 2026-08-19
category:
- Python
---
# yield

<!-- more -->

`yield` 是 [生成器](生成器.md) 的关键字，出现在函数里之后，这个函数就变成「可暂停」的：每次产出一个值，调用方要下一个时再往下跑。

```python
def count_from(n):
    while True:
        yield n
        n += 1

c = count_from(0)
next(c)  # 0
next(c)  # 1
```

`return` 在生成器里等于结束迭代（可以带一个值给 `StopIteration`）。相关：[生成器](生成器.md)、[协程](协程.md)
