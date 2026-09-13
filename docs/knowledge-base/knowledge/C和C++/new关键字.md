---
title: new 关键字（C++）
date: 2026-08-19
category:
  - 知识库
  - C和C++
---
# new 关键字（C++）

## 概述

`new` 是 C++ 中用于**动态内存分配**的关键字/运算符，它在堆（heap）上为对象分配内存，并调用构造函数完成初始化。

与 C 语言的 `malloc()` 相比，`new` 是 **类型安全** 的，且会自动调用构造函数，是 C++ 中推荐的内存分配方式。

---

## 基本语法

### 分配单个对象

```cpp
int* p = new int;           // 分配内存，但不初始化（值未定义）
int* p2 = new int();        // 分配内存，值初始化为 0
int* p3 = new int(42);      // 分配内存，初始化为 42
```

### 分配对象（调用构造函数）

```cpp
class MyClass {
public:
    MyClass(int a) : value(a) {}
    int value;
};

MyClass* obj = new MyClass(10);  // 分配内存 + 调用构造函数
```

### 分配数组

```cpp
int* arr = new int[10];          // 分配 10 个 int 的数组
int* arr2 = new int[5]{1, 2, 3, 4, 5};  // C++11 起支持列表初始化

MyClass* objs = new MyClass[3]{1, 2, 3}; // 对象数组
```

---

## delete — 配套的释放操作

使用 `new` 分配的内存必须用 `delete` 释放，否则会造成内存泄漏。

```cpp
// 单个对象
int* p = new int(42);
delete p;          // 调用析构函数 + 释放内存

// 数组
int* arr = new int[10];
delete[] arr;      // 注意使用 delete[]，不是 delete

// 对象数组
MyClass* objs = new MyClass[3];
delete[] objs;     // 对每个对象调用析构函数
```

### ⚠️ 重要规则

| 分配方式 | 释放方式 | 错误后果 |
|---------|---------|---------|
| `new` | `delete` | — |
| `new[]` | `delete[]` | — |
| `new` | `delete[]` | **未定义行为**（UB） |
| `new[]` | `delete` | **未定义行为**（UB） |

---

## new 与 malloc 的核心区别

| 对比项 | `new` | `malloc` |
|--------|-------|----------|
| 语言 | C++ 运算符 | C 标准库函数 |
| 类型安全 | ✅ 返回确切类型指针 | ❌ 返回 `void*`，需强转 |
| 构造函数 | ✅ 自动调用 | ❌ 不调用 |
| 析构函数 | ✅ `delete` 自动调用 | ❌ 需要手动清理 |
| 失败处理 | 抛出 `std::bad_alloc` 异常 | 返回 `NULL` |
| 重载 | ✅ 可被运算符重载 | ❌ 不可重载 |
| 大小计算 | 编译器自动计算 | 需手动 `sizeof` |
| 内存位置 | 自由存储区（free store） | 堆（heap） |

> **注**：C++ 标准中，new 分配的内存位于"自由存储区"（free store），而 malloc 分配的在"堆"（heap）。但大多数编译器中二者等价。

---

## new 的失败处理

### 方式一：异常处理（默认行为）

```cpp
try {
    int* p = new int[1000000000000];  // 可能失败
} catch (const std::bad_alloc& e) {
    std::cerr << "内存分配失败: " << e.what() << std::endl;
}
```

### 方式二：nothrow 版本（返回 nullptr）

```cpp
#include <new>

int* p = new (std::nothrow) int[1000000000000];
if (p == nullptr) {
    std::cerr << "内存分配失败" << std::endl;
} else {
    delete[] p;
}
```

---

## Placement new（定位 new）

在**已分配好的内存**上构造对象，不分配新内存。

```cpp
#include <new>  // 需要包含头文件

char buffer[sizeof(MyClass)];       // 栈上预留内存
MyClass* obj = new (buffer) MyClass(42);  // 在 buffer 上构造对象

// 需要手动调用析构函数（因为 placement new 不分配内存，不能用 delete）
obj->~MyClass();
```

### 适用场景

- 内存池（memory pool）
- 嵌入式系统
- 性能敏感场景（避免频繁分配/释放）
- 共享内存

---

## new 运算符的重载

C++ 允许类级别或全局级别的 `operator new` 重载，用于自定义内存分配策略。

### 类级别重载

```cpp
class MyClass {
public:
    // 重载 operator new
    static void* operator new(size_t size) {
        std::cout << "自定义分配 " << size << " 字节" << std::endl;
        return malloc(size);
    }

    // 重载 operator delete
    static void operator delete(void* ptr) {
        std::cout << "自定义释放" << std::endl;
        free(ptr);
    }
};
```

### 带额外参数的重载

```cpp
class MyClass {
public:
    static void* operator new(size_t size, int extra) {
        std::cout << "额外参数: " << extra << std::endl;
        return malloc(size);
    }
};

MyClass* obj = new (100) MyClass();  // 传递额外参数
```

---

## new 的执行流程

```
new MyClass(42)
    │
    ├── 调用 operator new(sizeof(MyClass))     ← 分配原始内存
    │       │
    │       └── 通常底层调用 malloc()
    │
    ├── 调用 MyClass::MyClass(42)             ← 构造函数
    │
    └── 返回类型安全的指针
```

```
delete obj
    │
    ├── 调用 obj->~MyClass()                  ← 析构函数
    │
    └── 调用 operator delete(ptr)             ← 释放内存
```

---

## 常见陷阱与最佳实践

### ❌ 陷阱 1：忘记 delete 导致内存泄漏

```cpp
void leak() {
    int* p = new int(42);
    // 没有 delete p → 内存泄漏
}
```

### ❌ 陷阱 2：delete 与 delete[] 混用

```cpp
int* arr = new int[10];
delete arr;  // 未定义行为！应使用 delete[] arr;
```

### ❌ 陷阱 3：二次释放（double delete）

```cpp
int* p = new int(42);
delete p;
delete p;  // 未定义行为！
```

### ❌ 陷阱 4：野指针（使用已释放的指针）

```cpp
int* p = new int(42);
delete p;
*p = 10;  // 未定义行为！已释放的内存
```

### ✅ 最佳实践：使用智能指针代替裸 new

```cpp
#include <memory>

// C++11 起推荐使用
std::unique_ptr<int> p1 = std::make_unique<int>(42);
std::shared_ptr<int> p2 = std::make_shared<int>(42);

// 无需手动 delete，智能指针自动管理生命周期
```

### ✅ 最佳实践：RAII 原则

```cpp
class ResourceWrapper {
    int* data;
public:
    ResourceWrapper() : data(new int[100]) {}
    ~ResourceWrapper() { delete[] data; }

    // 禁止拷贝或实现移动语义
    ResourceWrapper(const ResourceWrapper&) = delete;
    ResourceWrapper& operator=(const ResourceWrapper&) = delete;
};
```

---

## C++ 不同版本的演进

| 版本 | 相关特性 |
|------|---------|
| C++98 | 基本 `new`/`delete`，placement new |
| C++11 | 列表初始化 `new int[]{1,2,3}`，`std::make_unique`（C++14 正式加入） |
| C++14 | `std::make_unique` |
| C++17 | 对齐的 `new`（`std::align_val_t`） |
| C++20 | `std::make_shared` 支持数组 |

---

## 速查表

```cpp
// 基础
int* p   = new int;               // 单个对象（未初始化）
int* p2  = new int(10);           // 单个对象（初始化）
int* arr = new int[10];           // 数组
delete p;                         // 释放单个对象
delete[] arr;                     // 释放数组

// 异常安全
int* p3 = new (std::nothrow) int(42);
if (p3) { /* 使用 */ delete p3; }

// 定位 new
#include <new>
char buf[sizeof(int)];
int* p4 = new (buf) int(42);

// 智能指针（推荐）
auto p5 = std::make_unique<int>(42);
auto p6 = std::make_shared<int>(42);
```

> **核心原则**：尽可能避免裸 `new` 和 `delete`，优先使用智能指针和 RAII 机制。
