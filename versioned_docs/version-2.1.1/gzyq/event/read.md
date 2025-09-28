# 介绍

## SQL 事件类型与字段
规则的 SQL 语句可以处理 MQTT事件 消息，或者是具有数据流入能力的数据桥接。<br />SQL 语句使用 FROM 来指定 MQTT事件，在 SELECT 和 WHERE 子句中可以引用相应的字段。 <br />数据源类型不同，可以使用的字段也不同。

## 客户端事件
规则的 SQL 语句可以处理事件(发布消息、客户端上下线、客户端订阅等)，FROM 子句后面跟事件主题。<br />事件主题以 $EVENT/ 开头，比如 $EVENT.PUBLISH,$EVENT.SUBSCRIBE 。

| **事件名称** | **事件主题名**          | **释义**    |
|----------|--------------------|-----------|
| 发布事件     | $EVENT.PUBLISH     | 发布消息      |
| 订阅事件     | $EVENT.SUBSCRIBE   | 订阅成功消息    |
| 取消订阅事件   | $EVENT.UNSUBSCRIBE | 取消订阅成功消息  |
| 发布回复事件   | $EVENT.ACK         | 消息接收成功并回复 |
| 心跳事件     | $EVENT.PING        | 连接保活心跳消息  |
| 取消连接事件   | $EVENT.DISCONNECT  | 客户端主动断开连接 |
| 连接断开事件   | $EVENT.CLOSE       | 服务端关闭连接   |
| 建立连接事件   | $EVENT.CONNECT     | 连接成功      |
| 离线消息事件   | $EVENT.OFFLINE     | 离线期间接收的消息 |
