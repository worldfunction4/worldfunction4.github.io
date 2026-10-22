---
title: vector 容器
date: 2026-08-19
order: 2
category:
- C和C++
tag:
- cpp
- stl
redirectFrom:
- /knowledge-base/knowledge/C和C__/STL/C___std_vector_学习笔记.html
---
# vector 容器

`std::vector` 是 C++ 标准库里最常用的**动态数组**，头文件 `<vector>`。数据结构和数组很像，也叫**单端数组**：只能高效地在尾部增删。

和普通数组的差别：数组是静态空间，vector 可以**动态扩展**。扩展不是在原空间后面续接，而是另找一块更大的内存，把原数据拷过去，再释放旧空间。

- **连续内存**：支持 O(1) 随机访问
- **自动扩容**：尾部插入/删除均摊 O(1)
- **值语义**：存的是元素本身，不是指针

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    std::cout << v[0] << "\n";      // 1
    std::cout << v.size() << "\n";  // 5
}
```

<!-- more -->

相关：[STL](STL.md)、[迭代器](迭代器.md)、[迭代器失效规则](迭代器失效规则.md)、[list容器](list容器.md)

## 初始化 / 构造

```cpp
std::vector<int> v1;                         // 空
std::vector<int> v2(10);                     // 10 个 0
std::vector<int> v3(10, 7);                  // 10 个 7
std::vector<int> v4 = {1, 2, 3};             // 初始化列表（C++11）
std::vector<int> v5(v4);                     // 拷贝构造
std::vector<int> v6(std::move(v4));          // 移动构造（v4 变空）
std::vector<int> v7(v5.begin(), v5.end());   // 迭代器区间
```

## 踩过的坑：const 对象不能用普通 iterator

自己写打印函数时踩过：

```cpp
void print_vector(const vector<int> &v) {
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
        cout << *it;
    }
}
```

- 参数是 `const vector<int> &`，只读。
- const 对象上 `v.begin()` 返回的是 `const_iterator`，不是普通 `iterator`。
- 写成 `vector<int>::iterator` 会类型不匹配，编译失败。

三种改法：

```cpp
// 1. C++98/03：显式 const_iterator
void print_vector(const vector<int> &v) {
    for (vector<int>::const_iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " ";
    }
}

// 2. C++11：auto + cbegin/cend
void print_vector(const vector<int> &v) {
    for (auto it = v.cbegin(); it != v.cend(); ++it) {
        cout << *it << " ";
    }
}

// 3. 范围 for（最简洁）
void print_vector(const vector<int> &v) {
    for (int x : v) {
        cout << x << " ";
    }
}
```

当时还没学现代 C++，用的是第一种。

## 赋值

- `vector& operator=(const vector &vec)` 重载等号
- `assign(beg, end)` 把 `[beg, end)` 拷给自己
- `assign(n, elem)` 填 n 个 elem

（容易把 `assign` 写成 `assgin`，拼错编译器直接找不到这个函数。）

```cpp
vector<int> v1;
v1 = v;                          // operator=
vector<int> v2;
v2.assign(v1.begin(), v1.end()); // 区间
vector<int> v3;
v3.assign(10, 100);              // n 个 elem
```

## 容量和大小

| 方法 | 说明 |
|------|------|
| `empty()` | 是否为空 |
| `size()` | 已有元素个数 |
| `capacity()` | 已分配空间能装多少个 |
| `reserve(n)` | 预分配，避免反复扩容 |
| `shrink_to_fit()` | 请求释放多余空间（非强制） |
| `resize(n)` | 改长度为 n，变长补默认值，变短删尾部 |
| `resize(n, elem)` | 变长时用 elem 填充 |

扩容按**指数**增长（常见 2 倍或 1.5 倍），不是每次 `push_back` 都重新分配。提前 `reserve(n)` 能少很多次拷贝。

## 元素访问

| 方法 | 说明 | 越界 |
|------|------|------|
| `v[i]` | 下标 | **不检查**，越界是未定义行为 |
| `v.at(i)` | 安全访问 | 抛 `std::out_of_range` |
| `v.front()` / `v.back()` | 首 / 尾 | 空容器是未定义行为 |
| `v.data()` | 底层数组指针 | — |

## 添加 / 删除

```cpp
v.push_back(1);          // 尾部插入（拷贝），均摊 O(1)
v.emplace_back(2);       // 尾部原地构造，少一次临时对象
v.pop_back();            // 删尾

v.insert(v.begin(), 10);              // 任意位置，O(n)
v.erase(v.begin());                   // 任意位置，O(n)
v.clear();                            // 清空元素，capacity 不变
v1.swap(v2);                          // O(1)，只换指针
```

`emplace_back` 比 `push_back` 少构造一次临时对象：

```cpp
struct Point { int x, y; };
std::vector<Point> v;
v.push_back(Point{1, 2});  // 先临时对象，再拷/移
v.emplace_back(1, 2);      // 直接在末尾构造
```

## 遍历

```cpp
for (size_t i = 0; i < v.size(); ++i) std::cout << v[i] << " ";
for (int x : v) std::cout << x << " ";
for (int& x : v) x *= 2;                 // 要改元素
for (const int& x : v) std::cout << x;   // 只读
for (auto it = v.begin(); it != v.end(); ++it) std::cout << *it;
```

## 迭代器失效

插入可能导致扩容，扩容后**所有**迭代器失效。详细规则在 [迭代器失效规则](迭代器失效规则.md)。

```cpp
std::vector<int> v = {1, 2, 3};
auto it = v.begin();
v.push_back(4);   // 可能扩容，it 失效
std::cout << *it; // 未定义行为
```

边遍历边删不要直接 `erase(it)` 再 `++it`，会跳元素：

```cpp
for (auto it = v.begin(); it != v.end(); ) {
    if (*it % 2 == 0) it = v.erase(it);  // erase 返回下一个有效迭代器
    else ++it;
}
```

## `vector<bool>` 别用

这是特化版本，不存真正的 `bool`，而是打包成位。返回的不是 `bool&`，是代理对象，很多容器约定它都不满足。要用就 `vector<char>` 或 `deque<bool>`。

## 和其他容器怎么选

| 需求 | 更合适的 |
|------|----------|
| 随机访问 + 尾部操作 | `vector` |
| 头部/中间频繁插入删除 | `list` / `deque` |
| 插入后地址要稳定 | `list` / `deque` |
| 固定大小 | `array` |

## 时间复杂度

| 操作 | 复杂度 |
|------|--------|
| `[]` / `at` / `front` / `back` | O(1) |
| `push_back` / `emplace_back` | 均摊 O(1) |
| `pop_back` | O(1) |
| `insert` / `erase` / `resize` | O(n) |
| `swap` | O(1) |

[cppreference - std::vector](https://en.cppreference.com/w/cpp/container/vector)

## 附：旧版笔记（从博客恢复，待整理）

### 旧版 vector容器（构造、打印、赋值等）

#### 基本概念

vector数据结构和数组非常类似，也称为**单端数组**
那么它与普通数据有什么不同呢？数组是静态空间，而vector可以进行**动态扩展**
动态扩展也不是在原空间后面续接新空间，而是找更大内存空间，然后将原数据拷贝到新空间，然后释放原空间



#### 构造函数

在进行构造时有以下的方法：
```cpp
# include <iostream>
# include <vector>
using namespace std;
void print_vector(const vector<int> &v) {
	for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
		cout << *it;
	}
}
int main() {
	vector<int>v;

	for (int i = 0; i < 10; i++) {
		v.push_back(i + 1);
	}
	//拷贝构造
	vector<int>v1(v);
	//区间方式
	vector<int>v2(v.begin(), v.end());
	//第三种
	vector<int>v3(10, 100);

	return 0;
}
```
但是在自己写函数来统一打印时print_vector()函数有一个错误：

-  函数参数 `const vector<int> &v` 表明 `v` 是只读的。
    
- 在 C++ 中，对于 const 对象，`v.begin()` 返回的是 `const_iterator`，而不是普通的 `iterator`。
    
- 写的 `vector<int>::iterator` 是非 const 迭代器，类型不匹配，编译器会报错。

那么解决方法有以下几种修改方式：

##### 1. 使用 `const_iterator`（C++98/03 风格）


```cpp

void print_vector(const vector<int> &v) {
    for (vector<int>::const_iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " "; 
    }
}
```

##### 2. 使用 `auto` + `cbegin()/cend()`（C++11 推荐）


```cpp

void print_vector(const vector<int> &v) {
    for (auto it = v.cbegin(); it != v.cend(); ++it) {
        cout << *it << " ";
    }
}
```
##### 3. 使用基于范围的 for 循环（最简洁，C++11）

```cpp

void print_vector(const vector<int> &v) {
    for (int x : v) {
        cout << x << " ";
    }
}
```

最终考虑到自己还未开始学习现代c++的知识，选择老办法：
```cpp
# include <iostream>
# include <vector>
using namespace std;

void print_vector(const vector<int> &v) {
    for (vector<int>::const_iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " ";
    }
}
int main() {
	vector<int>v;

	for (int i = 0; i < 10; i++) {
		v.push_back(i + 1);
	}
	//拷贝构造
	vector<int>v1(v);
	print_vector(v1);
	cout << endl;
	//区间方式
	vector<int>v2(v.begin(), v.end());
	print_vector(v2);
	cout << endl;
	//第三种
	vector<int>v3(10, 100);
	print_vector(v3);

	return 0;
}
```
#### 赋值操作

- `vector& operator=(const vector &vec) //重载等号操作符`
- `assgin(beg, end);  //将[beg, end]区间中数据拷贝赋值给本身`
- `assgin(n, elem); //将n个elem拷贝赋值给本身`

也就是有以下的赋值方式(示例)：
```cpp
#include <iostream>
#include<vector>
using namespace std;
void print_vector(const vector<int> &v) {
	for (vector<int>::const_iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << " ";
	}
}

int main() {
	vector<int>v;
	for (int i = 0; i < 10; i++) {
		v.push_back(i);
	}
	print_vector(v);
	cout << endl;

	// 赋值 进行了operator=
	vector<int>v1;
	v1 = v;
	print_vector(v1);
	cout << endl;

	// assign
	vector<int>v2;
	v2.assign(v1.begin(), v1.end());
	print_vector(v2);
	cout << endl;


	// 使用n个elem方式来进行赋值
	vector<int>v3;
	v3.assign(10, 100);

	return 0;
}
```

#### vector容量和大小

- `empty(); //判断容器是否为空`
- `capacity(); //容器的容量`
- `size(); //返回容器中元素的个数`
- `resize(int num); //重新指定容器的长度为num，如果变长：以默认值填充新位置。如果变短：末尾超出容器长度的元素被删除`
- `resize(int num, elem); //重新指定容器的长度为num，如果变长：以elem填充新位置。如果变短：末尾超出容器长度的元素被删除`
```cpp
# include <iostream>
# include <vector>
using namespace std;

// 赋值操作函数
void set_vector(vector<int>& v) {

	if (v.empty()) {
		for (int i = 0; i < 10; i++) {
			v.push_back(i);
		}
	}
	else {
		cout << "容器不是空的" << endl;
		cout << "容器的容量为：" << v.capacity() << endl;
	}
}

void show_vector(const vector<int> &v) {
	for (vector<int>::const_iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << endl;
	}
}

int main() {
	vector<int>v;
	set_vector(v);
	show_vector(v);

	vector<int>v1(v);
	set_vector(v1);
	show_vector(v1);

	return 0;
}
```

### 旧版 C++ std::vector 学习笔记

#### 1. 概述

`std::vector` 是 C++ 标准库中最常用的**动态数组**容器，定义在头文件 `<vector>` 中。

- **连续内存**：元素在内存中连续存储，支持 O(1) 随机访问
- **自动扩容**：尾部插入/删除均摊 O(1)，自动管理内存
- **值语义**：存储元素本身（而非指针），支持拷贝、移动

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {1, 2, 3, 4, 5};
    std::cout << v[0] << std::endl;  // 1
    std::cout << v.size() << std::endl;  // 5
}
```

---

#### 2. 初始化方式

```cpp
std::vector<int> v1;                    // 空容器
std::vector<int> v2(10);               // 10 个元素，值都为 0
std::vector<int> v3(10, 7);            // 10 个元素，值都为 7
std::vector<int> v4 = {1, 2, 3};       // 初始化列表（C++11）
std::vector<int> v5(v4);               // 拷贝构造
std::vector<int> v6(std::move(v4));    // 移动构造（v4 变为空）
std::vector<int> v7(v5.begin(), v5.end()); // 迭代器范围构造
```

---

#### 3. 核心成员函数

##### 3.1 元素访问

| 方法 | 说明 | 越界行为 |
|------|------|----------|
| `v[i]` | 下标访问 | **不检查**，越界为未定义行为 |
| `v.at(i)` | 安全访问 | 抛出 `std::out_of_range` |
| `v.front()` | 第一个元素 | 空容器为未定义行为 |
| `v.back()` | 最后一个元素 | 空容器为未定义行为 |
| `v.data()` | 返回底层数组指针 | — |

```cpp
std::vector<int> v = {10, 20, 30};
v.front();  // 10
v.back();   // 30
v.data();   // int* 指向 10 的地址
```

##### 3.2 容量相关

```cpp
v.size();         // 当前元素数量
v.capacity();     // 已分配内存能容纳的元素数量
v.empty();        // 判断是否为空，等价于 v.size() == 0
v.reserve(100);   // 预分配容量，避免反复扩容
v.shrink_to_fit();// 释放多余的预留空间（非强制）
```

##### 3.3 添加/删除

```cpp
std::vector<int> v;

// 尾部操作（高效，均摊 O(1)）
v.push_back(1);         // 尾部插入（拷贝）
v.emplace_back(2);      // 尾部原地构造（更高效，C++11）
v.pop_back();           // 删除尾部元素

// 任意位置操作（O(n)，需要移动后续元素）
v.insert(v.begin(), 10);           // 在指定位置插入
v.insert(v.begin() + 1, 3, 5);    // 插入 3 个 5
v.emplace(v.begin(), 42);          // 原地构造（C++11）
v.erase(v.begin());                // 删除指定位置元素
v.erase(v.begin(), v.begin() + 2); // 删除区间

// 清空
v.clear();  // 清空所有元素，但 capacity 不变
```

##### 3.4 其他

```cpp
v1.swap(v2);        // 交换两个 vector（O(1)，只交换指针）
v.resize(5);        // 调整大小为 5（多则删，少则补默认值）
v.resize(5, 100);   // 多的用 100 填充
v.assign(3, 7);     // 重新赋值：3 个 7
```

---

#### 4. 遍历方式

```cpp
std::vector<int> v = {1, 2, 3, 4, 5};

// 传统 for
for (size_t i = 0; i < v.size(); ++i)
    std::cout << v[i] << " ";

// 范围 for（C++11）
for (int x : v)
    std::cout << x << " ";

// 引用修改
for (int& x : v)
    x *= 2;

// 只读引用
for (const int& x : v)
    std::cout << x << " ";

// 迭代器
for (auto it = v.begin(); it != v.end(); ++it)
    std::cout << *it << " ";
```

---

#### 5. 扩容机制

`std::vector` 按**指数**扩容（通常 1.5 倍或 2 倍），不是每次 push_back 都重新分配。

```cpp
std::vector<int> v;
std::cout << v.capacity() << "\n";  // 0
v.push_back(1);
std::cout << v.capacity() << "\n";  // 1
v.push_back(2);
std::cout << v.capacity() << "\n";  // 2
v.push_back(3);
std::cout << v.capacity() << "\n";  // 4（GCC）或 3（MSVC, 1.5 倍）
```

**关键结论**：
- `size()` = 已存储元素个数
- `capacity()` = 已分配空间可容纳的个数
- 提前 `reserve(n)` 可以避免反复扩容的开销

---

#### 6. 常见陷阱与最佳实践

##### 6.1 迭代器失效

```cpp
// ❌ 危险：插入可能导致扩容，迭代器失效
std::vector<int> v = {1, 2, 3};
auto it = v.begin();
v.push_back(4);  // 可能触发扩容，it 失效！
std::cout << *it; // 未定义行为

// ✅ 正确：重新获取迭代器
v.push_back(4);
auto it2 = v.begin();
```

**插入/删除会导致迭代器失效的场景**：
- `push_back` / `emplace_back`：若触发扩容，**所有**迭代器失效；若不扩容，则不影响已有迭代器
- `insert`：从插入位置**之后**的所有迭代器失效（插入点之前的保持有效）
- `erase`：被删元素及其**之后**的所有迭代器失效

> 📄 详细规则参考：[迭代器失效规则](迭代器失效规则.md)

##### 6.2 用 emplace_back 替代 push_back

```cpp
struct Point { int x, y; };

std::vector<Point> v;

v.push_back(Point{1, 2});  // 构造临时对象 → 拷贝/移动
v.emplace_back(1, 2);      // 直接在末尾构造，少一次拷贝
```

##### 6.3 删除元素的正确姿势

```cpp
// ❌ 直接遍历删除会跳过元素
std::vector<int> v = {1, 2, 3, 4, 5};
for (auto it = v.begin(); it != v.end(); ++it) {
    if (*it % 2 == 0) v.erase(it);  // 错误！
}

// ✅ 方法1：erase 返回下一个有效迭代器
for (auto it = v.begin(); it != v.end(); ) {
    if (*it % 2 == 0)
        it = v.erase(it);
    else
        ++it;
}

// ✅ 方法2：erase-remove 惯用法（C++20 之前）
v.erase(std::remove_if(v.begin(), v.end(), 
    [](int x) { return x % 2 == 0; }), v.end());

// ✅ 方法3：C++20 std::erase_if
std::erase_if(v, [](int x) { return x % 2 == 0; });
```

##### 6.4 `vector<bool>` — 别用！

`std::vector<bool>` 是**特化版本**，不存储真正的 bool，而是打包成位，导致：

- 不能返回 `bool&`，返回的是 proxy 对象
- 不符合标准容器的约定
- 建议用 `std::vector<char>` 或 `std::deque<bool>` 替代

---


#### 7. 与其他容器的选择

| 需求 | 推荐容器 |
|------|----------|
| 随机访问 + 尾部操作 | `std::vector` |
| 头部/中间频繁插入删除 | `std::list` / `std::deque` |
| 稳定地址（不因插入失效） | `std::list` / `std::deque` |
| 固定大小 | `std::array` |
| 极大量 bool | `std::bitset` / `std::vector<char>` |

---

#### 8. 实战练习

##### 练习 1：去重并排序

```cpp
std::vector<int> removeDuplicates(std::vector<int>& v) {
    std::sort(v.begin(), v.end());
    auto last = std::unique(v.begin(), v.end());
    v.erase(last, v.end());
    return v;
}
```

##### 练习 2：二维 vector

```cpp
int rows = 3, cols = 4;
std::vector<std::vector<int>> matrix(rows, std::vector<int>(cols, 0));

matrix[1][2] = 7;  // 访问第 2 行第 3 列
```

##### 练习 3：作为缓冲区

```cpp
std::vector<char> buffer;
buffer.reserve(1024);  // 预分配 1KB

// 读取数据
buffer.resize(actualSize);
read(fd, buffer.data(), buffer.size());
```

---

#### 9. 时间复杂度速查

| 操作 | 复杂度 |
|------|--------|
| `operator[]`, `at`, `front`, `back` | O(1) |
| `push_back`, `emplace_back` | 均摊 O(1) |
| `pop_back` | O(1) |
| `insert`, `emplace` | O(n) |
| `erase` | O(n) |
| `resize` | O(n) |
| `clear` | O(n) |
| `swap` | O(1) |
| `sort` | O(n log n) |

---

> **推荐资源**：[cppreference - std::vector](https://en.cppreference.com/w/cpp/container/vector)
