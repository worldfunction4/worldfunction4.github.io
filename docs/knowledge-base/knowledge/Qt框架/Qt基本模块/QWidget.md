---
title: QWidget
date: 2026-10-21
category:
- Qt框架
---
# QWidget

是所有窗口类的基类，可以内嵌到其他窗口内部，也可以作为独立的窗口显示 ，也就是意味着所有的窗口类只要指定了父对象都能够实现内存资源的自动回收。

## 设置父对象
```cpp
QWidget::QWidget(QWidget *parent = nullptr, Qt::WindowFlags f = Qt::WindowFlags());

//公共成员函数
//给当前窗口设置父对象
void QWidget::setParent(QWidget *parent);
void QWidget::setParent(QWidget *parent, Qt::WindowFlags f);

//获取当前窗口的父对象，如果没有返回nullptr
QWidget *QWidget::parentWidget() const;
```

