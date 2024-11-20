# 取消连接事件 ("$EVENT/DISCONNECT")

当客户端连接断开时触发规则。

| **字段**   | **解释**           |
|----------|------------------|
| protocol  | 协议标识，用于区分是哪个协议上报的消息                                    |
| clientId | 客户端 ID           |
| time     | 事件触发时间           |
| clientIp | 客户端的IP地址     |
| nodeIp   | 事件触发所在节点IP地址 |

示例

```plsql
select
  *
from
  "$EVENT.DISCONNECT"
```

输出

```json
{
  "protocol": "MQTT",
  "clientId": "A1212313",
  "time": "2022 12-22 12:00:00",
  "clientIp": "183.136.225.31",
  "nodeIp": "192.168.1.1"
}
```