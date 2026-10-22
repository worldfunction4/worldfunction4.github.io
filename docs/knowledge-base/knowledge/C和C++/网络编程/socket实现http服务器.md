---
title: socket实现http服务器
date: 2026-10-21
category:
- C和C++
---
# socket实现http服务器

最近学了socket，虽然已经写过好几次了，但是还是会遇到参数不知道的函数...所以进行记录，要怎么才能学会网络编程呢...

## 流程

在写代码之前，首先需要建立一个正确的认知。其实整个流程如下：

<!-- more -->

![socket套接字](./imgs/socket套接字.png)

这个就是整个基本生命周期了。
这里使用c++的面向对象方式将此流程进行打包。
### socket

`socket`函数就是开始的第一步，这个函数会返回一个int类型的值：
```cpp
#include <sys/socket.h> // 头文件

int server_fd = socket(AF_INET, SOCK_STREAM, 0);
```

那么这里面三个参数都是什么意思？
`AF_INET`：代表使用的是ipv4协议
`SOCK_STREAM`：代表使用TCP协议（面向连接的字节流）
`0`：使用此类型的默认协议

### bind
在使用`bind`函数以前，需要先定义一个结构体来进行网络地址信息的保存，毕竟`socket`只负责打开与网络的连接，但要连接谁？用哪个端口？网卡用哪个？都不知道：
```cpp
struct sockaddr_in address;
address.sin_family = AF_INET;               // 地址族 (IPv4)
address.sin_addr.s_addr = INADDR_ANY;       // 监听本机所有网卡 IP
address.sin_port = htons(8080);             // 绑定端口号为 8080
```
当然struct可以省略（在c++中），然后就可以进行绑定操作了：
```cpp
bind(server_fd, (struct sockaddr*)&address, sizeof(address));
```

我们定义的明明是 `struct sockaddr_in`，但在传入 `bind` 时，却强制转换成了 `struct sockaddr*`，这是为什么？

这是在C语言的历史上进行的一种古典设计，在没有 C++“继承”或“泛型”的年代，系统的 Socket API 必须想办法同时支持 **IPv4** (`sockaddr_in`)、**IPv6** (`sockaddr_in6`) 以及本地进程间通信等各种不同的地址格式，为了实现“通用”，C 语言作者设计了一个通用的结构体 `struct sockaddr`。这就像一个**通用接口**，不管你用的是哪种网络协议，传入 `bind()` 或 `connect()` 时，统一强制转换成 `(struct sockaddr*)`，操作系统就能用相同的方式接纳它们。

### listen
进行绑定以后就要开始监听了：
```cpp
listen(server_fd, 5);
```
第一个当然是我们在第一步中得到`fd`（文件描述符），第二个是等候区，也就是等待连接的最大数。那么接下来要做什么？同样，我们也需要得到一个新的连接：
```cpp
//接受连接
struct sockaddr_in client_addr{}; 
socklen_t client_len = sizeof(client_addr);

// accept 会阻塞等待，直到有客户端连进来 
int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
```

这里的结构体是一个输出参数，在调用`accept`函数时我们调用这个结构体的地址，就能把客户端的ip地址以及端口等填进去了，相当于一张“空白的访客登记表”。

如果完全不在乎客户端的 IP 和端口，这里也可以直接传 `nullptr`：
```cpp
int client_fd = accept(server_fd, nullptr, nullptr);
```

### read或者recv
接下来我们就要读取从客户端发来的数据了，从套接字读取数据最基础的系统调用是 `read()`（或 `recv()`）。当然我们也需要一个地方来装客户端发来的数据，这个时候就需要声明一个缓冲区(Buffer)了，毕竟网络数据是像水流一样传输的。

```cpp
char buffer[1024] = {0}; // 准备一个 1KB 的缓冲区，并清零

// 从 client_fd 读取数据放入 buffer
ssize_t bytes_read = read(client_fd, buffer, sizeof(buffer) - 1);
```

当然，选择`std::string`才是更符合我们的习惯：

```cpp
std::string buffer;
buffer.reserve(1024);

ssize_t bytes_read = read(client_fd, buffer.data(), buffer.size());
if (bytes_read > 0) 
{ 
	buffer.resize(bytes_read);// 裁剪回实际接收到的字节长度
}
```

不过这里需要注意：
- **`buffer.data()`**：在 C++17 及以后，`data()` 会返回一个可修改的指针 `char*`，可以直接供 `read()` 写入。
    
- **二次 `resize(bytes_read)`**：`read()` 是底层的系统 API，它把字节填入内存后不会自动更新 `std::string` 的 `size()`。所以读取完成后，我们需要把后面没用到的空白内存裁掉。


好，现在成功把客户端发送过来的请求数据完整装进了 `std::string buffer` 中。

### 协议

接下来就是**协议解析**，也就是浏览器发给服务器的请求，我们知道，一个请求通常会包含以下的信息：

| **组成部分**                     | **包含的具体信息**                                    | **示例**                                                            |
| ---------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| **1. 请求行 (Request Line)**    | **请求方法** (Method) + **请求路径** (Path) + **协议版本** | `GET /index.html HTTP/1.1`                                        |
| **2. 请求头 (Request Headers)** | 多行键值对，存放客户端与请求的元数据                             | `Host: localhost:8080`<br><br>  <br><br>`User-Agent: Mozilla/5.0` |
| **3. 空行 (CRLF)**             | 一个独立的 `\r\n`，用来告诉服务器 **Header 结束了**            | `\r\n`                                                            |
| **4. 请求体 (Request Body)**    | 传递的具体数据（**可选**，常见于 `POST` 或 `PUT`）             | `{"username": "admin"}`                                           |
一个带POST请求为例：
```
POST /login HTTP/1.1\r\n              1. 请求行 
Host: localhost:8080\r\n              2. 请求头 
Content-Type: application/json\r\n    2. 请求头 
Content-Length: 25\r\n               2. 请求头 
\r\n                                  3. 空行 
{"username": "coder_cplus"}           4. 请求体 
```



### HTTP

所以一个HTTP响应报文可以是这样的：
```cpp
std::string response = 
    "HTTP/1.1 200 OK\r\n"                    // 1. 状态行 (Status Line)
    "Content-Type: text/html; charset=utf-8\r\n" // 2. 响应头 (Header)
    "Content-Length: 21\r\n"                // 3. 告诉浏览器 Body 的字节数
    "\r\n"                                  // 4. 空行 (用来分隔 Header 和 Body)
    "<h1>Hello World!</h1>";                // 5. 响应体 (Body)
```

这时候就有一个问题了：如何才能精准定位“请求头结束、请求体开始”的位置呢？
答案就是：`\r\n\r\n`

在 HTTP 协议中：

- **请求头的每行末尾**：都自带一个换行符 `\r\n` 
    
- **隔离用的空行**：自身又是一个换行符 `\r\n` 

这两个换行符连在一起，就构成了连续的 **`\r\n\r\n`**，只要在接收到的字符串里找到这个标志，它的**左边**就是请求行和请求头，**右边**就是具体的请求体（Body）只要在接收到的字符串里找到这个标志，它的**左边**就是请求行和请求头，**右边**就是具体的请求体（Body）

如果我们在 C++ 中用 `std::string request_str` 接收到了这段文本呢？

所以我们要找到它的话就需要调用`find`：
```cpp
size_t pos = request_str.find("\r\n\r\n");
```

如果找到了那么`pos`就是它们第一次出现的下标
如果没找到就会返回：`std::string::npos`

找到了以后想要把请求头拿出来要怎么做呢？看来需要`substr`的成员函数

```cpp
// 截取从下标 0 开始，长度为 pos 的子字符串（即 Header 部分）
std::string header_part = request_str.substr(0, pos);
```


现在我们把Header部分分离出来了，它的第一行就是请求头，比如长这样：
`"GET /index.html HTTP/1.1"`

为了让服务器知道客户端想做什么，我们需要把这一行按空格拆开，提取出 **请求方法 (`GET`)** 和 **资源路径 (`/index.html`)**

那么方法要怎么做呢？
在 C++ 中，按空格拆分字符串有一个非常优雅且好用的工具：`std::stringstream`

它就像是一个“自动按空格切分的机器”，当你把一整行包含空格的字符串塞给它时，使用 `>>` 运算符就可以把其中的每个单词按顺序提取出来，自动帮你忽略掉中间的空格
代码非常简短：
```cpp
#include <sstream>
#include <string>

std::string line = "GET /index.html HTTP/1.1";
std::stringstream ss(line);

std::string method;
std::string path;
std::string version;

// 用 >> 运算符，按空格提取每个单词
ss >> method >> path >> version;
```

现在我们得到`path`了，下一步要做的事，就是根据这个路径去**读取本地的文件**（比如本地磁盘上的 `index.html`），并将文件内容填充到 HTTP 响应体（Body）中发回给浏览器。

如果请求了一个不存在的文件那会返回一个经典的状态码：404
```cpp
if (file_exists(path)) {
    // 1. 文件存在：返回 200 OK 并附带文件内容 
    response = "HTTP/1.1 200 OK\r\n...\r\n" + file_content;
} else {
    // 2. 文件不存在：返回 404 Not Found
    response = "HTTP/1.1 404 Not Found\r\n...\r\n<h1>404 Page Not Found</h1>";
}
```


到目前为止，我们已经完整梳理了一个 HTTP 请求从**建立连接  ➔ 读取数据  ➔ 解析请求  ➔ 构造响应** 的全过程

代码如下：
```cpp
#include <cstdio>
#include <fstream>
#include <iostream>
#include <netinet/in.h>
#include <sstream>
#include <string>
#include <sys/socket.h>
#include <unistd.h>

class Mysocket {
public:
    Mysocket(int port)
        : port_(port), sock_fd_(-1)
    {}
  
    void creatSocket() {
        sock_fd_ = socket(AF_INET, SOCK_STREAM, 0);
        if (sock_fd_ < 0) {
            std::perror("socket error");
            return;
        }

        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port_);
        addr.sin_addr.s_addr = INADDR_ANY;
  
        if (bind(sock_fd_, (sockaddr*)&addr, sizeof(addr)) < 0) {
            std::perror("bind error");
            return;
        }
  
        listen(sock_fd_, 10);
        std::cout << " 服务器启动成功，正在监听端口: " << port_ << std::endl;
        startLoop();
    }

    bool file_exists(std::string &path) {
        if (path == "/") {
            path = "/index.html"; //访问根目录默认指向 index.html
        }

        std::ifstream file("." + path);
        return file.is_open();
    }
  
private:
    void startLoop() {
        sockaddr_in client_addr{};
        socklen_t len = sizeof(client_addr);
        int client_fd = accept(sock_fd_, (sockaddr*)&client_addr, &len);
        if (client_fd < 0) {
            std::perror("accept error");
            return;
        }

        std::string buffer(1024, 0); //构造 1024 字节可写缓冲区
        ssize_t bytes_read = read(client_fd, buffer.data(), buffer.size());
        if (bytes_read > 0) {
            buffer.resize(bytes_read);
        }
 
        size_t pos = buffer.find("\r\n\r\n");
        std::string head_str = buffer.substr(0, pos);

        std::stringstream ss(head_str);
        std::string method, path, version;
        ss >> method >> path >> version;

        std::string response;

        if (file_exists(path)) {
            // 1. 读取文件内容
            std::ifstream file("." + path);
            std::stringstream file_ss;
            file_ss << file.rdbuf();
            std::string file_content = file_ss.str();
 
            // 2. 拼装 200 OK 响应报文 拼接响应头与响应体
			response = "HTTP/1.1 200 OK\r\n" 
					"Content-Type: text/html; charset=utf-8\r\n" "Content-Length: " + std::to_string(file_content.length()) + "\r\n" "\r\n" + 
					file_content;
        } else {

            // 3. 文件不存在：返回 404 Not Found
            std::string body = "<h1>404 Page Not Found</h1>";
            response = "HTTP/1.1 404 Not Found\r\n"
                       "Content-Type: text/html; charset=utf-8\r\n"
                       "Content-Length: " + std::to_string(body.length()) + "\r\n"
                       "\r\n" +
                       body;
        }

  

        // 4. 将响应数据写回客户端，并关闭该次连接
        write(client_fd, response.c_str(), response.length());
        close(client_fd);
    }
  
    int sock_fd_;
    int port_;
};

  
int main() {
    Mysocket socke(8011);
    socke.creatSocket();
    return 0;
}
```

## 拆解
按照面向对象设计里的**单一职责原则（SRP）**，一个类应该只负责做好一件事。而我们现在的 `Mysocket` 类却一个人扛下了所有工作：
- **网络底层通信** ：创建 socket、绑定端口、监听、接收连接（`accept`）
    
- **HTTP 协议解析** ：从缓冲区里找 `\r\n\r\n`，提取请求方法和路径
    
- **文件系统交互** ：检查文件是否存在、读取磁盘文件
    
- **HTTP 响应生成** ：拼接 `200 OK` 或 `404 Not Found` 报文
名字叫 `Mysocket`，但它现在既是**网络连接器**，又是 **HTTP 解析器**，还是**网页文件服务器**

```cpp
#include <cstdio>
#include <fstream>
#include <iostream>
#include <netinet/in.h>
#include <sstream>
#include <string>
#include <sys/socket.h>
#include <unistd.h>

class Mysocket {
public:
    Mysocket(int port)
        : port_(port), sock_fd_(-1)
    {}

    void creatSocket()
    {
        sock_fd_ = socket(AF_INET, SOCK_STREAM, 0);
        if (sock_fd_ < 0) {
            std::perror("socket error");
            return;
        }

        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port_);
        addr.sin_addr.s_addr = INADDR_ANY;

        if (bind(sock_fd_, (sockaddr*)&addr, sizeof(addr)) < 0) {
            std::perror("bind error");
            return;
        }

        listen(sock_fd_, 10);
        std::cout << " 服务器启动成功，正在监听端口: " << port_ << std::endl;
        startLoop();
    }

    bool file_exists(std::string &path)
    {
        if (path == "/") {
            path = "/index.html"; //访问根目录默认指向 index.html
        }
        std::ifstream file("." + path);
        return file.is_open();
    }

private:
    void startLoop()
    {
        sockaddr_in client_addr{};
        socklen_t len = sizeof(client_addr);
        while(1)
        {
            int client_fd = accept(sock_fd_, (sockaddr*)&client_addr, &len);
            if (client_fd < 0) {
                std::perror("accept error");
                continue;
            }
            handleClient(client_fd);
        }
    }

    void handleClient(int client_fd)
    {
        std::string buffer(1024, 0); //构造 1024 字节可写缓冲区
        ssize_t bytes_read = read(client_fd, buffer.data(), buffer.size());
        if (bytes_read > 0) {
            buffer.resize(bytes_read);
        }

        size_t pos = buffer.find("\r\n\r\n");
        std::string head_str = buffer.substr(0, pos);
        std::stringstream ss(head_str);
        std::string method, path, version;
        ss >> method >> path >> version;

        std::string response;
        if (file_exists(path)) {
            // 1. 读取文件内容
            std::ifstream file("." + path);
            std::stringstream file_ss;
            file_ss << file.rdbuf();
            std::string file_content = file_ss.str();

            // 2. 拼装 200 OK 响应报文 拼接响应头与响应体
            response = "HTTP/1.1 200 OK\r\n"
                       "Content-Type: text/html; charset=utf-8\r\n"
                       "Content-Length: " + std::to_string(file_content.length()) + "\r\n"
                       "\r\n" +
                       file_content;
        } else {
            // 3. 文件不存在：返回 404 Not Found
            std::string body = "<h1>404 Page Not Found</h1>";
            response = "HTTP/1.1 404 Not Found\r\n"
                       "Content-Type: text/html; charset=utf-8\r\n"
                       "Content-Length: " + std::to_string(body.length()) + "\r\n"
                       "\r\n" +
                       body;
        }
        // 4. 将响应数据写回客户端，并关闭该次连接
        write(client_fd, response.c_str(), response.length());
        close(client_fd);
    }

    int sock_fd_;
    int port_;
};

int main()
{
    Mysocket socke(8011);
    socke.creatSocket();
    return 0;
}
```

可以看到将不同功能的代码进行的功能的拆分

## 连接多个客户端

现在的代码处理完**一个客户端**后程序就直接结束了，如果有一个客户端连接后卡住了（比如网络很慢），或者在处理大文件，后来的其他客户端就会一直在外边排队死等。
