# 连接池配置

```yaml
pool:
  bossThreadSize: 1  # boss线程 默认=cpu核心数
  workThreadSize: 10  # work线程 默认=cpu核心数+2
  eventThreadSize: 16  # 业务线程数 默认=cpu核心数
  bufferSize: 512  #  ringBuffer大小
  eventMessageSize: 500000 # 最大缓冲消息数
  waitStrategy: BLOCKING # 等待策略
  lowWaterMark:  32768
  highWaterMark:  65536
  globalReadSize: 102400 # 全局读字节数/s 默认不限制
  globalWriteSize: 102400 #   全局写字节数/s 默认不限制
  channelReadSize: 1024 #  单连接读字节数/s 默认不限制
  channelWriteSize: 1024 #  单连接写字节数/s 默认不限制
  

```

> 下面的配置理论上是最优配置，不需要额外设置。

| 参数名 | 描述                              | 默认值     |
| --- |---------------------------------|---------|
| **bossThreadSize** | netty的bossThreadSize，一般配置1~4 cpu即可 | 必填项     |
| **workThreadSize** | netty的workThreadSize，处理io事件     |  默认cpu     |
| **eventThreadSize** | MQTT事件消费线程，主要处理规则引擎等耗时操作，       | 默认cpu+2 |
| **bufferSize** | MQTT事件消费RIngBufer大小             | 默认1024  |
| **eventMessageSize** | 全局读写限制：每秒字节数                    | 默认50000 |
| **waitStrategy** | 等待策略：BLOCKING, SLEEPING, YIELDING | 默认BLOCKING |
| **globalReadSize** | 全局读限制：每秒字节数读| 不推荐配置   |
| **globalWriteSize** | 全局写限制：每秒字节数读| 不推荐配置   |
| **channelReadSize** | 单个连接读限制：每秒字节数读 | 不推荐配置   |
| **channelWriteSize** | 单个连接写限制：每秒字节数 | 不推荐配置   |
| **lowWaterMark** | 默认 32768                        | 不推荐配置   |
| **highWaterMark** | 当写入缓存字节数达到此值，默认 65536           | 不推荐配置   |


