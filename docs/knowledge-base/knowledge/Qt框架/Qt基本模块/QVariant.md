---
title: Qt中的`QVariant`
date: 2026-10-21
category:
- Qt框架
---
#  Qt中的`QVariant`
`QVariant` 可以把它想象成一个 **“通用数据容器”** 或 **“通配符类型”**，类似于 C++17 中的 `std::any`。另外`QVariant` 能够存储绝大多数 Qt 基础数据类型（如 `int`、`QString`、`QColor`）以及自定义类型，并能在不同类型之间进行安全地转换。

##  为什么需要它
在强类型语言 C++ 中，一个变量或容器通常只能存储固定类型。但在某些场景下，需要统一处理各种不确定的数据：
- **Qt 属性系统（QMetaProperty）：** 读取或设置对象的属性（如按钮的背景色、窗口的尺寸）。
    
- **模型/视图架构（QAbstractItemModel）：** `data()` 方法需要返回列表、表格中各种不同的数据（文字、图标、状态标志等）。
    
- **信号与槽 / 设置存储（QSettings）：** 读写配置文件时，配置文件中的值类型多样。

按理说也可以使用原生的STL，但有可能会和Qt中某些部分冲突，所以在Qt就使用`QVariant`吧。

##  用法

###  初始化
有三种初始化的方式：
```cpp
    QVariant test1;
    test1.setValue(3);

    QVariant test2(3);

    QVariant test3 = QVariant::fromValue(3);
```

###  使用
```cpp
#include <QVariant>
#include <QString>
#include <QDebug>

// 1. 存入数据
QVariant v1 = 42;               // 存储整型
QVariant v2 = "Hello Qt";       // 存储字符串
QVariant v3 = 3.14;             // 存储浮点型

// 2. 检查与转换类型
if (v1.canConvert<int>()) {
    int val = v1.toInt();       // 转为 int
    qDebug() << "v1 as int:" << val;
}

// 自动类型转换（例如将数字 Variant 直接转为 QString）
QString strFromDouble = v3.toString(); 
qDebug() << "v3 as string:" << strFromDouble; // 输出 "3.14"
```

通过写一个相加函数，来展示另外一种写法：
```cpp
QVariant MainWindow::UseFunc(QVariant a, QVariant b)
{
    QVariant res;
    if(a.typeId() == QMetaType::Int && b.typeId() == QMetaType::Int) //QVariant其实已经是旧的写法，新版为QMetaType
    {
        res = a.toInt() + b.toInt();
        return res;
    }
    return 0;
}
```

