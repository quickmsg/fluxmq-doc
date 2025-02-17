# 离线消息事件

## 离线消息事件 ("$EVENT.OFFLINE")

> 离线消息必须是Qos=1或者Qos=2的消息

- 当客户端发布的消息没有客户端订阅时，那么此消息被定义为离线消息
- ACK未确认的qos=1或者qos=2的消息，也会被定义为离线消息


| **字段**    | **解释**           |
|-----------|------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息 |
| id        | 消息唯一标识           |
| payload   | MQTT 消息体         |
| messageId | MQTT 消息 ID       |
| topic     | MQTT 主题          |
| qos       | MQTT 消息的 QoS     |
| retain    | MQTT 消息是否保持      |
| timestamp | 事件触发时间 (单位：毫秒)   |
| clientId  | 客户端 ID           |
| clientIp  | 客户端的IP地址     |
| nodeIp    | 事件触发所在节点IP地址 |

示例

```plsql
select
  *
from
  "$EVENT.OFFLINE"
```

输出

```json
{
  "protocol": "MQTT",
  "id": "8ace2bbab65b4fb1a0afc7c77419e6b5",
  "payload": {},
  "messageId": 1,
  "topic": "test",
  "qos": 1,
  "retain": false,
  "timestamp": "1690599987495",
  "clientId": "A1212313",
  "clientIp": "183.136.225.31",
  "nodeIp": "192.168.1.1"
}
```