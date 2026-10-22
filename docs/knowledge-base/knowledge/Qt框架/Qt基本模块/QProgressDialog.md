---
title: 适用场景
date: 2026-10-21
category:
- Qt框架
---
是qt中的对话进度框，它能够**显示操作进度并允许用户取消操作**的标准对话框

#  适用场景
通常用于耗时较长的操作（如文件复制、网络下载、复杂数据处理），需要注意一些地方：
- 设置进度范围与当前值
- 在循环中处理事件循环（防止界面卡死）
- 检测用户是否点击了“取消”按钮

#  使用示例
```cpp
#include <QProgressDialog>
#include <QCoreApplication>
#include <QThread>

void startProcessing(QWidget* parent) {
    int totalSteps = 100;

    // 实例化对话框：标签文本、取消按钮文本、最小值、最大值、父窗口
    QProgressDialog progress("正在处理数据...", "取消", 0, totalSteps, parent);
    progress.setWindowModality(Qt::WindowModal); // 模态对话框，阻塞父窗口
    progress.setMinimumDuration(1000);           // 预期耗时超过1000毫秒才显示对话框，避免闪烁

    for (int i = 0; i <= totalSteps; ++i) {
        progress.setValue(i);

        // 检查用户是否点击了取消
        if (progress.wasCanceled()) {
            break;
        }

        // 模拟耗时任务
        QThread::msleep(50);

        // 关键：保持 UI 响应，及时更新进度条和接收取消事件
        QCoreApplication::processEvents();
    }

    progress.setValue(totalSteps);
}
```
或者直接使用定时器：
```cpp
#include <QProgressDialog>
#include <QTimer>
#include <QWidget>
#include <QDebug>

void startProcessingWithTimer(QWidget* parent) {
    int totalSteps = 100;

    // 1. 创建对话框（必须分配在堆上，或者作为成员变量，防止函数结束时析构）
    auto progress = new QProgressDialog("正在处理数据...", "取消", 0, totalSteps, parent);
    progress->setWindowModality(Qt::WindowModal);
    progress->setMinimumDuration(1000); // 预期耗时超过1000ms才显示
    progress->setAttribute(Qt::WA_DeleteOnClose); // 窗口关闭时自动释放内存

    // 用于记录当前进度的变量（用 std::make_shared 或值捕获保持状态）
    auto currentStep = std::make_shared<int>(0);

    // 2. 创建定时器
    auto timer = new QTimer(progress); // 父对象设为 progress，对话框关闭时定时器自动销毁

    // 3. 连接定时器信号
    QObject::connect(timer, &QTimer::timeout, progress, [progress, timer, currentStep, totalSteps]() {
        // 检查用户是否点击了取消
        if (progress->wasCanceled()) {
            timer->stop();
            qDebug() << "任务被用户取消";
            return;
        }

        // 推进进度
        (*currentStep)++;
        progress->setValue(*currentStep);

        // 判断是否完成
        if (*currentStep >= totalSteps) {
            timer->stop();
            qDebug() << "任务顺利完成";
        }
    });

    // 4. 监听取消按钮的信号（可选：点击取消时做清理工作）
    QObject::connect(progress, &QProgressDialog::canceled, [timer]() {
        timer->stop();
    });

    // 5. 启动定时器（例如每 50 毫秒触发一次，模拟单步耗时）
    timer->start(50);
}
```

两者对比：

|**方式**|**优点**|**缺点 / 适用场景**|
|---|---|---|
|**`for` 循环 + `processEvents()`**|代码直观，适合将原本的同步函数直接加入进度条展示。|若单次循环步进太长（如单步就耗时 1 秒），在单步内部 UI 仍会短暂冻结；依赖频繁调用 `processEvents()`。|
|**`QTimer` 拆分步骤**|完美融入 Qt 事件循环，UI 响应极度流畅，**不会引发二次事件递归**。|适合**能够拆分成很多微小步骤**的非阻塞任务（如定时轮询、逐帧渲染、分批数据处理）。|