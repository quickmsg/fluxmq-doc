# FAQ

## 采用数据库存储，如何从`2.0.16`版本升级到`2.0.17`?

### MYSQL存储升级
在2.0.16版本存储的数据库中执行一下指令即可：
```sql
DROP TABLE IF EXISTS `DelayMessage`;
CREATE TABLE `DelayMessage`  (
                                 `id` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `f_client_id` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                 `f_topic` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
                                 `f_qos` tinyint(5) NULL DEFAULT NULL,
                                 `f_retain` bit(1) NULL DEFAULT NULL,
                                 `f_execute_node` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
                                 `f_body` blob NULL,
                                 `f_delay_duration` bigint(20) NULL DEFAULT NULL,
                                 `f_submit_timestamp` bigint(20) NULL DEFAULT NULL,
                                 PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;
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