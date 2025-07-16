# 连接事件

## 建立连接事件 ("$EVENT.CONNECT")

当客户端连接成功时触发规则。

| **字段**           | **解释**           |
|------------------|------------------|
| protocol         | 协议标识，用于区分是哪个协议上报的消息 |
| clientIp         | 客户端的IP地址    |
| nodeIp           | 事件触发所在节点IP地址 |
| version          | 使用的协议 版本         |
| keepalive        | MQTT 保活间隔        |
| cleanSession     | 是否清空会话           |
| auth.username    | 客户端用户名           |
| auth.password    | 客户端密码            |
| will.isRetain    | 遗嘱消息是否保持         |
| will.willTopic   | 遗嘱消息主题           |
| will.willQos     | 遗嘱消息语义级别         |
| will.willMessage | 遗嘱消息内容           |
| timestamp        | 事件触发时间 (单位：毫秒)   |
| clientId         | 客户端 ID           |

示例

```plsql
select
  *
from
  "$EVENT.CONNECT"
```

输出

```json
{
  "protocol": "MQTT",
  "clientIp": "192.168.0.100",
  "nodeIp": "127.0.0.1",
  "version": "MQTT_3_1",
  "keepalive": 120,
  "cleanSession": false,
  "auth": {
    "username": "fluxmq",
    "password": "fluxmq"
  },
  "will": {
    "isRetain": false,
    "willTopic": "willTest",
    "willQos": 1,
    "willMessage": ""
  },
  "timestamp": "1690599987495",
  "clientId": "A1212313"
}
```