---
title: muduo网络库
date: 2026-10-21
category:
- C和C++
---
# muduo网络库

[开源地址](https://github.com/chenshuo/muduo)

Muduo 是一个基于 C++11 开发的高性能事件驱动网络库，专为编写高并发 TCP 服务器而设计。它采用了现代 C++ 的设计理念和技术，结合了高效的事件驱动机制、多线程编程以及零拷贝技术，使得开发者能够轻松构建出高性能、可扩展的网络应用。

## 核心类

### TcpServer

它作为服务器的核心类，负责管理整个服务器的运行，包括监听新连接，创建和管理TcpConnection对象，以及调度各种回调函数，

### EventLoop