---
title: list容器
date: 2026-08-19
category:
  - C和C++
---
## 基本概念

`list` 是 C++ STL 中的**双向链表**容器，头文件为 `<list>`。

- **非连续存储**：元素在内存中不连续，每个元素是一个节点，包含数据域和指向前后节点的指针
- **双向遍历**：支持前向和后向迭代（`++` / `--`），但不支持随机访问（不能用 `[]` 或 `.at()`）
- **高效插入删除**：在任意位置插入或删除元素，只需调整指针，时间复杂度 **O(1)**
- **额外空间开销**：每个节点额外存储两个指针，比 `vector` 更耗内存

> 与 `vector` 的对比：`vector` 头尾快、中间慢；`list` 各处插入删除都快，但不能随机访问。

---

## 构造函数

与 `vector` 类似，`list` 也提供了多种构造方式：

```cpp
#include <iostream>
#include <list>
using namespace std;

void print_list(const list<int> &L) {
    for (list<int>::const_iterator it = L.begin(); it != L.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
}

int main() {
    // 默认构造 —— 空容器
    list<int> L1;
    for (int i = 0; i < 5; i++) {
        L1.push_back(i + 1);
    }
    print_list(L1);   // 1 2 3 4 5

    // 区间方式构造
    list<int> L2(L1.begin(), L1.end());
    print_list(L2);   // 1 2 3 4 5

    // 拷贝构造
    list<int> L3(L2);
    print_list(L3);   // 1 2 3 4 5

    // n 个 elem
    list<int> L4(5, 100);
    print_list(L4);   // 100 100 100 100 100

    return 0;
}
```

> ⚠️ 注意：`list` 的迭代器是**双向迭代器**（Bidirectional Iterator），不支持 `it += n` 或 `it1 < it2` 这种随机访问操作。

---

## 赋值操作

```cpp
list<int> L1;
for (int i = 0; i < 5; i++) L1.push_back(i + 1);

// operator= 重载
list<int> L2;
L2 = L1;

// assign 区间方式
list<int> L3;
L3.assign(L2.begin(), L2.end());

// assign n 个 elem
list<int> L4;
L4.assign(5, 100);
```

---

## 大小操作

```cpp
list<int> L;
cout << L.empty();      // 1（空）
L.push_back(1);
cout << L.size();       // 1
L.resize(5);            // 重新指定大小，变长则以默认值 0 填充
L.resize(10, 99);       // 重新指定大小，变长则以 99 填充
```

> ⚠️ `list` 没有 `capacity()` 方法，因为链表不存在"预分配容量"的概念。

---

## 插入和删除

这是 `list` 的核心优势所在——任意位置插入/删除都是 O(1)**（前提是已有指向该位置的迭代器）** 。

```cpp
void print_list(const list<int> &L) {
    for (list<int>::const_iterator it = L.begin(); it != L.end(); ++it)
        cout << *it << " ";
    cout << endl;
}

int main() {
    list<int> L;

    // 尾部/头部插入
    L.push_back(10);       // 10
    L.push_back(20);       // 10 20
    L.push_front(5);       // 5 10 20
    print_list(L);

    // 尾部/头部删除
    L.pop_back();          // 5 10
    L.pop_front();         // 10
    print_list(L);

    // insert 插入（在迭代器指向的位置之前插入）
    list<int>::iterator it = L.begin();
    L.insert(it, 999);     // 999 10
    print_list(L);

    // erase 删除
    it = L.begin();
    L.erase(it);           // 10
    print_list(L);

    // remove 按值删除所有匹配元素
    L.push_back(10);
    L.push_back(20);
    L.push_back(10);
    L.remove(10);          // 20（删除了所有值为 10 的节点）
    print_list(L);

    // clear 清空
    L.clear();
    cout << L.size();      // 0

    return 0;
}
```

### 常用插入/删除函数一览

| 方法 | 作用 |
|------|------|
| `push_back(elem)` | 尾部添加元素 |
| `pop_back()` | 删除尾部元素 |
| `push_front(elem)` | 头部添加元素 |
| `pop_front()` | 删除头部元素 |
| `insert(pos, elem)` | 在 pos 位置之前插入 elem |
| `erase(pos)` | 删除 pos 位置的元素 |
| `remove(elem)` | 删除所有值等于 elem 的元素 |
| `clear()` | 清空所有元素 |

---

## 数据存取

由于 `list` 底层是链表，**不支持随机访问**，只能通过迭代器或 `front()` / `back()` 访问首尾元素：

```cpp
list<int> L;
L.push_back(10);
L.push_back(20);
L.push_back(30);

cout << L.front();   // 10（第一个元素）
cout << L.back();    // 30（最后一个元素）

// ❌ 错误：list 不支持 [] 和 at()
// cout << L[1];      // 编译错误
// cout << L.at(1);   // 编译错误
```

> 💡 如果想要随机访问，请改用 `vector` 或 `deque`。

---

## 反转和排序

`list` 提供了自己的成员函数 `reverse()` 和 `sort()`，这是因为 `std::sort` 要求随机访问迭代器，而 `list` 不满足。

```cpp
#include <iostream>
#include <list>
using namespace std;

void print_list(const list<int> &L) {
    for (list<int>::const_iterator it = L.begin(); it != L.end(); ++it)
        cout << *it << " ";
    cout << endl;
}

// 自定义排序规则（从大到小）
bool my_compare(int a, int b) {
    return a > b;
}

int main() {
    list<int> L;
    L.push_back(30);
    L.push_back(10);
    L.push_back(50);
    L.push_back(40);
    L.push_back(20);
    print_list(L);   // 30 10 50 40 20

    // 反转
    L.reverse();
    print_list(L);   // 20 40 50 10 30

    // 默认升序排序
    L.sort();
    print_list(L);   // 10 20 30 40 50

    // 自定义降序排序
    L.sort(my_compare);
    print_list(L);   // 50 40 30 20 10

    return 0;
}
```

> ⚠️ 注意：不能使用 `std::sort(L.begin(), L.end())`，因为 `std::sort` 需要随机访问迭代器，而 `list` 只提供双向迭代器。必须使用 `L.sort()`。

---

## 常用其他操作

### splice —— 将另一个 list 的节点转移到当前 list

```cpp
list<int> L1 = {1, 2, 3};
list<int> L2 = {4, 5, 6};

// 将 L2 的所有节点转移到 L1 的末尾（L2 变为空）
L1.splice(L1.end(), L2);
// L1: 1 2 3 4 5 6
// L2: (空)
```

> `splice` 是 **O(1)** 的，它只是调整指针，不涉及拷贝。这是 `list` 特有的高效操作。

### unique —— 删除连续重复元素（只保留一个）

```cpp
list<int> L = {1, 1, 2, 2, 2, 3, 3, 1, 1};
L.unique();
// 结果: 1 2 3 1（只删除连续相邻的重复项）
```

> 💡 若要删除所有重复值，通常先 `sort()` 再 `unique()`。

### merge —— 合并两个已排序的 list

```cpp
list<int> L1 = {1, 3, 5};
list<int> L2 = {2, 4, 6};
L1.merge(L2);    // L1: 1 2 3 4 5 6，L2 变为空
```

> ⚠️ 两个 list 必须都是有序的（默认升序），否则行为未定义。

---

## 常见误区与注意事项

1. **`list` 没有随机访问**：不要试图用 `L[i]` 或 `L.at(i)` 访问元素，编译会报错。

2. **迭代器失效规则不同**：`list` 插入操作**不会使已有迭代器失效**；删除操作只会使被删除元素的迭代器失效，其他迭代器仍然有效。这与 `vector` 截然不同。

3. **`list` 的 `size()` 在 C++11 前可能是 O(n)**：C++11 之后标准要求 `size()` 必须是 O(1)，但在某些老旧实现中可能仍需要遍历。

4. **`remove()` 与 `erase()` 的区别**：`erase(pos)` 删除指定迭代器位置的元素（O(1)）；`remove(elem)` 遍历整个链表删除所有匹配值（O(n)）。

5. **`sort()` 是成员函数**：不要误用 `std::sort()`，`list` 只能用 `L.sort()`。

---

## 总结

| 特性 | `list` | `vector` |
|------|--------|----------|
| 底层结构 | 双向链表 | 动态数组 |
| 内存 | 非连续（节点分散） | 连续 |
| 随机访问 | ❌ 不支持 | ✅ O(1) |
| 头部插入/删除 | ✅ O(1) | ❌ O(n) |
| 中间插入/删除 | ✅ O(1)（已知迭代器） | ❌ O(n) |
| 尾部插入/删除 | ✅ O(1) | ✅ 均摊 O(1) |
| 额外内存 | 每个节点 2 个指针 | 少量预分配容量 |
| 迭代器类型 | 双向迭代器 | 随机访问迭代器 |
| 排序方式 | `L.sort()` 成员函数 | `std::sort()` |
