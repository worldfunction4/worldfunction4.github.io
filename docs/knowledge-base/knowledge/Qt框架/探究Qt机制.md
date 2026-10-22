---
title: 探究Qt机制
date: 2026-10-21
category:
- Qt框架
---
# 探究Qt机制

众所周知Qt的机制特别强大以及特别——**父子对象树**，在Qt中，父控件负责管理子控件的生命周期，当父控件被销毁时，它会自动帮我们释放所有子控件占用的内存。

为了理解这个规则，假如有这么一段代码：
在代码中创建一个窗口`parentWin`，创建一个按钮`button`并把`parentWind`作为它的父对象：
```cpp
QWidget* parentWin = new QWidget(); //创建主窗口

QPushButton* button = new QPushButton("点击", parentWin)
```

程序关闭并销毁`parentWin`时，还需要手动调用`delete button`来释放按钮内存吗？答案是不需要，这就是Qt的对象树机制起了作用：**只要指定了父对象，那么父对象在销毁时就会自动帮我们释放所有子对象，有效防止内存泄漏。**

## 代码
<!-- more -->

现在通过[QWidget](Qt基本模块/QWidget.md)创建一个窗口并在里面安放一个按钮：
```cpp
#include <QApplication>
#include <QWidget>
#inlcude <QPushButton>

int main(int argc, char* argv[])
{
	//初始化应用程序对象
	QApplication app(argc, argv);
	
	//创建主窗口
	QWidget w;
	w.setWindowTitle("HelloQt");
	w.resiez(400, 300);//设置窗口大小400x300
	
	QPsuhButton button("点击我", &w);
	button.setGeometry(50, 100, 80, 30); //设置按钮位置和尺寸
	w.show();
	return w.exec();
}
```

其中返回值位`w.exec()`是为了实现**事件循环**，没有它`main`函数执行完`w.show()`后就会立即返回，当然，它在其他模块也可以作为阻塞程序使用。

然后就有一些问题：
### 为什么直接使用`QPushButton button`？

在我们的 `main` 函数里，`window` 和 `button` 都是定义在 `main()` 的作用域内的**局部变量（栈对象）**。只要 `main()` 函数没结束，它们就会一直保存在内存中。因为 `app.exec()` 阻塞了 `main()` 的结束，所以按钮能正常显示。


### 22.为什么更推荐使用`new`？

在其他模块中一般都是：
```cpp
QPushButton* button = new QPushButton;
```
如果在自定义的窗口类中将子控件定义为局部变量，会出现大问题：
```cpp
void MyWindow::createButton() {
    QPushButton button("点击我", this); // 栈对象：函数结束时，button 会被立即自动销毁
}
```
当`createButton()` 函数执行完毕后，`button` 就会**立刻被系统回收**，界面上根本看不到这个按钮。
所以使用`new`动态分配对象：
```cpp
void MyWindow::createButton() {
    QPushButton *button = new QPushButton("点击我", this); // 堆对象：不会随函数结束而销毁
}
```
