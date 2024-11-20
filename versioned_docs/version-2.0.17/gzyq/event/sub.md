# 订阅事件

## 订阅事件 ("$EVENT/SUBSCRIBE")

当客户端订阅成功时触发规则。

| **字段**    | **解释**            |
|-----------|-------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息 |
| messageId | MQTT 消息 ID        |
| topic     | MQTT 主题           |
| qos       | MQTT 消息的 QoS      |
| clientId  | 客户端 ID            |
| timestamp | 事件触发时间            |
| clientIp  | 客户端的IP地址     |
| nodeIp    | 事件触发所在节点IP地址  |

示例

```plsql
select
  *
from
  "$EVENT.SUBSCRIBE"
```

输出

```json
{
  "protocol": "MQTT",
  "messageId": 1,
  "topic": "test",
  "qos": 1,
  "clientIp": "183.136.225.31:21950",
  "timestamp": "1690599987495",
  "clientId": "A1212313",
  "nodeIp": "192.168.1.12"
}
```