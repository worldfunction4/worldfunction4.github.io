---
title: Netmiko 网络自动化库
date: 2026-08-19
category:
  - 知识库
  - Python
---
# Netmiko 网络自动化库

## 概述

**Netmiko** 是一个基于 Paramiko 的 Python 库，用于简化网络设备的 SSH/Telnet 连接和命令交互。由 Kirk Byers 开发维护，是网络自动化领域最流行的库之一。

- **官方文档**：<https://ktbyers.github.io/netmiko/>
- **GitHub**：<https://github.com/ktbyers/netmiko>
- **Python 版本支持**：Python 3.8+
- **协议支持**：SSH（默认）、Telnet、Serial（串口）

---

## 安装

```bash
pip install netmiko
```

验证安装：

```python
import netmiko
print(netmiko.__version__)
```

---

## 基本使用流程

### 1. 定义设备参数

```python
device = {
    'device_type': 'cisco_ios',       # 设备类型（必填）
    'host': '192.168.1.1',            # 设备 IP 或域名（必填）
    'username': 'admin',              # 用户名（必填）
    'password': 'cisco',              # 密码
    'port': 22,                       # 端口，默认 22
    'secret': 'enable',               # enable 密码（特权模式）
    'verbose': False,                 # 是否显示详细日志
    'timeout': 30,                    # 连接超时（秒）
    'session_log': 'session.log',     # 会话日志文件
    'global_delay_factor': 1,         # 全局延迟因子
    'use_keys': False,                # 是否使用 SSH 密钥
    'key_file': None,                 # SSH 密钥文件路径
    'conn_timeout': 10,               # TCP 连接超时
    'blocking_timeout': 20,           # 通道读取超时
}
```

### 2. 建立连接并执行命令

```python
from netmiko import ConnectHandler

device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco',
    'secret': 'enable',
}

# 方式一：上下文管理器（推荐，自动断开）
with ConnectHandler(**device) as connect:
    output = connect.send_command('show ip interface brief')
    print(output)

# 方式二：手动管理
connect = ConnectHandler(**device)
try:
    output = connect.send_command('show version')
    print(output)
finally:
    connect.disconnect()
```

---

## 核心方法详解

### 命令发送方法

| 方法 | 用途 | 示例 |
|------|------|------|
| `send_command()` | 发送单个命令，返回字符串 | `connect.send_command('show run')` |
| `send_config_set()` | 发送配置命令列表，进入配置模式 | `connect.send_config_set(['int gi0/1', 'no shut'])` |
| `send_config_from_file()` | 从文件读取配置命令 | `connect.send_config_from_file('config.txt')` |
| `send_multiline()` | 发送多行交互命令 | `connect.send_multiline(['cmd1', 'cmd2'])` |
| `send_command_timing()` | 基于时间等待的命令发送 | `connect.send_command_timing('dir')` |

#### send_command() 常用参数

```python
connect.send_command(
    command_string='show ip route',  # 命令
    expect_string='#',               # 期望的提示符（可选）
    delay_factor=1,                  # 延迟因子
    max_loops=500,                   # 最大循环等待次数
    auto_find_prompt=True,           # 自动检测提示符
    strip_prompt=True,               # 去除提示符
    strip_command=True,              # 去除命令回显
    use_textfsm=True,                # 使用 TextFSM 解析
    use_genie=False,                 # 使用 Cisco Genie 解析
)
```

### 连接状态与方法

```python
connect.is_alive()                    # 检查连接是否存活
connect.disconnect()                  # 主动断开连接
connect.write_channel('command\n')    # 底层写入（不推荐常规使用）
connect.read_channel()                # 底层读取
connect.clear_buffer()                # 清空缓冲区
```

### 特权模式

```python
connect.enable()                      # 进入 enable 模式
connect.exit_enable_mode()            # 退出 enable 模式
connect.check_enable_mode()           # 检查是否在 enable 模式
```

### 其他设备模式

```python
connect.config_mode()                 # 进入全局配置模式
connect.exit_config_mode()            # 退出配置模式
connect.check_config_mode()           # 检查是否在配置模式
```

---

## 支持的设备类型（device_type）

Netmiko 支持 **200+** 种设备类型，常用分类如下：

### 思科系列
| device_type | 说明 |
|-------------|------|
| `cisco_ios` | Cisco IOS / IOS-XE |
| `cisco_xr` | Cisco IOS-XR |
| `cisco_nxos` | Cisco NX-OS |
| `cisco_asa` | Cisco ASA |
| `cisco_wlc` | Cisco WLC |
| `cisco_ftd` | Cisco FTD |

### 华为系列
| device_type | 说明 |
|-------------|------|
| `huawei` | 华为 VRP |
| `huawei_smartax` | 华为 SmartAX OLT |
| `huawei_olt` | 华为 OLT |

### H3C
| device_type | 说明 |
|-------------|------|
| `hp_comware` | H3C Comware 系列 |

### 锐捷
| device_type | 说明 |
|-------------|------|
| `ruijie_os` | 锐捷 RGOS |

### Juniper
| device_type | 说明 |
|-------------|------|
| `juniper_junos` | Juniper Junos |

### 其他常见厂商
| device_type | 说明 |
|-------------|------|
| `arista_eos` | Arista EOS |
| `extreme_exos` | Extreme EXOS |
| `mellanox_os` | Mellanox |
| `brocade_fastiron` | Brocade / Ruckus |
| `fortinet` | Fortinet FortiGate |
| `paloalto_panos` | Palo Alto PAN-OS |

> 查看完整列表：`python -c "from netmiko import platforms; print(platforms())"`

---

## TextFSM 结构化数据解析

Netmiko 内置了与 `ntc-templates` 的集成，可以将命令输出转为结构化数据。

### 安装模板

```bash
pip install ntc-templates
```

配置环境变量（或自动检测）：

```bash
export NET_TEXTFSM=/path/to/ntc-templates/templates
```

### 使用示例

```python
output = connect.send_command('show ip interface brief', use_textfsm=True)
# 返回列表[字典]结构
for intf in output:
    print(f"{intf['intf']} - {intf['ipaddr']} - {intf['status']}")
```

### 示例输出

```python
[
    {'intf': 'GigabitEthernet0/0', 'ipaddr': '192.168.1.1', 'status': 'up', 'proto': 'up'},
    {'intf': 'GigabitEthernet0/1', 'ipaddr': '10.0.0.1', 'status': 'admin down', 'proto': 'down'},
]
```

---

## 异常处理

Netmiko 定义了丰富的异常类，所有异常继承自 `NetmikoBaseException`。

```python
from netmiko import (
    ConnectHandler,
    NetmikoTimeoutException,       # 连接超时
    NetmikoAuthenticationException, # 认证失败
    NetmikoBaseException,          # 基类异常
    ReadException,                 # 读取异常
    ReadTimeout,                   # 读取超时
    WriteException,                # 写入异常
)
```

### 完整的异常处理示例

```python
from netmiko import ConnectHandler, NetmikoTimeoutException, NetmikoAuthenticationException

device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco',
}

try:
    with ConnectHandler(**device) as connect:
        output = connect.send_command('show version')
except NetmikoTimeoutException:
    print(f"设备 {device['host']} 连接超时")
except NetmikoAuthenticationException:
    print(f"设备 {device['host']} 认证失败")
except Exception as e:
    print(f"未知错误: {e}")
```

---

## 批量设备操作

### 从文件读取设备列表

```python
import csv
from netmiko import ConnectHandler

def read_devices_from_csv(filename):
    devices = []
    with open(filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            devices.append({
                'device_type': row['device_type'],
                'host': row['host'],
                'username': row['username'],
                'password': row['password'],
            })
    return devices

for dev in read_devices_from_csv('devices.csv'):
    try:
        with ConnectHandler(**dev) as conn:
            output = conn.send_command('show clock')
            print(f"{dev['host']}: {output}")
    except Exception as e:
        print(f"{dev['host']}: 失败 - {e}")
```

### 使用并发（多线程）

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
from netmiko import ConnectHandler

def backup_config(device):
    with ConnectHandler(**device) as conn:
        return device['host'], conn.send_command('show running-config')

devices = [...]  # 设备列表

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(backup_config, dev): dev for dev in devices}
    for future in as_completed(futures):
        host, config = future.result()
        with open(f'backup_{host}.txt', 'w') as f:
            f.write(config)
            print(f"{host} 配置已备份")
```

---

## 全局延迟因子（delay_factor）

用于解决设备响应慢的问题：

```python
# 全局设置（影响所有方法）
device['global_delay_factor'] = 2

# 或单条命令设置
output = connect.send_command('show run | section ospf', delay_factor=3)
```

---

## 会话日志

```python
# 记录完整会话到文件
device['session_log'] = 'session_output.log'

# 或代码中设置
connect.session_log = open('mysession.log', 'w')
```

---

## 常用场景示例

### 场景一：配置备份

```python
def backup_device(device):
    with ConnectHandler(**device) as connect:
        hostname = connect.send_command('show run | include hostname').split()[-1]
        config = connect.send_command('show running-config')
        filename = f"{hostname}_{datetime.now().strftime('%Y%m%d')}.txt"
        with open(filename, 'w') as f:
            f.write(config)
        return filename
```

### 场景二：批量下发配置

```python
def push_config(device, config_commands):
    with ConnectHandler(**device) as connect:
        connect.enable()
        output = connect.send_config_set(config_commands)
        connect.save()  # 保存配置（write memory）
        return output
```

### 场景三：检查设备健康状态

```python
def health_check(device):
    checks = {}
    with ConnectHandler(**device) as connect:
        checks['hostname'] = connect.send_command('show run | include hostname')
        checks['version'] = connect.send_command('show version', use_textfsm=True)
        checks['interfaces'] = connect.send_command('show ip int brief', use_textfsm=True)
        checks['cpu'] = connect.send_command('show processes cpu')
        checks['memory'] = connect.send_command('show memory')
    return checks
```

---

## 注意事项与最佳实践

| 要点 | 说明 |
|------|------|
| ✅ **使用上下文管理器** | `with ConnectHandler(...)` 确保自动断开 |
| ✅ **捕获异常** | 始终捕获 `NetmikoTimeoutException` 和 `NetmikoAuthenticationException` |
| ✅ **设置超时** | 避免连接卡死，合理设置 `timeout` |
| ✅ **使用结构化解析** | `use_textfsm=True` 让输出更易处理 |
| ❌ **避免频繁连接** | 重用连接对象，减少 TCP 握手开销 |
| ❌ **不要硬编码密码** | 使用环境变量、Vault 或外部密钥管理 |
| ✅ **日志记录** | 开启 `session_log` 便于排错 |
| ✅ **控制并发数** | 不要一次开太多 SSH 连接，建议 10-20 并发 |

---

## 与 Paramiko 的关系

```
Paramiko（底层 SSH 协议库）
    └── Netmiko（网络设备交互封装）
        ├── 自动处理设备提示符
        ├── 自动处理分页（more）
        ├── 自动处理特权模式
        ├── 设备类型识别
        └── TextFSM 结构化输出
```

Netmiko 本质上是对 Paramiko 的二次封装，针对网络设备做了大量**自动化和智能化**处理，无需手动处理 `more` 分页、等待提示符等繁琐操作。

---

## 快速参考（速查表）

```python
# 导入
from netmiko import ConnectHandler, platforms

# 获取所有支持平台
print(platforms())

# 建立连接
conn = ConnectHandler(**device)

# 常用命令
conn.send_command('show version')
conn.send_command('show ip int brief', use_textfsm=True)
conn.send_config_set(['int loopback0', 'ip addr 1.1.1.1 255.255.255.255'])
conn.save()            # write memory
conn.disconnect()      # 手动关闭连接

# 检查连接
conn.is_alive()
```

---

> **学习建议**：先掌握 `send_command()` 和 `send_config_set()` 两个核心方法，再逐步学习 TextFSM 解析、并发控制和异常处理，就能应对大多数网络自动化场景。
