# 系统优化

## 操作系统参数优化

### 内存分配策略

> 必须修改


编辑: vim /etc/sysctl.conf

```shell    
vm.overcommit_memory=1
```

执行`sysctl -p`刷新

### 系统全局最大文件句柄
```shell    
sysctl -w fs.file-max=1048576
sysctl -w fs.nr_open=1048576
echo 1048576 > /proc/sys/fs/nr_open
```
### 临时会话最大文件句柄
```shell
ulimit -n 1048576
```
### 系统全局最大文件句柄 

编辑修改 /etc/sysctl.conf: 
```shell
fs.file-max = 1048576
```
###  设置服务的最大文件句柄

编辑修改 /etc/systemd/system.conf:
```shell
DefaultLimitNOFILE=1048576
```     

###  设置用户的最大文件句柄、最大文件句柄数
编辑修改  /etc/security/limits.conf:
```shell
* soft nofile 1048576   
* hard nofile 1048576
```
## Tcp网络优化
### 并发连接优化
```shell
sysctl -w net.core.somaxconn=32768
sysctl -w net.ipv4.tcp_max_syn_backlog=16384
sysctl -w net.core.netdev_max_backlog=16384
```
### 端口使用范围
```shell
sysctl -w net.ipv4.ip_local_port_range='1000 65535'
```

