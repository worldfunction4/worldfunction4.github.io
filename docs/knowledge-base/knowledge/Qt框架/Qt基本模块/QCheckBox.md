---
title: 介绍
date: 2026-10-21
category:
- Qt框架
---
#  介绍
`QCheckBox`是一个复选框，用来选择“开/关”或者“二选一/三选一”状态的核心控件。

它的功能有两个：
- **获取或设置选中状态**：使用`isChecked()`查询，使用`setChecked(bool)`设置。
- **监听状态变化**：当用户点击改变状态时，触发`toggled(bool)`信号。

#  示例
```cpp
#include <QCheckBox>
#include <QDebug>

// 1. 创建复选框对象
QCheckBox *checkBox = new QCheckBox("开启自动保存", this);

// 2. 设置初始状态（默认未选中，这里设置为选中）
checkBox->setChecked(true);

// 3. 连接信号与槽（当勾选状态改变时触发 lambda 函数）
connect(checkBox, &QCheckBox::toggled, this, [](bool checked) {
    if (checked) {
        qDebug() << "自动保存已开启";
    } else {
        qDebug() << "自动保存已关闭";
    }
});
```

#  三态复选框
当前类支持三态模式，在“子项目部分被选中”的树形列表或全选框中非常常见

## 三种状态的枚举
- `Qt::Unchecked`（未选中，值为 0）
- `Qt::PartiallyChecked`（半选中/部分选中，值为 1）
- `Qt::Checked`（已选中，值为 2）

##  使用
```cpp
#include <QCheckBox>
#include <QVBoxLayout>
#include <QList>

// 1. 创建控件
QCheckBox *parentBox = new QCheckBox("全选（所有功能）", this);
parentBox->setTristate(true); // 开启父复选框的三态

QCheckBox *child1 = new QCheckBox("功能 A", this);
QCheckBox *child2 = new QCheckBox("功能 B", this);
QCheckBox *child3 = new QCheckBox("功能 C", this);

QList<QCheckBox*> childBoxes = {child1, child2, child3};

// 2. 布局放置
QVBoxLayout *layout = new QVBoxLayout(this);
layout->addWidget(parentBox);
layout->addWidget(child1);
layout->addWidget(child2);
layout->addWidget(child3);

// 3. 联动逻辑 A：点击父复选框 -> 更新所有子复选框
connect(parentBox, &QCheckBox::clicked, this, [=]() {
    // 鼠标点击父框时，只有 Checked 和 Unchecked 两种手势
    bool checkAll = parentBox->isChecked();
    for (QCheckBox *child : childBoxes) {
        child->setChecked(checkAll);
    }
});

// 4. 联动逻辑 B：任意子复选框状态改变 -> 更新父复选框
auto updateParentState = [=]() {
    int checkedCount = 0;
    for (QCheckBox *child : childBoxes) {
        if (child->isChecked()) {
            checkedCount++;
        }
    }

    if (checkedCount == 0) {
        parentBox->setCheckState(Qt::Unchecked);        // 全部未选
    } else if (checkedCount == childBoxes.size()) {
        parentBox->setCheckState(Qt::Checked);          // 全部选中
    } else {
        parentBox->setCheckState(Qt::PartiallyChecked); // 部分选中
    }
};

// 为每个子复选框绑定监听
for (QCheckBox *child : childBoxes) {
    connect(child, &QCheckBox::toggled, this, updateParentState);
}
```
这段代码中关于按钮控件创建部分可以使用UI拖拽代替，效率更高，后面同理。