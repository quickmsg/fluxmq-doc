# ClickHouse 数据存储

## 概述

ClickHouse 动作用于将规则引擎处理后的数据存储到 ClickHouse 数据库中。ClickHouse 是一个高性能的列式数据库，特别适合大数据分析和 OLAP 查询场景。

## 配置参数

### 基础配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `dataSource` | string | 是 | - | ClickHouse 数据源名称 |
| `table` | string | 是 | - | 目标表名 |
| `fields` | array | 是 | - | 字段映射配置 |
| `batchSize` | number | 否 | 1000 | 批量插入大小 |
| `batchInterval` | number | 否 | 1000 | 批量间隔（毫秒） |
| `timeout` | number | 否 | 30000 | 操作超时时间（毫秒） |

### 字段映射配置

```json
{
  "fields": [
    {
      "name": "device_id",
      "type": "String",
      "value": "clientId"
    },
    {
      "name": "timestamp",
      "type": "DateTime",
      "value": "timestamp"
    },
    {
      "name": "value",
      "type": "Float64",
      "value": "payload.value"
    }
  ]
}
```

## 使用示例

### 基础配置示例

```json
{
  "action": "SAVE_CLICKHOUSE",
  "config": {
    "dataSource": "clickhouse_ds",
    "table": "device_metrics",
    "fields": [
      {
        "name": "device_id",
        "type": "String",
        "value": "clientId"
      },
      {
        "name": "timestamp",
        "type": "DateTime",
        "value": "timestamp"
      },
      {
        "name": "temperature",
        "type": "Float64",
        "value": "payload.temperature"
      },
      {
        "name": "humidity",
        "type": "Float64",
        "value": "payload.humidity"
      }
    ],
    "batchSize": 1000,
    "batchInterval": 1000
  }
}
```

### 规则示例

```sql
-- 收集传感器数据并存储到 ClickHouse
SELECT 
  clientId,
  timestamp,
  payload.temperature as temperature,
  payload.humidity as humidity,
  payload.pressure as pressure
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'
  AND isJson(payload)
```

## 性能优化

### 批量处理优化

1. **批量大小设置**：根据数据量调整 `batchSize`，建议 1000-10000
2. **批量间隔设置**：根据实时性要求调整 `batchInterval`
3. **并发控制**：合理设置并发数避免 ClickHouse 压力过大

### 表结构优化

1. **分区策略**：使用合适的分区键（如日期）
2. **排序键**：设置合适的排序键提高查询性能
3. **索引优化**：为常用查询字段创建索引

## 错误处理

### 常见错误

1. **连接错误**：检查 ClickHouse 服务状态和网络连接
2. **表不存在**：确保目标表已创建且结构正确
3. **字段类型不匹配**：检查字段类型映射是否正确
4. **数据格式错误**：确保数据格式符合 ClickHouse 要求

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

## 监控指标

- **插入成功率**：数据插入成功比例
- **插入延迟**：数据插入平均延迟
- **批量处理效率**：批量处理吞吐量
- **错误率**：各种错误的发生频率

## 最佳实践

1. **数据预处理**：在规则中过滤和转换数据
2. **批量优化**：合理设置批量参数平衡性能和实时性
3. **监控告警**：设置关键指标监控和告警
4. **备份策略**：定期备份重要数据
5. **性能调优**：根据实际负载调整 ClickHouse 配置 