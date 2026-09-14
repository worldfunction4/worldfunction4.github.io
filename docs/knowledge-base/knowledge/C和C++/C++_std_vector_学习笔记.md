---
title: C++ std::vector 学习笔记
date: 2026-08-19
category:
  - C和C++
---
# C++ std::vector 学习笔记

## 1. 概述

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

## 2. 初始化方式

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

## 3. 核心成员函数

### 3.1 元素访问

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

### 3.2 容量相关

```cpp
v.size();         // 当前元素数量
v.capacity();     // 已分配内存能容纳的元素数量
v.empty();        // 判断是否为空，等价于 v.size() == 0
v.reserve(100);   // 预分配容量，避免反复扩容
v.shrink_to_fit();// 释放多余的预留空间（非强制）
```

### 3.3 添加/删除

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

### 3.4 其他

```cpp
v1.swap(v2);        // 交换两个 vector（O(1)，只交换指针）
v.resize(5);        // 调整大小为 5（多则删，少则补默认值）
v.resize(5, 100);   // 多的用 100 填充
v.assign(3, 7);     // 重新赋值：3 个 7
```

---

## 4. 遍历方式

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

## 5. 扩容机制

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

## 6. 常见陷阱与最佳实践

### 6.1 迭代器失效

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

### 6.2 用 emplace_back 替代 push_back

```cpp
struct Point { int x, y; };

std::vector<Point> v;

v.push_back(Point{1, 2});  // 构造临时对象 → 拷贝/移动
v.emplace_back(1, 2);      // 直接在末尾构造，少一次拷贝
```

### 6.3 删除元素的正确姿势

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

### 6.4 `vector<bool>` — 别用！

`std::vector<bool>` 是**特化版本**，不存储真正的 bool，而是打包成位，导致：

- 不能返回 `bool&`，返回的是 proxy 对象
- 不符合标准容器的约定
- 建议用 `std::vector<char>` 或 `std::deque<bool>` 替代

---


## 7. 与其他容器的选择

| 需求 | 推荐容器 |
|------|----------|
| 随机访问 + 尾部操作 | `std::vector` |
| 头部/中间频繁插入删除 | `std::list` / `std::deque` |
| 稳定地址（不因插入失效） | `std::list` / `std::deque` |
| 固定大小 | `std::array` |
| 极大量 bool | `std::bitset` / `std::vector<char>` |

---

## 8. 实战练习

### 练习 1：去重并排序

```cpp
std::vector<int> removeDuplicates(std::vector<int>& v) {
    std::sort(v.begin(), v.end());
    auto last = std::unique(v.begin(), v.end());
    v.erase(last, v.end());
    return v;
}
```

### 练习 2：二维 vector

```cpp
int rows = 3, cols = 4;
std::vector<std::vector<int>> matrix(rows, std::vector<int>(cols, 0));

matrix[1][2] = 7;  // 访问第 2 行第 3 列
```

### 练习 3：作为缓冲区

```cpp
std::vector<char> buffer;
buffer.reserve(1024);  // 预分配 1KB

// 读取数据
buffer.resize(actualSize);
read(fd, buffer.data(), buffer.size());
```

---

## 9. 时间复杂度速查

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
