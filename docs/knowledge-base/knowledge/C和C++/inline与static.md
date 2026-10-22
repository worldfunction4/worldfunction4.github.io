---
title: 有了`inline`就不需要`static`了？
date: 2026-10-21
category:
- C和C++
---
# 有了`inline`就不需要`static`了？
如果在一个头文件（比如`config.h`）定义了一个配置变量，并且这个头文件被 `main.cpp` 和 `db.cpp` 两个文件 `#include` 了：

## 使用`static`
**写法**：`static const QString WORK = "path"`

**原理**：`static` 意思是**内部链接（Internal Linkage）**。它会给**每一个**包含它的 `.cpp` 文件都**硬生生复制一份独立的物理副本**

**结果**：
- **浪费内存**：如果有 10 个 `.cpp` 文件包含它，内存里就会有 10 个一模一样的 `"path"` 字符串。
    
- **修改不同步隐患**：如果这个变量在运行时被修改（非 `const` 情况），`main.cpp` 修改的是它自己那份，`db.cpp` 里的那份**完全没变**，它们在内存里地址根本不同（`&main_WORK != &db_WORK`）

## 使用`inline`
**写法**：`inline const QString WORK = "path"`

**原理**：`inline` 意思是**外部合并链接（External Linkage with Merging）**。它允许多个 `.cpp` 文件同时定义它，但在最后的链接阶段，链接器会**把它们合并为内存中的唯一同一份**

**结果**：
- **节省内存**：无论多少个 `.cpp` 文件包含它，全局**永远只有一份内存**
    
- **物理唯一**：在任何地方打印它的内存地址都是完全相同的（`&main_WORK == &db_WORK`）

## 既然这样那`static`不就没用了吗？
`static` 在 C++ 中有**多重身份**，它不能用的场景仅限于“头文件里修饰全局/命名空间变量”。在以下场景中，`static` 依然不可替代：
- **在类（`class`）内部**：`static` 用来声明**类的静态成员**（属于类本身，而非对象实例），比如单例模式中的 `static ConfigManager& instance()`

- **在局部函数内部**：`static` 用来声明**静态局部变量**，让变量在函数执行完后依然保存在内存中不被销毁（生命周期贯穿程序始终）

- **在 `.cpp` 文件内部（实现文件）**： 用于隐藏当前 `.cpp` 中的函数或全局变量，防止被其他 `.cpp` 访问（不过现代 C++ 更推荐在这个场景用**匿名命名空间 `namespace { ... }`**）

## 总结一下使用场景
这并不是说`inline`不能用在类里面，如果想直接把函数的方法写在头文件内：
- 写在类（`class`）内部：隐式`inline`。编译器会自动把它当作 `inline` 函数处理：
```cpp
class FileHelper {
public:
    // 直接在类里面写函数体，编译器会自动 inline，不会报重复定义错误
    static QString joinPath(const QString &p1, const QString &p2) {
        return QDir::cleanPath(p1 + "/" + p2);
    }
};
```

- 把函数实现写在类外部或全局作用域：显式`inline`。如果把函数实现写在类外面，但依然放在 `.h` 文件中，就**必须显式加上 `inline`**，否则被多个 `.cpp` 引用时同样会报重复定义错误：
```cpp
// filehelper.h
class FileHelper {
public:
    static QString joinPath(const QString &p1, const QString &p2);
};

// 在头文件中写实现，必须加 inline
inline QString FileHelper::joinPath(const QString &p1, const QString &p2) {
    return QDir::cleanPath(p1 + "/" + p2);
}
```


也就是说：如果只在头文件声明的函数但没有定义的话，使用`static`：
```cpp
class FileHelper {
public:
    static QString joinPath(const QString &p1, const QString &p2); // 只有声明
};
```
这个时候只告诉了编译器有这么一个函数，不占用物理代码空间，所以不需要`inline`


## 写一下最终结论
前提：这是C++17引入

inline可以为在头文件中定义的变量或函数作为只有唯一性的保证，而static一般用于类中静态成员函数，用来保证类中这个函数全程序只有一份，而如果只需要工具类可以直接用命名空间替换，因为C++无法声明静态类，如果还是要用类要写很多个static来保证每个工具函数只有一份，很麻烦，使用命名空间就可以不用写static这么麻烦，因为平时声明和定义是分别在`.h`和`.cpp`，所以一般用不上`inline`，而如果直接在`.h`定义了变量或者函数就需要用`inline`来保证链接时遇到相同变量或函数告诉编译器按一份处理而不是重复定义而报错。而如果使用`inline`的场景变成`static`：

如果是变量：每个 `#include` 该头文件的 `.cpp` 都会独立复制一份该变量的物理内存，如果它不是 `const`（可以被修改），那么在 `A.cpp` 里修改这个变量，`B.cpp` 里的变量**完全不受影响**，因为它们本质上是两块不同的内存
如果是函数：用 `static` 修饰普通函数，每个 `.cpp` 会各自生成一份该函数的代码指令副本，虽然功能不受影响，但会导致编译出来的二进制文件体积膨胀，也就是代码冗余。
