---
title: git push失败
date: 2026-09-12
category:
  - 知识库
  - 遇到的一些问题
---

问题：
<!-- more -->
![git失败.png](/knowledge-base/knowledge/遇到的一些问题/imgs/git失败.png)

自查使用相关命令：
```
PS D:\deepseek_harness\dsh-desk> git status
On branch main
Your branch is ahead of 'origin/main' by 5 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
PS D:\deepseek_harness\dsh-desk> git remote -v
origin  https://github.com/worldfunction4/dsh-desk.git (fetch)
origin  https://github.com/worldfunction4/dsh-desk.git (push)
```

发现似乎不是配置问题，初步结论：网络问题。
检查了一下自己的代理软件：TUN模式正常。
配置了代理访问但是却出现问题了，临时解决：除去代理配置
```powershell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

有时候环境变量中也残留了代理配置，在当前 PowerShell 窗口运行以下命令重置：
```powershell
$env:http_proxy=""
$env:https_proxy=""
```


也可以重新配置正确端口：
```powershell
git config --global http.proxy http://127.0.0.1:端口
git config --global http.proxy https://127.0.0.1:端口
```

即可。


------------

补充：
遇到了上述解决方法做完后依旧是网络无法连接的问题。

通过查看git的全局配置及其来源文件进行排查：

```powershell
git config --global --list --show-origin
```

结果发现没有代理....这意味着连接 `127.0.0.1` 的代理配置只可能来自于**当前仓库的本地配置**或 **Windows 系统环境变量**。清楚后解决了。

但紧接着遇到了新的问题：
```
PS D:\deepseek_harness\dsh-desk> git push                                
To https://github.com/worldfunction4/dsh-desk.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/worldfunction4/dsh-desk.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

远程 GitHub 仓库包含了本地没有的新提交。
由于远程仓库版本是旧的，直接强制覆盖，这里有两种方式：

1.防止误覆盖他人新提交的安全方式，在我之后有人推送过新代码，命令会自动拒绝，防止误删他人工作：
```powershell
git push --force-with-lease origin main
```

2.忽略一切远程状态直接替换，远程仓库的一切内容都不需要了：
```powershell
git push --force origin main
```

