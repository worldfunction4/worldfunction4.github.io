---
title: chrono库
date: 2026-09-22
category:
- C和C++
---
# chrono库

<!-- more -->

在[C++线程](C++11现代特性/C++线程/线程和多线程.md)里一直在写下面这行，用来假装任务在干活：

```cpp
void time(int ms) {
    std::this_thread::sleep_for(std::chrono::milliseconds(ms));
}
```

这其实已经用上了 C++11 的时间库 `std::chrono`。头文件是 `<chrono>`。`<thread>` 有时会间接带进来一部分声明，但自己写的时候还是应该显式包含，不然换个编译器就可能编不过。

## 它在干什么

`chrono` 把时间拆成三块，不要混：

| 名字 | 它是什么 | 例子 |
| --- | --- | --- |
| **duration** | 一段时间有多长 | `milliseconds(1000)` 就是 1 秒 |
| **time_point** | 某一个瞬间 | `steady_clock::now()` |
| **clock** | 用哪座钟去读时间 | `steady_clock` / `system_clock` |

上面那行 `time(1000)` 里发生了两件事：

1. `milliseconds(ms)` 造出一个 duration（长度）。
2. `this_thread::sleep_for(...)` 让**当前这个线程**按这个长度睡觉。

睡的是这个线程自己，不是整个程序。所以多线程里大家可以各睡各的——这也是[互斥锁](C++11现代特性/互斥锁.md)里为什么不要把锁包在 `time(1000)` 外面：睡觉不碰共享资源，攥着钥匙只会让别人干等。

## duration：先说长度

常用单位都是 duration 的别名：`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours`。

它们可以加减。往更细的单位转（秒 → 毫秒）可以直接赋；往更粗的单位转会丢精度，必须显式 `duration_cast`：

```cpp
using namespace std::chrono;

auto d = milliseconds(1500);
auto s = duration_cast<seconds>(d); // 变成 1 秒，小数被截掉
std::cout << s.count();             // count() 才是那个整数
```

C++14 之后还能写字面量，要先 `using namespace std::chrono_literals;`，然后 `1000ms`、`2s` 这种写法就合法了。

和 `sleep_for` 对应的还有 `sleep_until(某个 time_point)`：一个是“再睡这么久”，一个是“睡到那个时刻”。线程笔记里用的是第一种。

## clock：这座钟会不会被拨

测代码跑了多久，用 `steady_clock`。它只往前走，系统对时、用户改系统时间都不会让它往回跳。

`system_clock` 是墙上的日历时间，适合打印“现在几点”，但**不适合测耗时**——NTP 一对时，你算出的间隔可能是负数。

```cpp
#include <chrono>
#include <iostream>

int main() {
    using clock = std::chrono::steady_clock;
    auto t0 = clock::now();
    // ... 干点活
    auto t1 = clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(t1 - t0);
    std::cout << ms.count() << " ms\n";
}
```

两个 time_point 相减，得到的是 duration。`.count()` 才是那个整数。

`high_resolution_clock` 在不同实现上可能只是 `system_clock` 的别名，测耗时不要赌它，直接用 `steady_clock`。
## duration 的模板与 ratio（从旧稿「chrono库（未完结）」并入）

普通代码中，
```cpp
int t = 5;
```
这个`5`是秒，毫秒，还是什么单位？不知道单位自然也无法进行运算，这就是`std::chrono::duration`出现的原因，简单来说它是把**数值**和**单位**绑定在一起了。

### 原型
这个类表示一段时间的间隔，用来记录时间长度，可以表示几分几秒几小时的时间间隔。原型如下：
```cpp
//<chrono>
template<class Rep, class Period = std::ratio<1>>
class duration;
```
`Rep`：数值类型，表示时钟数（周期）的类型（默认为整形）。若 Rep 是浮点数，则 duration 能使用小数描述时钟周期的数目。
`Period`：表示时钟周期，原型如下:
```cpp
//<ratio>
template<std::intmax_t Num, std::intmax_t Denom =1>
class ratio;
```
用`std::ratio<分子，分母>`表示一秒的分数
- `std::ratio<1, 1000>` 表示 $\frac{1}{1000}$ 秒，即 **毫秒**
- `std::ratio<1, 1>` 表示 $1$ 秒，即 **秒**

C++已经定义好了常用单位，不需要每次手动写`ratio`：
- `std::chrono::nanoseconds`（纳秒）
- `std::chrono::microseconds`（微秒）
- `std::chrono::milliseconds`（毫秒）
- `std::chrono::seconds`（秒）
- `std::chrono::minutes`（分钟）
- `std::chrono::hours`（小时）

### duration 之间的转换（旧稿示例）
在`duration`之间进行转换，有两种情况：
- 隐式转换（安全）：从高精度转为低精度（比如秒到毫秒，不会丢失精度）
	```cpp
	std::chrono::seconds s(2);
	std::chrono::milliseconds ms = s; //ms变为2000
	```
- 强制转换（有丢失精度风险）：低精度到高精度或者或浮点转为整形，需要使用`std::chrono::duration_cast`：
	```cpp
	std::chrono::duration<double> d_sec(2.5);
	std::chrono::seconds s = std::chrono::duration_cast<std::chrono::second>(d_sec)
	```

## time_point：某一个瞬间（从旧稿「chrono库（未完结）」并入）

### 原型
chrono库提供表示时间点的类`time_point`，定义为：
```cpp
//<chrono>
template<class Clock, class Duration = typename Clock::duration>
class time_point;
```
实现成如同存储一个 Duration 类型的自 Clock 的纪元起始开始的时间间隔的值，通过这个类最终可以得到时间中的某一个时间点
