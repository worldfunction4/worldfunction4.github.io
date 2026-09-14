---
title: vector容器
date: 2026-08-19
category:
  - C和C++
---
## 基本概念

vector数据结构和数组非常类似，也称为**单端数组**
那么它与普通数据有什么不同呢？数组是静态空间，而vector可以进行**动态扩展**
动态扩展也不是在原空间后面续接新空间，而是找更大内存空间，然后将原数据拷贝到新空间，然后释放原空间
<!-- more -->
[ std::vector](/knowledge-base/knowledge/C和C++/C++_std_vector_学习笔记.md)里面有更详细的笔记。

## 构造函数

在进行构造时有以下的方法：
```cpp
# include <iostream>
# include <vector>
using namespace std;
void print_vector(const vector<int> &v) {
	for (vector<int>::iterator it = v.begin(); it != v.end(); it++) {
		cout << *it;
	}
}
int main() {
	vector<int>v;

	for (int i = 0; i < 10; i++) {
		v.push_back(i + 1);
	}
	//拷贝构造
	vector<int>v1(v);
	//区间方式
	vector<int>v2(v.begin(), v.end());
	//第三种
	vector<int>v3(10, 100);

	return 0;
}
```
但是在自己写函数来统一打印时print_vector()函数有一个错误：

-  函数参数 `const vector<int> &v` 表明 `v` 是只读的。
    
- 在 C++ 中，对于 const 对象，`v.begin()` 返回的是 `const_iterator`，而不是普通的 `iterator`。
    
- 写的 `vector<int>::iterator` 是非 const 迭代器，类型不匹配，编译器会报错。

那么解决方法有以下几种修改方式：

### 1. 使用 `const_iterator`（C++98/03 风格）


```cpp

void print_vector(const vector<int> &v) {
    for (vector<int>::const_iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " "; 
    }
}
```

### 2. 使用 `auto` + `cbegin()/cend()`（C++11 推荐）


```cpp

void print_vector(const vector<int> &v) {
    for (auto it = v.cbegin(); it != v.cend(); ++it) {
        cout << *it << " ";
    }
}
```
### 3. 使用基于范围的 for 循环（最简洁，C++11）

```cpp

void print_vector(const vector<int> &v) {
    for (int x : v) {
        cout << x << " ";
    }
}
```

最终考虑到自己还未开始学习现代c++的知识，选择老办法：
```cpp
# include <iostream>
# include <vector>
using namespace std;

void print_vector(const vector<int> &v) {
    for (vector<int>::const_iterator it = v.begin(); it != v.end(); ++it) {
        cout << *it << " ";
    }
}
int main() {
	vector<int>v;

	for (int i = 0; i < 10; i++) {
		v.push_back(i + 1);
	}
	//拷贝构造
	vector<int>v1(v);
	print_vector(v1);
	cout << endl;
	//区间方式
	vector<int>v2(v.begin(), v.end());
	print_vector(v2);
	cout << endl;
	//第三种
	vector<int>v3(10, 100);
	print_vector(v3);

	return 0;
}
```
## 赋值操作

- `vector& operator=(const vector &vec) //重载等号操作符`
- `assgin(beg, end);  //将[beg, end]区间中数据拷贝赋值给本身`
- `assgin(n, elem); //将n个elem拷贝赋值给本身`

也就是有以下的赋值方式(示例)：
```cpp
#include <iostream>
#include<vector>
using namespace std;
void print_vector(const vector<int> &v) {
	for (vector<int>::const_iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << " ";
	}
}

int main() {
	vector<int>v;
	for (int i = 0; i < 10; i++) {
		v.push_back(i);
	}
	print_vector(v);
	cout << endl;

	// 赋值 进行了operator=
	vector<int>v1;
	v1 = v;
	print_vector(v1);
	cout << endl;

	// assign
	vector<int>v2;
	v2.assign(v1.begin(), v1.end());
	print_vector(v2);
	cout << endl;


	// 使用n个elem方式来进行赋值
	vector<int>v3;
	v3.assign(10, 100);

	return 0;
}
```

## vector容量和大小

- `empty(); //判断容器是否为空`
- `capacity(); //容器的容量`
- `size(); //返回容器中元素的个数`
- `resize(int num); //重新指定容器的长度为num，如果变长：以默认值填充新位置。如果变短：末尾超出容器长度的元素被删除`
- `resize(int num, elem); //重新指定容器的长度为num，如果变长：以elem填充新位置。如果变短：末尾超出容器长度的元素被删除`
```cpp
# include <iostream>
# include <vector>
using namespace std;

// 赋值操作函数
void set_vector(vector<int>& v) {

	if (v.empty()) {
		for (int i = 0; i < 10; i++) {
			v.push_back(i);
		}
	}
	else {
		cout << "容器不是空的" << endl;
		cout << "容器的容量为：" << v.capacity() << endl;
	}
}

void show_vector(const vector<int> &v) {
	for (vector<int>::const_iterator it = v.begin(); it != v.end(); it++) {
		cout << *it << endl;
	}
}

int main() {
	vector<int>v;
	set_vector(v);
	show_vector(v);

	vector<int>v1(v);
	set_vector(v1);
	show_vector(v1);

	return 0;
}
```

