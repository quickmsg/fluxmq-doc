# WEBSOCKET

WebSocket 协议是一种基于 TCP 协议的通信协议，它可以在客户端和服务器之间建立双向通信的连接，实现实时数据传输和交互操作。在Web应用程序中，WebSocket 协议可以替代 HTTP 协议的长轮询和短轮询技术，提供更高效和快速的通信方式。

## 启动插件
![img.png](@site/static/images/protocol/websocket/img.png)
### 设置端口

### 设置连接HTTP的PATH

PATH必须包含\{变量名称\}  用于解析客户端ID，每个连接的客户端ID必须唯一。

## 建立连接

可以通过MQTT给下行Topic写入消息，FluxMQ会将数据在集群中路由，并且写给对应的Websocket连接
![img_1.png](@site/static/images/protocol/websocket/img_1.png)

## 查看连接
> 连接的设备ID为Websocket连接的PATH占位符

![img_2.png](@site/static/images/protocol/websocket/img_2.png)

## 查看订阅
![img_3.png](@site/static/images/protocol/websocket/img_3.png)
![img_4.png](@site/static/images/protocol/websocket/img_4.png)

## MQTT.FX建立MQTT连接、订阅

![img_5.png](@site/static/images/protocol/websocket/img_5.png)

## 写WEBSOCKET

![img_7.png](@site/static/images/protocol/websocket/img_7.png)
![img_8.png](@site/static/images/protocol/websocket/img_8.png)

## 读WEBSOCKET
![img_9.png](@site/static/images/protocol/websocket/img_9.png)
![img_10.png](@site/static/images/protocol/websocket/img_10.png)
![img_11.png](@site/static/images/protocol/websocket/img_11.png)

