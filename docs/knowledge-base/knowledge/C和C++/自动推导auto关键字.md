---
title: 自动推导auto关键字
date: 2026-08-19
category:
  - C和C++
---
示例：

```cpp
#include <iostream>
using namespace std;


void func(int a, double b, char c, float d, const char* e, short f, long g) {
	cout << "a=" << a << " b=" << b << " c=" << c << " d=" << d << " e=" << e << " f=" << f << " g=" << g;
}

int func1() {
	return 2;
}
int main() {
	void (*ptr)(int a, double b, char c, float d, const char* e, short f, long g);
	ptr = func; //不适用auto这里要写很长的函数指针
	ptr(1, 3.3, 'y',1,"泪叶丝", 4, 5);
	cout << endl;
	auto ptr1 = func; //使用auto只需要写一行即可声明
	ptr1(1, 3.3, 'm', 1, "莉莉娅", 4, 5);
	return 0;
}
```
