---
title: EGP
date: 2026-08-19
category:
- 计算机网络
tag:
- EGP
---
# EGP

<!-- more -->

外部网关协议（Exterior Gateway Protocol）：**自治系统（AS）之间**交换路由。AS 内部用 [IGP协议](IGP协议.md)，AS 之间用 EGP。

历史上有过一个就叫 EGP 的协议，已经不用了。现在说 EGP，实际就是 **BGP**（Border Gateway Protocol）。互联网上每个运营商、大企业一个 AS，靠 BGP 告诉别人「这些前缀走我」。

和 IGP 的差别：IGP 求的是 AS 内最快/最短；BGP 求的是策略（跟谁 peer、宣布哪些前缀、优先哪条上游），不是把全网拓扑算一遍。

相关：[IGP协议](IGP协议.md)、[OSPF](OSPF.md)
