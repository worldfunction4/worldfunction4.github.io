---
title: 概述
date: 2026-10-21
category:
- Qt框架
---
#  概述
这个类是用来在指定的时间间隔后触发特定操作（比如每隔一秒更新一次界面上的时间，或者延迟三秒来执行某个任务）

##  使用方法
1. 创建对象
	```cpp
	QTimer *timer = new QTimer(this);
	```
2. 设置时间间隔
```cpp
timer -> setInterval(1000);
```
3. 绑定信号与槽
```text
将定时器的timeout()信号连接到自定义处理函数上
```
3. 启动定时器
```cpp
timer -> start();
```

如果现在需要一个定时器：每隔0.5s触发一次。应该使用`setInerval(500)`，设定的这个时间到了以后就会发射一个`timeout()`信号。所以此时就需要进行`connect`函数进行连接：
```cpp
// 假设在类成员函数
connect(timer, &QTimer::timeout, this, &Widget::onTimeout);
```

- `timer`：发送者
- `&QTimer::timeout`：发送的信号
- `this`：接收者
- `&Widget::onTimeout`：被调用的槽函数


