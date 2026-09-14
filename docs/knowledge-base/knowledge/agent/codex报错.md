---
title: codex报错
date: 2026-08-19
category:
  - 知识库
  - agent
---
今天登录codex发现了以下问题：
<!-- more -->

```mermaid
flowchart TD
  A["os error 3 找不到文件"] --> B["config.toml 里的路径带旧版本哈希"]
  B --> C["node_repl.exe / node.exe / codex.exe"]
  C --> D[目录已不存在]
  D --> E[改成当前安装路径]
```

经过查阅和修复，根因为：配置中的 node_repl.exe、node.exe 和 codex.exe 都指向带版本哈希的旧安装目录；其中至少 node_repl.exe 的目录已不存在，因此 Windows 报 os error 3

排查后发现问题在于：当前安装中可用的文件已确认：node_repl.exe ，codex.exe，而原配置的这两个路径都已失效。
更新 .codex/config.toml 中这两个失效引用即可解决。