---
title: 给函数体加`const`
date: 2026-10-21
category:
- C和C++
---
# 给函数体加`const`
```cpp
//拿到登录名列表
QStringList loginInfoNames()const;
//根据选择的登录名填充相应信息
bool loginInfoByName(const QString& name, LoginInfo* info)const;
```

为什么要给它们加`const`？这两个函数（获取名字列表、按名查找信息）的核心逻辑都只是**读取**类内部的数据，而**不会修改**对象本身的任何状态或成员变量，也就是说保证了两个因素：
- 保证安全性，只读承诺
- 允许`const`对象调用
第二个是什么意思？如果某个`ManDB`对象被声明了`const`，或者是通过`const`引用/指针传递，那这个对象也只能调用加了`const`的成员函数和变量
