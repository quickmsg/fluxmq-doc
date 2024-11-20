# 连接断开事件

## 连接断开事件 ("$EVENT.CLOSE")

当服务端关闭连接时触发规则。

| **字段**    | **解释**            |
|-----------|-------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息 |
| messageId | MQTT 消息 ID        |
| reason    | 连接断开原因描述          |
| clientId  | 客户端 ID            |
| timestamp | 事件触发时间            |
| clientIp  | 客户端的IP地址      |
| nodeIp    | 事件触发所在节点IP地址  |

`reason`连接断开原因：

| **字段**         | **解释**      |
|----------------|-------------|
| normal         | 客户端关闭       |
| kicked         | 服务端主动关闭     |
| timeout        | 客户端心跳超时关闭   |
| not_authorized | 认证失败关闭      |
| other_kicked   | 集群互踢        |
| disconnect     | 客户端主动关闭     |
| receive_maximum_exceeded     | qos2窗口满连接关闭 |

示例

```plsql
select
  *
from
  "$EVENT.CLOSE"
```

输出

```json
{
  "protocol": "MQTT",
  "messageId": 1,
  "reason": "",
  "timestamp": "1690599987495",
  "clientId": "A1212313",
  "clientIp": "183.136.225.31",
  "nodeIp": "192.168.1.1"
}
```