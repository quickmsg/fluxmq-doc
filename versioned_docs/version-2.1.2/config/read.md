# 前言

## FluxMQ 配置文件（2.1.2）

完整配置文件示例见下。各配置项说明见 [MQTT 配置](mqtt.md)、[HTTP 配置](http.md)、[集群配置](cluster.md)、[存储配置](store.md)、[License 配置](license.md) 等章节。

```YAML
# logLevel: INFO  # 可选，sfl4j 日志级别
allowEmptyMessage: true   # 是否允许空消息传递规则引擎
allowAnonymousAccess: true # 是否允许匿名访问
logAll: false             # 支持开启全量日志，开启后日志追踪功能将失效

pool:
  bufferSize: 4096
  eventMessageSize: 500000  # 业务线程队列大小，默认 50000
  waitStrategy: BLOCKING    # 可选：BLOCKING, YIELDING, SLEEPING 等
  # 以下一般无需修改
  # bossThreadSize / workThreadSize / eventThreadSize
  # ruleEngineAsync / ruleEngineThreadSize / ruleEngineMessageSize
  # lowWaterMark / highWaterMark / channelReadSize / channelWriteSize

mqtt:
  - port: 1883
    wiretap: false
    messageMaxSize: 4194304
    proxy: false
    enableAuth: true
    enableAcl: true
    enableBridge: true
    maxSendWindowSize: 100
    maxReceiveWindowSize: 100
    maxConnectionPerSecond: 1000
    sessionPersistence: false
    maxSessionSize: 100
  - port: 8999
    useWebsocket: true
    messageMaxSize: 4194304
    path: /mqtt
    enableAuth: true
    enableAcl: true
    enableBridge: true
    maxSendWindowSize: 100
    maxReceiveWindowSize: 100
    maxConnectionPerSecond: 1000
    sessionPersistence: false
    maxSessionSize: 100

http:
  host: 127.0.0.1
  port: 8080
  accessLog: false
  username: fluxmq
  password: fluxmq
  bridge: false

cluster:
  localAddress: 127.0.0.1
  addresses: ["127.0.0.1"]

meter:
  meterType: PROMETHEUS

eventbus:
  compressed: true
  batch: true
  batchSize: 2000
  batchDuration: 50

shareSubscribe:
  strategy: RANDOM
  maxShareSubscribeSize: 100

store:
  storeType: MEMORY
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false
    username: root
    password: root

application:
  name: fluxmq

# License：本地文件或 FCP 模式，详见 config/license.md
license:
  file: fluxmq.lic   # 本地 license 文件路径，默认 fluxmq.lic
  mode: LOCAL       # LOCAL=本地文件，FCP=连接 fmq-admin 授权服务

# 当 license.mode 为 FCP 时必填，用于连接 fmq-admin
proxy:
  serverUrl: tcp://127.0.0.1:8081
  token: your-proxy-token
  applicationId: your-application-id
  # applicationName: 可选，应用名称
```

## 2.1.2 配置说明

- **license**：支持 `file` + `mode`（LOCAL / FCP）；FCP 模式下需配合 **proxy** 使用。
- **proxy**：仅在 `license.mode: FCP` 时生效，用于连接 fmq-admin 的代理地址、token、applicationId。
- **pool.waitStrategy**：可配置 Disruptor 等待策略（如 BLOCKING、YIELDING），用于调优高并发场景。
- **logLevel**：可选，用于设置 sfl4j 日志级别（如 INFO、DEBUG）。