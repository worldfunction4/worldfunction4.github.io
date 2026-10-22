---
title: 一、 最简使用方式：静态方法
date: 2026-10-21
category:
- Qt框架
---
# 一、 最简使用方式：静态方法
#### 1. 选择单个文件打开 (`getOpenFileName`)

```cpp
#include <QFileDialog>
#include <QDebug>

QString fileName = QFileDialog::getOpenFileName(
    this,                                    // 父窗口
    "选择要打开的文件",                        // 对话框标题
    "C:/",                                   // 默认打开路径
    "文本文件 (*.txt);;图像文件 (*.png *.jpg);;所有文件 (*.*)" // 格式过滤器
);

if (!fileName.isEmpty()) {
    qDebug() << "选中的文件路径：" << fileName;
}
```

#### 2. 选择多个文件打开 (`getOpenFileNames`)

```cpp
QStringList files = QFileDialog::getOpenFileNames(
    this,
    "选择多个文件",
    "D:/",
    "所有文件 (*.*)"
);

for (const QString &file : files) {
    qDebug() << "选中的文件：" << file;
}
```

#### 3. 选择保存文件路径 (`getSaveFileName`)

```cpp
QString savePath = QFileDialog::getSaveFileName(
    this,
    "保存文件",
    "C:/Users/Documents/untitled.txt", // 默认保存文件名及路径
    "文本文件 (*.txt);;所有文件 (*.*)"
);

if (!savePath.isEmpty()) {
    // 执行具体的写文件逻辑...
}
```

#### 4. 选择文件夹/目录 (`getExistingDirectory`)

```cpp
QString dirPath = QFileDialog::getExistingDirectory(
    this,
    "选择目录",
    "C:/",
    QFileDialog::ShowDirsOnly | QFileDialog::DontResolveSymlinks
);

if (!dirPath.isEmpty()) {
    qDebug() << "选中的目录：" << dirPath;
}
```

# 二、 过滤器格式说明 (Filter Syntax)

格式过滤是 `QFileDialog` 的核心特性之一，多个规则之间用双分号 `;;` 隔开：

- **单个类型：** `"Text Files (*.txt)"`
- **多个后缀：** `"Images (*.png *.jpg *.jpeg *.bmp)"`
- **组合多个过滤组：** `"Text (*.txt);;Images (*.png *.jpg);;All Files (*.*)"`

如果需要获取用户当前**选中的过滤器**：

```cpp
QString selectedFilter;
QString fileName = QFileDialog::getOpenFileName(
    this, "打开文件", "", 
    "Image Files (*.png *.jpg);;Text Files (*.txt)", 
    &selectedFilter
);
```

# 三、 进阶使用：自定义对象模式

如果默认静态对话框满足不了需求（例如需要实时监听选中文件变化、嵌入自定义控件或设置特定的对话框模式），可以像普通窗口一样实例化：

```cpp
QFileDialog dialog(this, "高级文件对话框", "C:/");

// 设置选择模式：选择文件/选择文件夹/多选
dialog.setFileMode(QFileDialog::ExistingFiles);

// 设置视图模式：详细列表 (Detail) 或 图标列表 (List)
dialog.setViewMode(QFileDialog::Detail);

// 设置文件过滤
dialog.setNameFilter(tr("Images (*.png *.xpm *.jpg)"));

if (dialog.exec()) {
    QStringList selectedFiles = dialog.selectedFiles();
    // 处理文件...
}
```

# 四、 常用 Option 配置选项

通过 `setOption()` 或在静态函数中传入 `QFileDialog::Options`，可以改变对话框的行为：

|**选项 (Option)**|**含义与作用**|
|---|---|
|`QFileDialog::DontUseNativeDialog`|不使用操作系统原生文件对话框，强制使用 Qt 自带的跨平台 UI 风格|
|`QFileDialog::ShowDirsOnly`|仅显示/选择目录（通常在 `getExistingDirectory` 中搭配使用）|
|`QFileDialog::ReadOnly`|将对话框设为只读模式|
|`QFileDialog::DontConfirmOverwrite`|保存文件时，如果目标文件已存在，**不弹窗提示**是否覆盖|

##  和`QFile`的对比

| **特性**   | **QFileDialog**                      | **QFile**               |
| -------- | ------------------------------------ | ----------------------- |
| **主要职责** | **图形界面（UI）**                         | **底层 IO 操作**            |
| **核心功能** | 弹出一个可视化窗口，让用户浏览、选择文件或目录              | 打开、读取、写入、重命名、删除磁盘上的物理文件 |
| **用户感知** | 用户能看见并点击（UI 交互）                      | 后台静默运行，用户看不到            |
| **返回值**  | 用户选择的**文件路径字符串**（如 `"C:/doc/a.txt"`） | 字节流数据、文本内容、操作成功与否的布尔值   |

在实际开发中，通常是先用 `QFileDialog` 获取路径，再传给 `QFile` 进行读写：
```cpp
#include <QFileDialog>
#include <QFile>
#include <QTextStream>
#include <QDebug>

// 1. 用 QFileDialog 让用户选择要打开的文件路径
QString filePath = QFileDialog::getOpenFileName(this, "选择文本文件", "", "文本文件 (*.txt)");

// 如果用户取消了选择，filePath 会为空
if (!filePath.isEmpty()) {
    // 2. 将路径传给 QFile 进行物理读取
    QFile file(filePath);
    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream in(&file);
        QString content = in.readAll(); // 读取全部内容
        file.close();
        
        qDebug() << "文件内容是：" << content;
    } else {
        qDebug() << "无法打开文件：" << file.errorString();
    }
}
```

