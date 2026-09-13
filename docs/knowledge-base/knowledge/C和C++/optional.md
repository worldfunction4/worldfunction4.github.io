---
title: optional
date: 2026-09-14
category:
  - 知识库
  - C和C++
---
`std::optional<T>`是c++17引入的“包裹类型”，用来表示一个值**可能存在（包含类型 `T` 的数据），也可能为空（不包含任何值）**。

头文件: `<optional>`

它的基本用法可以分为四个操作：

- **创建包含值的变量**：`std::optional<int> opt = 42;` 
    
- **创建空的变量**：`std::optional<int> opt = std::nullopt;` 
    
- **检查是否有值**：`if (opt)` （有值时表达式为 `true`，为空时为 `false`） 
    
- **提取内部的值**：`*opt` （像解引用指针一样获取真实的数据） 


