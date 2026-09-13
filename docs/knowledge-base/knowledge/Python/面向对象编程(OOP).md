---
title: 面向对象编程(OOP)
date: 2026-08-19
category:
  - 知识库
  - Python
---
面向对象编程（Object-Oriented Programming，简称 OOP），一种“组织代码的思维方式”。它会让大型项目更容易维护、更像“搭积木”。

听起来未免有点太生涩抽象，所以类比成网工要做的事情就是：
假设写一个网络巡检脚本。
```Python
device1_ip = "10.0.0.1"
device1_vendor = "Huawei"

device2_ip = "10.0.0.2"
device2_vendor = "Cisco"

```

如果设备变成 100 台：

```Pyhton
device57_ip
device57_vendor
device57_username
...

```
牛马都没这么累，所以人们就想到：

> “这些设备本质上都是一种东西。”  
> “能不能抽象成一个模板？”

于是 OOP 出现了。

## OOP核心概念

- 类（Class）
- 对象（Object）

## 类是什么

类 = 模板 / 图纸 / 类型

比如说：

```Python
class Doge:
	pass
```
这看起来就像：

- “狗”这个概念
- 一个制造狗的模板

## 对象是什么

对象 = 根据类创建出来的具体实例

又比如说：
```Python
class Dog:
    pass

dog1 = Dog()
dog2 = Dog()
```

现在：

- dog1 是一只具体的狗
- dog2 又是另一只具体的狗

它们都来自 Dog 这个模板。

## 属性

既然如此，那么对象里面的数据就叫做属性
再比如狗有：

- 名字
- 年龄
- 颜色

```Python
class Dog:
    pass

dog1 = Dog()

dog1.name = "旺财"
dog1.age = 3
```

```Python
print(dog1.name)
```
输出：
```Python
旺财
```

## 方法

方法 = 对象会做的事情

还是狗，会：

- 叫
- 跑
- 吃东西

```Python
class Dog:

    def bark(self):
        print("汪汪！")
```
```Python
# 使用
dog1 = Dog() # 进行实例化
dog1.bark()
```
输出：
```Python
汪汪！
```

## self 

我第一次见时很疑惑，后面是这么理解的：**self = “当前这个对象自己”**

再比如：
```Python
class Dog:

    def bark(self):
        print("你是狗")
        

dog1 = Dog()
dog1.brak()
```
当进行`dog1.bark()`时，Python会变成：`Dog.bark(dog1)`，self 就是 dog1

## 标准写法

```Python
dog1.name = "旺财"
```
每次写都太麻烦，所以提供的初始化方法:

```Python
class Dog:

    def __init__(self, name, age):
        self.name = name
        self.age = age
```
创建对象并打印：
```Python
dog1 = Dog("旺财", 3)
dog2 = Dog("小黑", 5)
print(dog1.name)
print(dog2.name)
```
输出：
```Python
旺财
小黑
```

## OOP 四大特性
面试会问。

| 特性                  | 作用          |
| ------------------- | ----------- |
| 封装                  | 把数据和功能包装在一起 |
| [继承](/knowledge-base/knowledge/Python/面向对象编程(OOP).md#继承) | 子类复用父类代码    |
| 多态                  | 同一种调用产生不同效果 |
| 抽象                  | 提取共性        |

### 继承

- 华为设备
- Cisco 设备

都有：

- IP
- connect()

那就没必要重复写，此时采用**继承**
**父类**：
```Python
class NetworkDevice:

    def connect(self):
        print("设备连接中...")
```
**子类**：
```Python
class HuaweiDevice(NetworkDevice):
    pass
```
那怎么使用？
```Python
h1 = HuaweiDevice()

h1.connect() # 这个 connect 是父类的
```


