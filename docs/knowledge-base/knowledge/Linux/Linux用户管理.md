---
title: Linux用户管理（从「Qt使用资源文件无法读取图片」笔记移入）
date: 2026-10-21
category:
- Linux
---
# Linux用户管理（从「Qt使用资源文件无法读取图片」笔记移入）

## 服务器某个用户密码忘记了

### 拥有root权限的情况下

此时直接运行`passwd`：
```bash
sudo passwd <username>
```

## 服务器创建用户

```bash
sudo adduser <newuser>
```
### 添加管理员权限
Ubuntu/Debian
```bash
sudo usermod -aG sudo <newuser>
```
CentOS/RHEL/AlmaLinux:
```bash
sudo usermod -aG wheel <newuser>
```

也可以使用`useradd`命令：
```bash
# 创建用户并自动建立家目录 (-m) 和指定默认 Shell (-s)
sudo useradd -m -s /bin/bash newuser

# 手动为该新用户设置密码
sudo passwd newuser
```

## 对账户进行密钥配置
基本原理是将本地电脑公钥报错到服务器新用户的`~/.ssh/authorized_keys`文件。

### 使用`ssh-copy-id`自动配置
```bash
# username：用户名
# server_ip：服务器ip
ssh-copy-id username@server_ip
```
### 传统手动配置
#### 生成本地密钥对
在本地电脑运行命令生成密钥
```bash
ssh-keygen -t ed25519 -C "email@example.com"
```
参数：
- `ssh-keygen`: OpenSSH提供的密钥生成工具软件
- `-t`: type，指定密钥的加密算法类型，这里使用Ed25519算法
- `-C "email@example.com"`: 这个参数是添加一段注释信息（Comment）会直接写入生成的公钥文件（`id_ed25519.pub`）末尾，这能快速区分这个密钥属于哪台电脑或哪个账号，比如直接写"Aeather"表示这是我的电脑名称

#### 切换登录到需要的用户
```bash
su - username
```

#### 创建.ssh目录与授权文件
为此用户建立密钥目录和文件，如果存在可用跳过：
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 写入本地公钥
在服务器上修改以下文件：
```bash
nano ~/.ssh/authorized_keys
```
在本地电脑的公钥内容（比如`~/.ssh/id_ed25519.pub`或`~/.ssh/id_rsa.pub`文本）粘贴进去，保存退出

可以顺手设置这个文件的安全权限：
```bash
chmod 600 ~/.ssh/authorized_keys
```

#### 验证
```bash
ssh username@server_ip
```
如果不用密码就进去了即可成功

## 删除服务器用户
```bash
sudo userdel <username>
```
加入参数可用：
删除账号以及主目录（/home/用户名）和邮件池：
```bash
sudo userdel -r <username>
```
强制删除，用于处于登录状态或者有后台进程运行：
```bash
sudo userdel -rf <username>
```

### 验证
```bash
id <username>
ls /home/<username>
```

## 禁用一个用户的密码登录，仅使用密钥登录
###  修改ssh配置文件直接禁用
打开ssh配置文件：
```bash
nano /etc/ssh/sshd_config
```
末尾添加这些内容：
```plaintext
Match User 用户名
	PasswordAuthentication no
```
保存退出后重启ssh：
```bash
# 检查是否有语法错误
sshd -t 
systemctl restart ssh
```

### 锁定用户的系统密码
不修改ssh配置文件的方法也是有的，就是锁定用户的系统密码，原理就是：SSH 的公钥登录不依赖系统的密码数据库（`/etc/shadow`），因此即使密码被锁死，公钥依然可以正常登录；但任何尝试用密码登录的行为都会被系统直接拒绝

锁定：
```bash
passwd -l <username>
# 或者 usermod -L <username>
```

## 把禁用密码登录的用户重新打开

### 修改配置文件的打开方法
```bash
nano /etc/ssh/sshd_config
```
打开后把添加的`Match User`几行删除或`#`注释
保存退出后重启ssh服务

### 用户锁定的系统密码
解除锁定
```bash
passwd -u 用户名
```
重新设置密码
```bash
passwd 用户名
```
