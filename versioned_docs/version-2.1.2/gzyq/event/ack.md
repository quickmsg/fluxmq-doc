# 消息确认事件

## 发布回复事件 ("$EVENT.ACK")

当消息发送到客户端，并收到客户端回复的ack时触发规则，仅QOS1，QOS2会触发。

| **字段**    | **解释**                                                 |
|-----------|--------------------------------------------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息                                    |
| id        | 消息唯一标识,客户端publish会生成唯一Id,当qos>0时候，Ack消息会携带此id，代表一次完成应答操作 |
| payload   | MQTT 消息体                                               |
| messageId | MQTT 消息 ID                                             |
| topic     | MQTT 主题                                                |
| qos       | MQTT 消息的 QoS                                           |
| timestamp | 事件触发时间 (单位：毫秒)                                         |
| clientId  | 客户端 ID                                                 |
| clientIp  | 客户端的IP地址                                               |
| nodeIp    | 事件触发所在节点IP地址                                    |
| desc      | 回复描述，用于区分qos1,2消息回复                                    |

* desc字段枚举

| **字段** | **解释**    |
|--------|-----------|
| ack    | QoS1 回复   |
| rec    | QoS2 发布确认 |
| comp   | QoS2 发布完成 |

示例

```plsql
select
  *
from
  "$EVENT.ACK"
```

输出

```json
{
  "protocol": "MQTT",
  "id": "8ace2bbab65b4fb1a0afc7c77419e6b5",
  "messageId": 10001,
  "clientId": "A1212313",
  "payload": {},
  "topic": "test",
  "qos": 1,
  "timestamp": "1690599987495",
  "clientIp": "183.136.225.31",
  "nodeIp": "192.168.1.1",
  "desc": "ack"
}
```