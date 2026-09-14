---
title: 使用constexpt会报错
date: 2026-08-19
category:
  - 踩坑
tag:
  - C和C++
---
今天学习了一下C++11的特性，在进行constexpr的测试时发现了一个问题：**constexpr会报错：E0040：应输入标识符**。

代码如下（默认添加了头文件进行预处理）：
```cpp
void test1(const int a) {
	std::cout << "使用const修饰只读变量显示a的值而不需要改变:" << a;
	std::constexpr int v = 1;
	std::cout << "\n使用constexpr修饰常量:" << v;
}
```
经过搜索是因为： **`constexpr` 是 C++ 关键字，而不是 `std` 命名空间中的标识符**。
所以不应该加入std。
```cpp
void test1(const int a) {
	std::cout << "使用const修饰只读变量显示a的值而不需要改变:" << a;
	constexpr int v = 1;
	std::cout << "\n使用constexpr修饰常量:" << v;
}
```
正常
