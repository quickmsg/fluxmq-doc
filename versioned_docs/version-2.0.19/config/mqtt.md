# MQTT配置
> 支持配置多个端口

| 参数名                    | 描述                                          | 默认值                     |
|------------------------|---------------------------------------------|-------------------------|
| port                   | mqtt启动的监听端口                                 | 必填项                     |
| wiretap                | 打印二进制日志，生产环境禁止使用                            | 默认: false               |
| exclusivePool                | 使用独立线程池                                     | 默认: false               |
| messageMaxSize         | 单个推送最大的负载字节数                                | 默认:  512 * 1024 = 512kb |
| proxy                  | proxy_protocol协议解析                          | 默认不启用                   |
| options                | netty 的options配置                            | 不推荐配置                   |
| childOptions           | netty 的child channel options配置              | 不推荐配置                   |
| enableAuth             | 是否开启认证                                      | 默认开启                    |
| enableAcl              | 是否开启ACL                                     | 默认开启                    |
| enableBridge           | 是否开启数据桥接                                    | 默认开启                    |
| maxSendWindowSize      | 单个连接发送确认消息窗口（qos1+qos2）                     | 默认 100                  |
| maxReceiveWindowSize   | 单个连接接收确认窗口（qos2）                            | 默认 100                  |
| maxConnectionPerSecond | 连接速率                                        | 默认 1000/s               |
| sessionPersistence     | 开启session消息持久化，建议使用离线消息，                    | 默认不开启                   |
| maxSessionSize         | 前提开启sessionPersistence生效                    | 默认100                   |
| useWebsocket           | 开启mqtt over websocket                       | 默认不开启                   |
| path                   | 开启mqtt over websocket前提下，设置websocket连接的path | 默认 /mqtt                |
| ssl                   | 证书配置                                        | 默认 空                    |
| aclRefreshPeriod                   | acl加载ttl时间                                  | 默认 60(秒)                |

## MQTT配置

```yaml
mqtt:
  - port: 1883 # mqtt端口号
    wiretap: false  # 二进制日志
    messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
    proxy: false # 是否开启proxy协议
    enableAuth: true #  是否开启认证
    enableAcl: true  #  是否开启ACL  
    enableBridge: true #  是否开启桥接（规则引擎） 
    maxSendWindowSize: 100 #  单个连接发送确认消息窗口（qos1+qos2）
    maxReceiveWindowSize: 100 # 单个连接接收确认窗口（qos2）
    maxConnectionPerSecond: 1000  # 连接速率 
    sessionPersistence: false  # 开启session消息持久化，建议使用离线消息
    maxSessionSize: 100  # 开启session后 单个连接持久化最大消息数
```
## MQTTS配置

```yaml
mqtt:
  - port: 1883 # mqtt端口号
    wiretap: false  # 二进制日志
    messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
    proxy: false # 是否开启proxy协议
    enableAuth: true #  是否开启认证
    enableAcl: true  #  是否开启ACL  
    enableBridge: true #  是否开启桥接（规则引擎） 
    maxSendWindowSize: 100 #  单个连接发送确认消息窗口（qos1+qos2）
    maxReceiveWindowSize: 100 # 单个连接接收确认窗口（qos2）
    maxConnectionPerSecond: 1000  # 连接速率 
    sessionPersistence: false  # 开启session消息持久化，建议使用离线消息
    maxSessionSize: 100  # 开启session后 单个连接持久化最大消息数
    ssl:
        crt: fluxmq.pem #公钥
        key: fluxmq.key #私钥
        ca:  fluxmq.ca # ca证书
```
## MQTT over WEBSOCKET

```yaml
mqtt:
- port: 1883 # mqtt端口号
  wiretap: false  # 二进制日志
  messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
  proxy: false # 是否开启proxy协议
  enableAuth: true #  是否开启认证
  enableAcl: true  #  是否开启ACL  
  enableBridge: true #  是否开启桥接（规则引擎）
  maxSendWindowSize: 100 #  单个连接发送确认消息窗口（qos1+qos2）
  maxReceiveWindowSize: 100 # 单个连接接收确认窗口（qos2）
  maxConnectionPerSecond: 1000  # 连接速率
  sessionPersistence: false  # 开启session消息持久化，建议使用离线消息
  maxSessionSize: 100  # 开启session后 单个连接持久化最大消息数
  useWebsocket: true
  
```

