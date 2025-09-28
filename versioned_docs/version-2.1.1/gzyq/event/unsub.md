# 取消订阅事件

## 客户端取消订阅成功事件 ("$EVENT/UNSUBSCRIBE")
当客户端取消订阅成功时触发规则。

| **字段**    | **解释**           |
|-----------|------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息                                    |
| messageId | MQTT 消息 ID       |
| topic     | MQTT 主题          |
| clientId  | 客户端 ID           |
| timestamp | 事件触发时间           |
| clientIp  | 客户端的IP地址    |
| nodeIp    | 事件触发所在节点IP地址 |

示例
```plsql
select
  *
from
  "$EVENT.UNSUBSCRIBE"
```
输出
```json
{
  "protocol": "MQTT",
  "messageId": 1,
  "topic": "test",
  "clientIp": "183.136.225.31:21950",
  "timestamp": "1690599987495",
  "clientId": "A1212313",
  "nodeIp": "192.168.1.1"
}
```