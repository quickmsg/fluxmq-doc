# FAQ

## 采用数据库存储，如何从`2.0.17`版本升级到`2.0.18`?

### MYSQL存储升级

在2.0.17版本存储的数据库中执行一下指令即可：
```sql

ALTER TABLE `PolicyModel` ADD `f_http_model`  TEXT;

ALTER TABLE `LogTrace` ADD `f_timezone`  int(5) DEFAULT 0;

ALTER TABLE `ProxySubConfig` ADD `f_enable`  bit(1) DEFAULT 0;

```



## 集群新增节点、下线节点需要重启集群吗？

当集群新增节点时候，只需要新增的节点配置已启动集群节点的任一IP,即可完成集群的动态接入，无需重源节点机器

## FluxMQ同一个ClientID集群中可以重复连接吗？

FluxMQ默认同一集群采用互踢策略，一个ClientID同一时间只允许一个在线，后者会将前者剔除下线

## 部署集群安全组需要打开哪些端口？
- 48880 集群eventbus内部通信端口
- 48500 缓存同步端口
- 47100 集群内部通信端口


## 支持proxy_protocol透传客户端ip等信息吗？

FluxMQ支持开启proxy_protocol解析，解析后的连接的ip会自动被proxy_protocol头携带的源IP覆盖

```YAML
mqtt: # tcp配置
  port: 1887 # mqtt端口号
  wiretap: false  # 二进制日志 前提是 logLevel = DEBUG
  messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
  proxy: false # 默认false, 支持HAProxy协议解析  
  options:
    SO_BACKLOG: 2000
```