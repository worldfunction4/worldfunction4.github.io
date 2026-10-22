---
title: ISIS
date: 2026-08-19
category:
- 计算机网络
tag:
- ISIS
---
# ISIS

<!-- more -->

ISIS（Intermediate System to Intermediate System，中间系统到中间系统）是一种**链路状态**的 [IGP协议](IGP协议.md)，和 [OSPF](OSPF.md) 一类：每台路由器有全网拓扑，自己跑 SPF，而不是像 [RIP](RIP.md) 那样只听邻居「方向 + 跳数」。

它最早跑在 ISO 的 CLNP 上，后来加上 IP（Integrated IS-IS），运营商骨干用得很多。企业网更常见 OSPF，但对比 RIP 时经常和 OSPF 一起被点名。

和 OSPF 容易混的几点：

| | OSPF | ISIS |
|---|---|---|
| 分层 | Area，必须有 Area 0 骨干 | Level-1（区域内）/ Level-2（骨干） |
| 报文 | 直接跑在 IP 上（协议号 89） | 直接跑在二层（不靠 IP） |
| 优先级 | 华为默认 10 | 华为默认 15（数值越小越优先） |
| 网络类型 | 广播 / NBMA / P2P 等较碎 | 主要当广播或点到点 |

IS 就是路由器。邻居用 Hello，拓扑用 LSP（链路状态 PDU）泛洪，数据库对齐后再算路。防环靠的是每台设备同一张图，不是 RIP 那套水平分割。

相关：[OSPF](OSPF.md)、[RIP](RIP.md)、[IGP协议](IGP协议.md)、[路由器](../关于物理设备/路由器.md)
