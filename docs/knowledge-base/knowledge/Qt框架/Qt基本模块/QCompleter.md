---
title: '`QCompleter`'
date: 2026-10-21
category:
- Qt框架
---
# `QCompleter`
可以理解成：给输入框加“自动补全 / 下拉建议”的工具
比如在搜索框输入内容的时候有可能会弹出候选项：
```
输入：a
下拉：
  admin
  aliyun-test
  account-01
```
使用时一般分为几个步骤：
- **创建补全数据集**（可以是一个字符串列表 `QStringList`，也可以是一个完整的 `QAbstractItemModel`）
- **实例化 `QCompleter`**，将数据集绑定给它
- **将 `QCompleter` 设置给输入控件**（如 `QLineEdit::setCompleter()`）
示例：
```cpp
#include <QLineEdit>
#include <QCompleter>
#include <QStringList>

// 1. 准备补全的数据集
QStringList wordList;
wordList << "Apple" << "Application" << "Banana" << "Cat" << "Dog";

// 2. 创建 QCompleter 对象
QCompleter *completer = new QCompleter(wordList, this);

// 3. 将补全器绑定到单行文本框
QLineEdit *lineEdit = new QLineEdit(this);
lineEdit->setCompleter(completer);
```

## 匹配模式
- `Qt::CaseSensitive`：**严格区分**大小写（如输入 `app` 匹配不到 `Apple`）。
- `Qt::CaseInsensitive`：**不区分**大小写（默认选项，输入 `app` 可以匹配到 `Apple` 和 `Application`）。
```cpp
completer->setCaseSensitivity(Qt::CaseInsensitive);
```

## 补全模式
- `QCompleter::PopupCompletion`（默认）：弹出一个下拉菜单显示匹配到的所有选项。
- `QCompleter::InlineCompletion`：不弹下拉框，而是把最匹配项的剩余部分直接追加到输入框中（高亮显示）。
- `QCompleter::UnfilteredPopupCompletion`：弹出所有可选项，但高亮当前最匹配的一项。
```cpp
completer->setCompletionMode(QCompleter::PopupCompletion);
```

## 过滤规则
默认情况下，`QCompleter` 匹配的是**前缀**。如果想实现包含匹配：
```cpp
// 只要包含输入的内容就提示（例如输入 "ca" 可以匹配 "Application"）
completer->setFilterMode(Qt::MatchContains);
```

## 关于`QCompleter::activated`

### 为什么要写 `QOverload<const QString&>::of(...)`

`QCompleter::activated` 有重载版本，类似：

```
activated(const QString &text)
activated(const QModelIndex &index)
```

也就是说，同名信号有多个版本。

编译器不知道你想连接哪个版本，所以要明确告诉它：

```
QOverload<const QString&>::of(&QCompleter::activated)
```
