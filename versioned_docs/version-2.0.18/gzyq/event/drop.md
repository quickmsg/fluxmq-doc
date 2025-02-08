# 丢弃消息事件

## 丢弃消息事件 ("$EVENT.DROP")

- 写入背压消息
- ACK未确认消息


| **字段**    | **解释**              |
|-----------|---------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息 |
| id        | 消息唯一标识              |
| payload   | MQTT 消息体            |
| messageId | MQTT 消息 ID          |
| topic     | MQTT 主题             |
| qos       | MQTT 消息的 QoS        |
| retain    | MQTT 消息是否保持         |
| timestamp | 事件触发时间 (单位：毫秒)      |
| clientId  | 客户端 ID              |
| clientIp  | 客户端的IP地址            |
| nodeIp    | 事件触发所在节点IP地址        |
| type      | 丢弃类型                |



| **type 字段** | **解释**                                                                                 |
|----------|----------------------------------------------------------------------------------------|
| message  | qos2消息，fluxmq发送pubrec报文未收到客户端的pubrel后，消息会被标记成此类型                                       |
| delivered       | 消息投递丢失，主要有以下几个原因<br/> 1. 写入背压（限流，高水位限制）<br/> 2. qos2消息发送pubrel后未收到pubcomp消息，消息会被标记成此类型 |


示例

```plsql
select
  *
from
  "$EVENT.DROP"
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
  "nodeIp": "192.168.1.1",
  "type": "delivered"
}
```

