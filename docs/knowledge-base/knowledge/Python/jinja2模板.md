---
title: jinja2模板
date: 2026-08-19
category:
  - Python
---

jinja 是一个python流行的模板语言，仿照Django模板的语言，但其实就是一个专门用来拼字符串的工具。**核心思想**：把 HTML 和 Python 逻辑分开

**用途：标准的配置模板**

[官方github仓库](https://github.com/pallets/jinja)
[中文翻译](https://docs.jinkan.org/docs/jinja2/#)

## 模板语法

列一下常见的
### 变量

```jinja2
{{ 变量名称 }}
```

### 循环

```jinja2
{% for i in range(100) %}
     代码块
{% endfor %}
```

### 条件判断

```jinja2
{% if true %}
	代码块1
{% elif true %}
	代码块2
{% else %}
	代码块3
{% endif %}
```

### 过滤器

```jinja2
{{ vendor_list | func() }}
```

### 继承模板

```jinja2
{% extends "base.conf.tpl" %}
```

### include 导入其他模板

```jinja2
{% include “sub.tpl” %}
```

## 该怎么用？

### 理解

虽然知道对应的语法，但是还是不知道是怎么用的，所以深入研究了一下，举个例子
如果有以下的代码：
```Python
name = "SW1"
```
想变成：
```HTML
<h1>设备 SW1</h1>
```
最简单的办法应该就是：
```Python
html = f"<h1>设备 {name}</h1>"
```
那如果内容变得更加复杂，难道也要一个一个去这样敲？
100台设备
200行HTML
if判断
for循环
你就去敲吧，牛马都没这么累。纯粹用Python来拼字符会变成一场灾难。
还是举个例子：
```Python
html= ""

for d in devices:
	html += f"<tr><td>{d['name']}</td></tr>"
```
光是看这段代码就已经感觉到无力了...

所以**jinja2**才出现了。

本质结构就是：
```
HTML骨架
+
少量逻辑
+
Python数据
=
最终页面
```

### 简单使用步骤


#### 第一步：写模板

```HTML
<h1>{{ name }}</h1>
```
这里面的<code v-pre>{{ name }}</code>意思就是以后再填上。

#### 第二步：传数据

```Python
render(name= "SW1")
```

#### 第三步：jinja2替换变量

传数据后第一步里面的内容就会变成：
```HTML
<h1>SW1</h1>
```

## Jinja2原理

内部干的事情就像：找到<code v-pre>{{ name }}</code>，并替换，最后再输出整个字符串，所以本质还是**字符串处理**。

## for/if

既然要在HTML加入一点逻辑，那就少不了for/if，这就是里面的逻辑。

### for

还是举个例子：
```jinja2
{% for d in devices %}
<p>{{ d.name }}</p>
{% endfor %}
```
这里面就类似于：
``
```Python
for d in devices:
    print(f"<p>{d.name}</p>")
```

### if

同样：
```jinja2
{% if status == "OK" %}
正常
{% endif %}
```
类似：
```python
if status == "OK":
    print("正常")
```


## 实际运用

### 1️. Python 准备数据

```python
devices = [    {"name": "SW1"},    {"name": "SW2"}]
```

---

### 2. HTML 文件写模板

template.html：

```HTML
<h1>设备列表</h1>
{% for d in devices %}
<p>{{ d.name }}</p>
{% endfor %}
```

这里：

```jinja2
{{ d.name }}
```
就是：

> “模板语法”

---

### 3. Python 读取 HTML 文件

main.py：

```python
from jinja2 import Template
with open("template.html", encoding="utf-8") as f:    
	template = Template(f.read()) # 创建模板的对象
```

### 4. 渲染模板

```Python
result = template.render(name="SW1") #把模板里的 `name` 变量，赋值为 `SW1`
```

后面打印或者其他处理即可。
