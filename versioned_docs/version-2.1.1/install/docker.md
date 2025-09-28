# docker

## 镜像拉取
```shell
docker pull fluxmq/enterprise:2.1.0
```

## 2.1.0 版本新特性
FluxMQ 2.1.0 版本包含以下重要更新：
- **规则引擎增强**：新增30+内置函数，支持更复杂的数据处理
- **离线消息功能**：支持QoS1/2消息的离线存储和自动投递
- **新增数据源**：支持ClickHouse、RocketMQ、TDengine等
- **性能优化**：规则引擎执行性能提升40%，内存使用减少25%
- **监控增强**：新增规则引擎性能监控和优化建议

## 启动FluxMQ
> 默认会启动MQTT、MQTT over Websocket、HTTP端口
```shell
docker run -it -d  -v /app/logs:/app/logs  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.1.0
```

### 覆盖FluxMQ默认配置
> 配置文件目录：/app/config/config.yaml
#### FluxMQ配置文件，
```yaml
allowEmptyMessage: true # 是否允许空消息传递规则引擎
allowAnonymousAccess: true # 是否允许匿名访问
logAll: false
pool:
# bossThreadSize:  max(cpu核心数/4,1)
# workThreadSize: 默认cpu核心数
# eventThreadSize:  max(cpu核心数/4,1)
# eventThreadGroup :默认cpu核心数
# lowWaterMark:  低水位： 默认32768
# highWaterMark: 高水位: 默认65536
# globalReadSize:  全局读字节数/s 默认不限制
# globalWriteSize: 全局写字节数/s 默认不限制
# channelReadSize: 单连接读字节数/s 默认不限制
# channelWriteSize: 单连接写字节数/s 默认不限制
mqtt:
  - port: 1883 # mqtt端口号
    wiretap: false  # 二进制日志
    messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
    proxy: false # 是否开启proxy协议
    enableAuth: true #  是否开启认证，开启后会走认证模块
    metrics: true
  - port: 8999 # 端口
    useWebsocket: true # 是否使用websocket
    messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
    path: /mqtt # ws 的访问path mqtt.js请设置此选项
    enableAuth: true #  是否开启认证，开启后会走认证模块
    metrics: true

http: # http相关配置 端口固定60000
  host: 127.0.0.1
  port: 8080
  accessLog: false # http访问日志
  username: fluxmq # 访问用户名
  password: fluxmq # 访问密码
  bridge: true
cluster: # 集群配置
  localAddress: 127.0.0.1
#  addresses: ["127.0.0.1"]
meter:
  meterType: PROMETHEUS # INFLUXDB , PROMETHEUS
eventbus:
  compressed: true
  batch: true
  batchSize: 200
  batchDuration: 50
shareSubscribe:
  strategy: RANDOM
  maxShareSubscribeSize: 100
store:
  storeType: MEMORY # MYSQL,LOCAL,MEMORY,POSTGRESQL
  datasource:
    url: jdbc:mysql://47.93.28.68:3306/fluxmq?useSSL=false
    username:  root
    password:  lxr7293209
application:
  name: fluxmq

```
#### 启动FluxMQ
```shell
docker run -it -d  -v /app/logs:/app/logs /app/config/config.yaml:/app/config/config.yaml  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.1.0
```
## License配置

> 配置文件目录：/app/license.base64
```shell
docker run -it -d  -v /app/license.base64:/app/license.base64  -v /app/logs:/app/logs /app/config/config.yaml:/app/config/config.yaml  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.1.0
```


## 持久化
如果采用本地数据持久化模式：LOCAl,务必需要将容器目录~/fluxmq目录映射到宿主机

## 运行日志

运行位置在/logs下包含INFO、ERROR日志，启动容器可以将目录映射宿主机

## 管理页面
```shell
http://宿主机ip:8080/
```