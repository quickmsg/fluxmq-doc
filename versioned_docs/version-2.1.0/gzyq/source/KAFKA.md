# Kafka

FluxMQ提供了KAFKA的接入功能，可以将消息发送到KAFKA中。

## KAFKA配置

### KAFKA配置说明
![img.png](@site/static/images/gzyq/source/imgss.png)

| 配置项               | 说明                                                          |
|-------------------|-------------------------------------------------------------|
| bootstrap.servers | KAFKA的的地址                                                   |
| 序列化方式             | 默认org.apache.kafka.common.serialization.StringSerializer序列化 |
| Producer配置        | Producer的配置,默认会自动提示，比如batch.size、compression.type等常用配置      |