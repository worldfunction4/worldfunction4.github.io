---
title: 现象
date: 2026-10-21
category:
- 踩坑
---
在我确保自己VSCode的PATH路径存在时，但WSL却还是无法识别到code...

#  现象
在WSL中使用code无法正确唤起VSCode

# 原因
**WSL 禁止导入 Windows PATH**，这是因为之前我为了测试一些东西把这玩意禁用了（自己都快忘记了），所以打开肯定时不能打开的。再具体写一下：`/etc/wsl.conf` 中存在：
```json
appendWindowsPath = false
```
因此 Ubuntu 内的 PATH 不包含 Windows 程序路径.


另外也需要写一下：**Windows 的 `code` 命令被 Cursor 抢占**，Windows 用户 PATH 顺序是：

```
d:\cursor\resources\app\codeBin
D:\VSCode\Microsoft VS Code\bin
```


# 解决
既然不能打开Win PATH，那么就导入一个指向VSCode的路径即可：
```bash
sudo ln -s '/mnt/d/VSCode/Microsoft VS Code/bin/code' /usr/local/bin/code
hash -r
which code
code .
```

## 修改
如果有新的路径需要修改的话，直接使用上述指令会由于已经存在旧的文件或软链接，所以 `ln` 命令报错提示 `Already exists`。有两种方法：
### 1：加`-f`强制覆盖
在 `ln` 命令后加上 **`-f`** 标志，强制覆盖已存在的链接：
```bash
sudo ln -sf '/mnt/c/Users/123/AppData/Local/Programs/Microsoft VS Code/bin/code' /usr/local/bin/code
```

### 2：删除再重新创建
```bash
 sudo rm /usr/local/bin/code && sudo ln -s '/mnt/c/Users/123/AppData/Local/Programs/Microsoft VS Code/bin/code' /usr/local/bin/code ```
```

然后使用：
```bash
ls -l /usr/local/bin/code
```
验证一下。


