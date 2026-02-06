# RocketMQ 消息发送

## 概述

RocketMQ 动作用于将规则引擎处理后的数据发送到 Apache RocketMQ 消息队列中。RocketMQ 是一个分布式消息和流数据平台，具有低延迟、高并发、高可用、高可靠等特性，特别适合企业级应用场景。

## 配置参数

### 基础配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `dataSource` | string | 是 | - | RocketMQ 数据源名称 |
| `topic` | string | 是 | - | 目标主题名称 |
| `tag` | string | 否 | - | 消息标签，用于消息过滤 |
| `messageKey` | string | 否 | - | 消息键，用于消息去重和顺序消费 |
| `batchSize` | number | 否 | 100 | 批量发送大小 |
| `batchInterval` | number | 否 | 1000 | 批量间隔（毫秒） |
| `timeout` | number | 否 | 30000 | 操作超时时间（毫秒） |

### 消息配置

```json
{
  "messageKey": "clientId",
  "tag": "device_data",
  "properties": {
    "source": "fluxmq",
    "version": "2.1.2"
  }
}
```

## 使用示例

### 基础配置示例

```json
{
  "action": "SAVE_ROCKETMQ",
  "config": {
    "dataSource": "rocketmq_ds",
    "topic": "device-events",
    "tag": "sensor_data",
    "messageKey": "clientId",
    "properties": {
      "source": "fluxmq",
      "event_type": "device_data"
    },
    "batchSize": 100,
    "batchInterval": 1000
  }
}
```

### 规则示例

```sql
-- 收集设备数据并发送到 RocketMQ
SELECT 
  clientId,
  topic,
  payload,
  timestamp,
  'device_event' as event_type
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/data'
  AND isJson(payload)
```

## 高级特性

### 消息标签

使用消息标签进行消息分类和过滤：

```json
{
  "tag": "sensor_data",
  "topic": "device-events"
}
```

### 消息键

使用消息键实现消息去重和顺序消费：

```json
{
  "messageKey": "clientId",
  "topic": "device-events-${clientId}"
}
```

### 顺序消息

配置顺序消息确保消息按顺序消费：

```json
{
  "messageKey": "clientId",
  "topic": "device-events",
  "orderly": true
}
```

### 事务消息

配置事务消息保证消息的可靠性：

```json
{
  "topic": "transaction-events",
  "transactional": true,
  "messageKey": "transaction_id"
}
```

## 性能优化

### 批量处理优化

1. **批量大小设置**：根据消息大小调整 `batchSize`，建议 100-1000
2. **批量间隔设置**：根据实时性要求调整 `batchInterval`
3. **并发控制**：合理设置并发数避免 RocketMQ 压力过大

### 消息优化

1. **消息压缩**：启用消息压缩减少网络传输
2. **消息大小**：控制单条消息大小，避免过大消息
3. **序列化优化**：选择合适的序列化格式

### 连接优化

1. **连接池配置**：合理配置 RocketMQ 客户端连接池
2. **心跳设置**：配置合适的心跳间隔
3. **超时设置**：设置合理的超时时间

## 错误处理

### 常见错误

1. **连接错误**：检查 RocketMQ 服务状态和网络连接
2. **主题不存在**：确保目标主题已创建
3. **权限错误**：检查 RocketMQ 访问权限配置
4. **消息格式错误**：确保消息格式正确

### 重试机制

```json
{
  "retry": {
    "maxAttempts": 3,
    "initialDelay": 1000,
    "maxDelay": 10000,
    "multiplier": 2
  }
}
```

### 死信队列

配置死信队列处理失败消息：

```json
{
  "deadLetterTopic": "device-events-dlq",
  "maxRetryTimes": 3
}
```

## 监控指标

- **发送成功率**：消息发送成功比例
- **发送延迟**：消息发送平均延迟
- **批量处理效率**：批量处理吞吐量
- **错误率**：各种错误的发生频率
- **队列积压**：待发送消息队列长度

## 最佳实践

### 主题设计

1. **命名规范**：使用清晰的主题命名规范
2. **分区策略**：根据业务需求设计分区策略
3. **消息类型**：合理使用消息标签进行分类

### 消息设计

1. **消息格式**：使用标准化的消息格式
2. **消息大小**：控制消息大小，避免过大消息
3. **消息属性**：合理使用消息属性进行路由和过滤

### 性能调优

1. **批量优化**：合理设置批量参数平衡性能和实时性
2. **并发控制**：根据 RocketMQ 集群能力调整并发数
3. **监控告警**：设置关键指标监控和告警

### 可靠性保证

1. **持久化配置**：确保重要消息的持久化
2. **副本配置**：配置合适的副本数量
3. **故障恢复**：设计故障恢复机制

## 使用场景

### 实时数据处理

```sql
-- 实时处理传感器数据
SELECT 
  clientId as device_id,
  payload.temperature as temperature,
  payload.humidity as humidity,
  timestamp
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'
  AND isJson(payload)
```

### 事件流处理

```sql
-- 处理设备事件流
SELECT 
  clientId as device_id,
  'status_change' as event_type,
  payload.status as new_status,
  payload.previous_status as old_status,
  timestamp
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/status'
  AND isJson(payload)
```

### 日志收集

```sql
-- 收集设备日志
SELECT 
  clientId as device_id,
  'log' as event_type,
  payload.level as log_level,
  payload.message as log_message,
  timestamp
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/log'
  AND isJson(payload)
```

### 告警处理

```sql
-- 处理告警消息
SELECT 
  clientId as device_id,
  'alert' as event_type,
  payload.alert_type as alert_type,
  payload.message as alert_message,
  payload.level as alert_level,
  timestamp
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/alert'
  AND isJson(payload)
```

## 企业级特性

### 消息轨迹

启用消息轨迹跟踪消息流转：

```json
{
  "enableMsgTrace": true,
  "customizedTraceTopic": "message-trace"
}
```

### 消息过滤

使用消息标签和属性进行消息过滤：

```json
{
  "tag": "high_priority",
  "properties": {
    "priority": "high",
    "region": "asia"
  }
}
```

### 延迟消息

配置延迟消息实现定时任务：

```json
{
  "topic": "delayed-events",
  "delayLevel": 3,
  "messageKey": "scheduled_task_id"
}
``` 