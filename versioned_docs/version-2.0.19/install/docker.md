# docker

## 镜像拉取
```shell
docker pull fluxmq/enterprise:2.0.18
```

## 启动FluxMQ
> 默认会启动MQTT、MQTT over Websocket、HTTP端口
```shell
docker run -it -d  -v /app/logs:/app/logs  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.0.18
```

### 覆盖FluxMQ默认配置
> 配置文件目录：/app/config/config.yaml
#### FluxMQ配置文件，
```yaml
allowEmptyMessage: true # 是否允许空消息传递规则引擎
allowAnonymousAccess: true # 是否允许匿名访问
pool:
  # bossThreadSize: 4  # 默认 4 不建议配置
  # workThreadSize: 20 # 默认cpu核心数 不建议配置
  # eventThreadSize: 24 # 默认cpu核心数+2 不建议配置
  bufferSize: 4096
  eventMessageSize: 500000 # 业务线程数 默认=cpu核心数*10
  waitStrategy: BLOCKING # 
  # lowWaterMark:  低水位： 默认32768 不建议配置
  # highWaterMark: 高水位: 默认65536 不建议配置
  # channelReadSize: 单连接读字节数/s ，默认不限制，不建议配置
  # channelWriteSize: 单连接写字节数/s，默认不限制， 不建议配置
mqtt: ## 支持多端口
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
  - port: 8999 # 端口
    useWebsocket: true # 是否使用websocket
    messageMaxSize: 4194304 # 接收消息的最大限制 默认4194304(4M)
    path: /mqtt # ws 的访问path mqtt.js请设置此选项
    enableAuth: true #  是否开启认证
    enableAcl: true  #  是否开启ACL  
    enableBridge: true #  是否开启桥接（规则引擎） 
    maxSendWindowSize: 100 #  单个连接发送确认消息窗口（qos1+qos2）
    maxReceiveWindowSize: 100 # 单个连接接收确认窗口（qos2）
    maxConnectionPerSecond: 1000  # 连接速率 
    sessionPersistence: false  # 开启session消息持久化，建议使用离线消息
    maxSessionSize: 100  # 开启session后 单个连接持久化最大消息数
http: # http相关配置 端口固定60000
  host: 127.0.0.1
  port: 8080
  accessLog: false # http访问日志
  username: fluxmq # 访问用户名
  password: fluxmq # 访问密码
cluster: # 集群配置
  localAddress: 127.0.0.1
  addresses: ["127.0.0.1"]
meter:
  meterType: PROMETHEUS # INFLUXDB , PROMETHEUS
eventbus:
  compressed: true
  batch: true
  batchSize: 2000
  batchDuration: 50
shareSubscribe:
  strategy: RANDOM
  maxShareSubscribeSize: 100
store:
  storeType: MEMORY # MYSQL,LOCAL,MEMORY,POSTGRESQL
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false
    username:  root
    password:  root
application:
  name: fluxmq
```
#### 启动FluxMQ
```shell
docker run -it -d  -v /app/logs:/app/logs /app/config/config.yaml:/app/config/config.yaml  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.0.18
```
## License配置

> 配置文件目录：/app/license.base64
```shell
docker run -it -d  -v /app/license.base64:/app/license.base64  -v /app/logs:/app/logs /app/config/config.yaml:/app/config/config.yaml  -p 8080:8080 -p 1883:1883 -p 8883:8883 fluxmq/enterprise:2.0.18
```


## 持久化
如果采用本地数据持久化模式：LOCAl,务必需要将容器目录~/fluxmq目录映射到宿主机

## 运行日志

运行位置在/logs下包含INFO、ERROR日志，启动容器可以将目录映射宿主机

## 管理页面
```shell
http://宿主机ip:8080/
```