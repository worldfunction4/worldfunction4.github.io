---
title: 无法将项目更改push到远程仓库
date: 2026-08-19
category:
  - 知识库
  - 遇到的一些问题
---
今天在对自己的项目进行优化后照常进行更新，结果出现了以下的问题：
![Pasted image 20260602203635.png](/knowledge-base/photos/question/Pasted%20image%2020260602203635.png)

经过对claude的询问，它告诉我：`git push` 一直卡住超时，原因是**认证方式不对**。你的 remote 是 HTTPS 格式（`https://github.com/...`），每次 push 都需要用户名密码。但 GitHub 从 2021 年起已经**禁止密码登录**，必须用 Personal Access Token (PAT) 或 SSH key。你的终端弹出密码框 → 你输入 GitHub 密码 → GitHub 拒绝 → 看起来就像"无法执行"。

我想这和我前几天在github上所做的改动有关...总之也给出了两个方案：
###  A:用 Personal Access Token
1. 打开 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 点 **Generate new token (classic)**
3. 勾选 `repo` 权限，生成后**复制 token**（只显示一次！）
4. 在终端执行 push 时，用户名填你的 GitHub 用户名，密码**粘贴 token**：
```powershell
git push
# Username: worldfunction4
# Password: <粘贴你的 token，不会显示任何字符，这是正常的>
```
或者一步到位，把 token 缓存起来（免去每次都输）：

```powershell
git config --global credential.helper wincred
```

### B:换成 SSH Key

```powershell
# 1. 生成 SSH key（一路回车即可）
ssh-keygen -t ed25519 -C "GitHub邮箱"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 去 https://github.com/settings/keys → New SSH Key → 粘贴

# 4. 把 remote 从 HTTPS 改成 SSH
git remote set-url origin git@github.com:worldfunction4/NetGuard.git

# 5. 推送
git push
```

然后我选择了方案A，你猜怎么着:

![Pasted image 20260602204232.png](/knowledge-base/photos/question/Pasted%20image%2020260602204232.png)

是的我还没开始就成功了，事实证明AI说的不一定也是正确的，我去问它时它居然说...

![Pasted image 20260602204330.png](/knowledge-base/photos/question/Pasted%20image%2020260602204330.png)
我： **？**

