---
title: call_once函数
date: 2026-10-21
category:
- C和C++
---
# call_once函数

在一些特定情况下某些函数只能在多线程环境下调用一次，比如：初始化一个对象，而且这个对象只能被初始化一次，就可以使用`std::call_once()`来保证在多线程的环境下只会被调用一次，当然在使用时需要一个`once_flag`来作为`call_once()`第一个传入参数，原型嘛：
```cpp
//<mutex>
template <class Callable, class... Args>
void call_once(std::once_flag& flag, Callable&& f, Args&&... args)
```

- flag：once_flag类型的对象，要保证这个对象能够被多个线程同时访问到
- f：回调函数，可以传递一个有名函数地址，也可以指定一个匿名函数
- args：作为实参传递给回调函数

