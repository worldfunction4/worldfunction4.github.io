---
title: WSL2无法安装
date: 2026-08-19
category:
  - 知识库
  - 遇到的一些问题
---
今天打算试一下WSL，但当我兴冲冲地准备去安装时，却遇到了以下问题：

     WSL2 安装 Ubuntu 时报错：
    HCS_E_HYPERV_NOT_INSTALLED
    意思是 HCS（Host Compute Service，宿主计算服务）无法创建虚拟机，因为 Hypervisor 没有运行。

按理说我打开了虚拟化服务，而且也在BIOS中打开了应该是正常的，那为什么还会出现这种事情呢？经过一番查阅，我才知道，首先我们需要先明确一个问题：
**WSL2 的工作原理是什么？** 

WSL2 不像 WSL1 那样做系统调用翻译，它运行一个真正的 Linux 内核，跑在一个轻量级的 Hyper-V
    虚拟机里。所以它必须依赖 Windows 的 Hypervisor 才能工作。

那么是如何排查的呢？
排查分三层，逐层深入：

    第一层：功能检查
    - Microsoft-Windows-Subsystem-Linux → ✅ 已启用
    - VirtualMachinePlatform → ✅ 已启用
    - Microsoft-Hyper-V-All → 最初 ❌ 未启用

    第二层：启用 Hyper-V 后仍然失败
    我们启用了 Hyper-V 功能并重启，但 HyperVisorPresent 仍然是 False。这说明功能装了，但 Hypervisor 并没有在启动时加载。

    第三层：启动配置检查（关键一步）
    运行 bcdedit /enum 发现：
    hypervisorlaunchtype    Off

    这就是根因 —— Windows 的引导配置数据（BCD）里，Hypervisor 的启动类型被设为了 Off，所以即使 Hyper-V
    功能全部安装好了，Windows 开机时也不会加载 Hypervisor。

然后我又去查了查为什么会被设置为off：
1. 第三方虚拟化软件（VMware Workstation、VirtualBox 旧版）会主动关闭它，因为它们和 Hyper-V 的 Hypervisor 冲突
2. 排查蓝屏时手动关闭过
3. 某些反作弊软件（如游戏反作弊）也可能修改这个设置

综上所示，应该是我此前安装的VMware或者VirtualBox导致的这个问题。 这是一个 BCD（Boot Configuration Data）级别的设置，和 Windows 功能开关是独立的两套机制，所以启用 Hyper-V
功能并不会自动把它改回来。

至于是如何解决的...
一条命令：`bcdedit /set hypervisorlaunchtype auto`。将 Hypervisor 启动类型从 Off 改为 Auto，重启后 Windows 就会在开机时加载 Hypervisor，WSL2 就能正常创建虚拟机运行Linux 了。
