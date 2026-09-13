---
title: 被低估的 Windows Powershell
date: 2026-08-19
category:
  - 知识库
  - 计算机网络
  - 网络安全
---
# 被低估的 Windows Powershell

在研究网络安全的时候，查阅资料时发现powershell居然自带很多“黑客”工具！于是我便把它们记录了下来：

## 开篇：为什么 PowerShell 能做这个？

PowerShell 底层可以调用 **.NET Framework 的全部类库**（.NET 的 `System.Net.Sockets` 能直接操作 TCP/UDP/原始套接字），还能通过 **COM 对象** 调用 WMI / 网络适配器 API。换句话说，PowerShell 就是一把被 Windows 系统管理员身份掩盖了的渗透测试利器。

下面按「从简单到变态」排列。

---

## 一、ICMP Ping Sweep（最简单的入门方式）

Powershell

# 基础版：一个 for 循环扫 /24

1..254 | ForEach-Object {

    $ip = "192.168.1.$_"

    if (Test-Connection -ComputerName $ip -Count 1 -Quiet) {

        Write-Host "[+] $ip 存活" -ForegroundColor Green

    }

}

### 原理

`Test-Connection` 就是 PowerShell 版的 ping。`-Quiet` 让它只返回 `$true` / `$false`，适合做条件判断。

### 问题

慢。每次 `Test-Connection` 默认有 4 秒超时，扫完 /24 理论最长时间是 254×4÷60≈**17 分钟**。等扫完室友都打完三把了。

### 加速版：并发 Ping

Powershell

# 用后台 Job 并发

1..254 | ForEach-Object {

    Start-Job -ScriptBlock {

        param($ip)

        if (Test-Connection $ip -Count 1 -Quiet) { $ip }

    } -ArgumentList "192.168.1.$_"

} | Wait-Job | Receive-Job

或者更现代的做法——**用 `ForEach-Object -Parallel`（PowerShell 7+）**：

Powershell

# PowerShell 7 并发扫，几秒出结果

1..254 | ForEach-Object -Parallel {

    $ip = "192.168.1.$_"

    if (Test-Connection $ip -Count 1 -TimeoutSeconds 1 -Quiet) {

        "[在线] $ip"

    }

} -ThrottleLimit 50

`-ThrottleLimit 50` 表示同时跑 50 个 ping。扫完 /24 只需要 **5~8 秒**。

---

## 二、PowerShell 直接看 ARP 表（半被动）

这是很多人不知道的技巧——Windows 本身**一直在维护 ARP 缓存**。你插上网线的那一刻，Windows 就会自动发 ARP 请求找默认网关，而且会收到网络里大量的广播 ARP。所以你根本不用主动扫，直接看缓存就行：

Powershell

# 基础命令

arp -a

# PowerShell 用 .NET API 读得更细

Get-NetNeighbor -AddressFamily IPv4 | 

    Where-Object State -ne 'Unreachable' |

    Select-Object IPAddress, LinkLayerAddress, State

只要攻击者开机 30 秒后执行这条命令，就能看到：

- 网关的 IP + MAC
- 室友的 IP + MAC（只要室友在这期间发过广播/ARP）
- 甚至能看到其他寝室的设备（如果没做 VLAN 隔离）

### 这招有多隐蔽？

**零主动发包。** 攻击者没有发送任何扫描包，只是读取了系统本地的 ARP 缓存表。从网络流量上看，攻击者是完全静默的。

### 更进一步：通过 WMI 直接读 ARP 缓存

Powershell

Get-WmiObject -Class MSFT_NetNeighbor -Namespace root/StandardCimv2 |

    Where-Object { $_.AddressFamily -eq 2 } |

    Select-Object IPAddress, LinkLayerAddress

---

## 三、PowerShell 做 TCP 端口扫描（.NET Socket）

这就开始有意思了。PowerShell 可以直接 new 一个 .NET 的 `TcpClient` 对象去连端口：

Powershell

# 单端口检测

$tcp = New-Object System.Net.Sockets.TcpClient

$result = $tcp.BeginConnect("192.168.1.5", 445, $null, $null)

if ($result.AsyncWaitHandle.WaitOne(300)) {

    Write-Host "[+] 192.168.1.5:445 开放 (SMB)"

}

$tcp.Close()

### 全端口扫描脚本（并发版）

```Powershell

function Invoke-PortScan {

    param($Target, $Ports = 1..1024, $Timeout = 200)

    $Ports | ForEach-Object -Parallel {

        $client = New-Object System.Net.Sockets.TcpClient

        $async = $client.BeginConnect($using:Target, $_, $null, $null)

        if ($async.AsyncWaitHandle.WaitOne($using:Timeout)) {

            "[OPEN] $($using:Target):$_"

        }

        $client.Close()

    } -ThrottleLimit 100

}
```

# 扫室友 IP 的常用端口

Invoke-PortScan -Target "192.168.1.5" -Ports @(22,53,80,135,139,443,445,3389,8080,27015)

`27015` 是 Source 引擎游戏（CS/CSGO）的默认端口，如果开放说明室友可能在打 CS。

---

## 四、PowerShell 做 UDP 探测

Powershell

# UDP 探测：发一个空 UDP 包，如果收到 ICMP Port Unreachable → 主机在线

```powershell
$udp = New-Object System.Net.Sockets.UdpClient

$udp.Client.ReceiveTimeout = 500

$udp.Connect("192.168.1.5", 1)

[byte[]]$empty = @()

$udp.Send($empty, 0)

try {

    $remote = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Any, 0)

    $data = $udp.Receive([ref]$remote)  # 不会收到数据，但会触发 ICMP error

} catch {

    # 如果收到 ICMP Port Unreachable → 主机在线

    Write-Host "[+] 192.168.1.5 UDP 探测：主机在线"

}
```

---

## 五、PowerShell 读 NetBIOS 信息（Windows 内部侦察）

Powershell

# 用 nbtstat（PowerShell 可直接调）

nbtstat -A 192.168.1.5

# 或者用 WMI 远程查询

Get-WmiObject -Class Win32_ComputerSystem -ComputerName 192.168.1.5

`nbtstat -A` 能直接爆出：

Text

名称               类型         状态

----------------------------------------

DESKTOP-LISI      <00>  唯一       已注册       ← 计算机名

WORKGROUP         <00>  组         已注册       ← 工作组

DESKTOP-LISI      <20>  唯一       已注册       ← 文件共享服务开启

LISI              <03>  唯一       已注册       ← 当前登录用户名！

**注意最后一列**：`<03>` 类型就是当前登录用户名。攻击者直接看到室友的 Windows 登录名，瞬间锁定。

---

## 🛡 防御措施

|攻击手段|室友的防御|
|---|---|
|ICMP Ping Sweep|Windows 防火墙默认阻止入站 ICMP（已生效）|
|读取 ARP 表|**无法阻止**，只要在同一广播域，ARP 通信必然发生|
|TCP 端口扫描|关掉不必要的服务：`services.msc` 禁用 SSDP、Function Discovery；`netstat -an` 检查开放端口|
|NetBIOS 泄露|**网络适配器 → IPv4 属性 → 高级 → WINS → 禁用 NetBIOS over TCP/IP**|
|WMI 远程查询|Windows 防火墙默认禁止 WMI 入站（已生效）；确认 `Windows Management Instrumentation` 入站规则为阻止|

---

## 六、进阶：PowerShell 调用 Win32 API 做 ARP 扫描

这是真正硬核的部分。PowerShell 可以通过 **C# 内联代码**（Add-Type）直接调用 `iphlpapi.dll` 里的 `SendARP` 函数：


```Powershell

Add-Type -TypeDefinition @"

using System;

using System.Runtime.InteropServices;

public class Native {

    [DllImport("iphlpapi.dll", ExactSpelling = true)]

    public static extern int SendARP(uint DestIP, uint SrcIP, byte[] pMacAddr, ref int PhyAddrLen);

}

"@

function Send-ARP {

    param($IP)

    $dest = [System.Net.IPAddress]::Parse($IP)

    $destBytes = $dest.GetAddressBytes()

    [Array]::Reverse($destBytes)

    $destInt = [BitConverter]::ToUInt32($destBytes, 0)

    $mac = New-Object byte[] 6

    $len = 6

    $result = [Native]::SendARP($destInt, 0, $mac, [ref]$len)

    if ($result -eq 0) {

        $macString = ($mac | ForEach-Object { $_.ToString("X2") }) -join ":"

        return @{ IP = $IP; MAC = $macString }

    }

}
```

# 扫整个 /24

1..254 | ForEach-Object { Send-ARP "192.168.1.$_" } | Where-Object { $_ } | Format-Table

这样就实现了一个**完全不依赖任何外部工具的 ARP 扫描器**，只用了 Windows 自带的 PowerShell + .NET + Win32 API。

---

## 七、终极：PowerShell 实现 SYN 半开扫描（需要管理员权限）

Powershell

# 用 .NET Socket 构造原始 TCP SYN 包

$sock = New-Object System.Net.Sockets.Socket(

    [System.Net.Sockets.AddressFamily]::InterNetwork,

    [System.Net.Sockets.SocketType]::Raw,

    [System.Net.Sockets.ProtocolType]::Tcp

)

# ... 手动构造 IP 头 + TCP 头 + SYN flag ...

这个比较复杂，代码量大，而且 Windows 10 1709+ 对原始套接字的限制越来越严，实际可操作性不如直接用 nmap。但技术上说，PowerShell 是**可以**做到的。

---

## 总结：攻击者的 PowerShell 工具箱

|需求|PowerShell 命令|特点|
|---|---|---|
|快速存活扫描|`Test-Connection` 并发|快，但被防火墙拦|
|静默发现邻居|`arp -a` / `Get-NetNeighbor`|零流量，完全隐蔽|
|TCP 端口探测|`New-Object TcpClient`|不依赖外部工具|
|NetBIOS 信息收集|`nbtstat -A`|直接爆用户名|
|原生 ARP 扫描|Add-Type + SendARP|纯 Win32 API，无依赖|
|综合侦察脚本|上述组合拳|内网渗透的标配姿势|

攻击者真正的优势是：**这些东西在 Windows 上是"正常"的系统管理功能，杀毒软件/EDR 不会对 `Test-Connection` 或 `Get-NetNeighbor` 报警。** 这也是为什么 PowerShell 被叫做「APT 的最爱」。