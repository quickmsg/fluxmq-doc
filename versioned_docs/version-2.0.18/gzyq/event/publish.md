# 消息发布事件

## 发布事件 ("$EVENT.PUBLISH")

当消息被放入底层socket时触发规则。

| **字段**    | **解释**                                                 |
|-----------|--------------------------------------------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息                                    |
| id        | 消息唯一标识,客户端publish会生成唯一Id,当qos>0时候，Ack消息会携带此id，代表一次完成应答操作 |
| payload   | MQTT 消息体                                               |
| messageId | MQTT 消息 ID                                             |
| topic     | MQTT 主题                                                |
| qos       | MQTT 消息的 QoS                                           |
| retain    | MQTT 消息是否保持                                            |
| timestamp | 事件触发时间 (单位：毫秒)                                         |
| clientId  | 客户端 ID                                                 |
| clientIp  | 客户端的IP地址                                        |
| nodeIp    | 事件触发所在节点IP地址                                      |

示例

```plsql
select
  *
from
  "$EVENT.PUBLISH"
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
  "nodeIp": "192.168.1.12"
}
```