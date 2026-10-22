---
title: initializer_list 初始化
date: 2026-10-21
category:
- C和C++
---
# initializer_list 初始化

## 背景

在 C++11 之前，初始化数组可以使用大括号，但初始化 STL 容器（如 `std::vector`）却非常繁琐：
```cpp
// C++98 时代
int arr[] = {1, 2, 3, 4, 5}; // 数组支持大括号

std::vector<int> v;          // vector 需要逐个添加
v.push_back(1);
v.push_back(2);
v.push_back(3);
```

而引入了`std::initializer_list`，任何自定义类或容器都可以像内置数组一样用大括号直接初始化：
```cpp
// C++11 及以后
std::vector<int> v = {1, 2, 3, 4, 5};
```

## 特性

- **轻量级** ：它内部通常只包含两个指针（分别指向底层的开始和结束位置），或者一个指针和一个长度，因此按值传递非常高效。
    
- **元素只读** ：内部元素始终是 `const` 的，你**不能修改** `std::initializer_list` 中的元素值。
    
- **底层存储** ：当使用 `{1, 2, 3}` 时，编译器会在只读内存中自动创建一个临时的只读数组，并让 `std::initializer_list` 指向它。

`std::initializer_list` 提供了三个常用的成员函数：
1. `.begin()` — 返回指向第一个元素的指针/迭代器
2. `.end()` — 返回指向最后一个元素下一位置的指针/迭代器
3. `.size()` — 返回元素个数

## 使用

需要包含头文件`<initializer_list>`：
```cpp
#include <iostream>
#include <initializer_list>

int sum(std::initializer_list<int> list)
{
	int total = 0;
	for (const auto& element : list)
	{
		total += element;
	}
	return total;
}

int main() {
	std::cout << "sum:" << sum({ 1,2,3,4,5 }) << "\n";
	return 0;
}
```
输出:
```
sum:15
```


