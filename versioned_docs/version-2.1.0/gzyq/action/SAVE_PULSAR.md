# Pulsar 消息发送

## 概述

Pulsar 动作用于将规则引擎处理后的数据发送到 Apache Pulsar 消息队列中。Pulsar 是一个云原生的分布式消息和流处理平台，支持多租户、统一队列和流处理模型。

## 配置参数

### 基础配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `dataSource` | string | 是 | - | Pulsar 数据源名称 |
| `topic` | string | 是 | - | 目标主题名称 |
| `messageKey` | string | 否 | - | 消息键，用于分区路由 |
| `batchSize` | number | 否 | 100 | 批量发送大小 |
| `batchInterval` | number | 否 | 1000 | 批量间隔（毫秒） |
| `timeout` | number | 否 | 30000 | 操作超时时间（毫秒） |

### 消息配置

```json
{
  "messageKey": "clientId",
  "properties": {
    "source": "fluxmq",
    "version": "2.1.0"
  }
}
```

## 使用示例

### 基础配置示例

```json
{
  "action": "SAVE_PULSAR",
  "config": {
    "dataSource": "pulsar_ds",
    "topic": "device-events",
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
-- 收集设备数据并发送到 Pulsar
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

### 消息路由

使用消息键进行分区路由：

```json
{
  "messageKey": "clientId",
  "topic": "device-events-${clientId}"
}
```

### 消息属性

设置消息属性用于消息过滤和路由：

```json
{
  "properties": {
    "device_type": "sensor",
    "data_type": "environmental",
    "priority": "normal"
  }
}
```

### 批量发送

配置批量发送参数优化性能：

```json
{
  "batchSize": 1000,
  "batchInterval": 500,
  "maxPendingMessages": 10000
}
```

## 性能优化

### 批量处理优化

1. **批量大小设置**：根据消息大小调整 `batchSize`，建议 100-1000
2. **批量间隔设置**：根据实时性要求调整 `batchInterval`
3. **并发控制**：合理设置并发数避免 Pulsar 压力过大

### 消息优化

1. **消息压缩**：启用消息压缩减少网络传输
2. **消息大小**：控制单条消息大小，避免过大消息
3. **序列化优化**：选择合适的序列化格式

### 连接优化

1. **连接池配置**：合理配置 Pulsar 客户端连接池
2. **心跳设置**：配置合适的心跳间隔
3. **超时设置**：设置合理的超时时间

## 错误处理

### 常见错误

1. **连接错误**：检查 Pulsar 服务状态和网络连接
2. **主题不存在**：确保目标主题已创建
3. **权限错误**：检查 Pulsar 访问权限配置
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
  "maxRedeliverCount": 3
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
3. **多租户**：合理使用 Pulsar 多租户特性

### 消息设计

1. **消息格式**：使用标准化的消息格式
2. **消息大小**：控制消息大小，避免过大消息
3. **消息属性**：合理使用消息属性进行路由和过滤

### 性能调优

1. **批量优化**：合理设置批量参数平衡性能和实时性
2. **并发控制**：根据 Pulsar 集群能力调整并发数
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