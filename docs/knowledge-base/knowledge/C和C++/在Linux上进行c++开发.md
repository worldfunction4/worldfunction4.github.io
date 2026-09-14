---
title: 在 Linux 上进行 C++ 开发
date: 2026-08-19
category:
  - C和C++
tag:
  - Linux
---
# 在 Linux 上进行 C++ 开发

## 开发工具链概览

| 工具 | 作用 | 常用工具 |
|------|------|---------|
| **编辑器** | 写代码 | Vim、VS Code、CLion、CodeLite |
| **编译器** | 源代码 → 可执行文件 | g++、clang++ |
| **构建工具** | 自动化编译流程 | Make、CMake |
| **调试器** | 调试程序 | GDB |
| **静态分析** | 代码质量检查 | clang-tidy、cppcheck |
| **包管理** | 安装依赖库 | apt、dnf、vcpkg、conan |

---

## 编译器：g++

### 安装

```bash
# Ubuntu / Debian
sudo apt install g++

# CentOS / RHEL / Fedora
sudo dnf install gcc-c++

# 查看版本
g++ --version
```

### 基本用法

```bash
# 单个源文件 → 可执行文件
g++ main.cpp -o main

# 多个源文件
g++ main.cpp utils.cpp -o app

# 运行
./main
./app
```

### 常用编译选项

| 选项 | 作用 |
|------|------|
| `-o <file>` | 指定输出文件名 |
| `-Wall` | 开启大多数警告 |
| `-Wextra` | 开启额外警告 |
| `-Werror` | 把警告当错误处理 |
| `-g` | 生成调试信息（给 GDB 用） |
| `-O0` | 不优化（调试时用） |
| `-O2` | 优化（发布时用） |
| `-std=c++11/14/17/20` | 指定 C++ 标准 |
| `-I<path>` | 添加头文件搜索路径 |
| `-L<path>` | 添加库文件搜索路径 |
| `-l<name>` | 链接库（如 `-lpthread`） |

```bash
# 开发调试
g++ main.cpp -o main -Wall -Wextra -g -std=c++17

# 发布
g++ main.cpp -o main -Wall -O2 -std=c++17
```

---

## 构建工具：Make

### 最简单的 Makefile

```makefile
# 文件名：Makefile
app: main.cpp
	g++ main.cpp -o app -Wall -std=c++17

clean:
	rm -f app
```

使用：

```bash
make        # 编译
make clean  # 清理
```

### 更完善的 Makefile

```makefile
CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++17 -g
TARGET = app
SRCS = main.cpp utils.cpp network.cpp
OBJS = $(SRCS:.cpp=.o)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $(TARGET)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

run: $(TARGET)
	./$(TARGET)
```

---

## 构建工具：CMake（更推荐）

CMake 是跨平台的构建系统，**生成** Makefile 或 Ninja 构建文件。

### 安装

```bash
sudo apt install cmake
```

### 最简单的 CMakeLists.txt

```cmake
# 文件名：CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
project(MyApp)

set(CMAKE_CXX_STANDARD 17)

add_executable(app main.cpp)
```

使用：

```bash
mkdir build && cd build
cmake ..          # 生成 Makefile
make              # 编译
./app             # 运行
```

### 多文件 + 库链接

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 收集源文件
file(GLOB SOURCES src/*.cpp)

# 添加可执行文件
add_executable(myapp ${SOURCES})

# 添加头文件路径
target_include_directories(myapp PRIVATE include)

# 链接外部库
target_link_libraries(myapp pthread)
```

### CMake 常用命令速查

```cmake
add_executable(target src1.cpp src2.cpp)   # 生成可执行文件
add_library(lib STATIC src.cpp)             # 生成静态库
add_library(lib SHARED src.cpp)             # 生成动态库
target_include_directories(target PRIVATE path)  # 头文件路径
target_link_libraries(target lib)           # 链接库
find_package(OpenCV REQUIRED)              # 查找外部包
```

---

## 调试：GDB

### 编译时加 -g

```bash
g++ main.cpp -o main -g -Wall -std=c++17
```

### 常用 GDB 命令

```bash
gdb ./main          # 启动调试
```

| GDB 命令 | 作用 |
|---------|------|
| `b main` | 在 main 函数设断点 |
| `b file.cpp:10` | 在文件第 10 行设断点 |
| `r` | 运行程序 |
| `n` | 下一步（不进入函数） |
| `s` | 单步进入函数 |
| `c` | 继续运行到下一个断点 |
| `p var` | 打印变量值 |
| `q` | 退出 GDB |

### 示例调试会话

```bash
$ gdb ./app
(gdb) b main
(gdb) r
(gdb) n
(gdb) p count
$1 = 0
(gdb) s
(gdb) c
(gdb) q
```

---

## 项目目录结构推荐

```
myproject/
├── CMakeLists.txt      # 顶层 CMake 配置
├── README.md
├── src/                # 源文件
│   ├── main.cpp
│   ├── utils.cpp
│   └── network.cpp
├── include/            # 头文件
│   ├── utils.h
│   └── network.h
├── build/              # 编译输出（不提交 Git）
├── lib/                # 第三方库
└── tests/              # 测试代码
    └── test_utils.cpp
```

---

## 完整工作流程

```bash
# 1. 创建项目目录
mkdir -p myproject/src myproject/include myproject/build

# 2. 写 CMakeLists.txt
cd myproject
vim CMakeLists.txt

# 3. 写代码
vim src/main.cpp

# 4. 编译
cd build
cmake ..
make

# 5. 运行
./myapp

# 6. 调试（如果有 bug）
gdb ./myapp

# 7. 清理重新编译
make clean && make
```

---

## 编辑器选择

| 编辑器 | 特点 |
|--------|------|
| **Vim** | 终端内编辑，轻量，学习曲线陡 |
| **VS Code** | 图形界面，插件丰富（C++插件、CMake插件） |
| **CLion** | JetBrains 出品，功能强大，付费 |
| **CodeLite** | 轻量 IDE，免费，内置 CMake 支持 |

### VS Code 推荐插件

- C/C++（微软官方）
- CMake Tools
- Code Runner

---

## 一句话总结

```bash
# 最小的 C++ 开发流程
vim main.cpp           # 写代码
g++ main.cpp -o main   # 编译
./main                 # 运行
```

> 项目变大后用 CMake 管理，有 bug 用 GDB 调试，这就是 Linux 下 C++ 开发的基本套路。
