---
title: pickle 序列化
date: 2026-08-19
category:
- Python
---
# pickle 序列化

把 Python 对象变成一串字节，另一端再还原。`multiprocessing` 跨进程传参、返回值，走的就是它。

```python
import pickle

data = {"n": 1, "items": [1, 2, 3]}
blob = pickle.dumps(data)
obj = pickle.loads(blob)   # 拿回来的是新对象，值相同
```

写文件用 `pickle.dump(obj, f)` / `pickle.load(f)`。

容易踩的点：

- 能还原的前提是**对面也有这个类的定义**。自己写的类要在模块顶层。
- lambda、嵌套函数、带锁的对象、某些生成器，pickle 不了。`ProcessPoolExecutor` 报 `Can't pickle` 就是这个。
- pickle **不是**给不可信数据用的。`loads` 能触发恶意对象里的代码，别 unpickle 网上随手下的字节串。

<!-- more -->

相关：[multiprocessing模块](multiprocessing模块.md)、[concurrent.futures模块](concurrent.futures模块.md)
