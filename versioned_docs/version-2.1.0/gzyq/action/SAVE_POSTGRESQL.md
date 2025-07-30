# PostgreSQL 数据存储

## 概述

PostgreSQL 动作用于将规则引擎处理后的数据存储到 PostgreSQL 数据库中。PostgreSQL 是一个功能强大的开源关系型数据库，支持复杂查询、事务处理和地理信息等高级特性。

## 配置参数

### 基础配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `dataSource` | string | 是 | - | PostgreSQL 数据源名称 |
| `table` | string | 是 | - | 目标表名 |
| `fields` | array | 是 | - | 字段映射配置 |
| `batchSize` | number | 否 | 1000 | 批量插入大小 |
| `batchInterval` | number | 否 | 1000 | 批量间隔（毫秒） |
| `timeout` | number | 否 | 30000 | 操作超时时间（毫秒） |
| `useTransaction` | boolean | 否 | true | 是否使用事务 |

### 字段映射配置

```json
{
  "fields": [
    {
      "name": "device_id",
      "type": "VARCHAR(100)",
      "value": "clientId"
    },
    {
      "name": "timestamp",
      "type": "TIMESTAMP",
      "value": "timestamp"
    },
    {
      "name": "data",
      "type": "JSONB",
      "value": "payload"
    }
  ]
}
```

## 使用示例

### 基础配置示例

```json
{
  "action": "SAVE_POSTGRESQL",
  "config": {
    "dataSource": "postgresql_ds",
    "table": "device_data",
    "fields": [
      {
        "name": "device_id",
        "type": "VARCHAR(100)",
        "value": "clientId"
      },
      {
        "name": "timestamp",
        "type": "TIMESTAMP",
        "value": "timestamp"
      },
      {
        "name": "temperature",
        "type": "DOUBLE PRECISION",
        "value": "payload.temperature"
      },
      {
        "name": "humidity",
        "type": "DOUBLE PRECISION",
        "value": "payload.humidity"
      },
      {
        "name": "location",
        "type": "JSONB",
        "value": "payload.location"
      }
    ],
    "batchSize": 1000,
    "batchInterval": 1000,
    "useTransaction": true
  }
}
```

### 规则示例

```sql
-- 收集设备数据并存储到 PostgreSQL
SELECT 
  clientId,
  timestamp,
  payload.temperature as temperature,
  payload.humidity as humidity,
  payload.location as location
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/data'
  AND isJson(payload)
```

## 高级特性

### JSONB 支持

PostgreSQL 的 JSONB 类型非常适合存储半结构化数据：

```json
{
  "fields": [
    {
      "name": "device_id",
      "type": "VARCHAR(100)",
      "value": "clientId"
    },
    {
      "name": "data",
      "type": "JSONB",
      "value": "payload"
    }
  ]
}
```

### 地理信息支持

利用 PostgreSQL 的 PostGIS 扩展存储地理信息：

```json
{
  "fields": [
    {
      "name": "device_id",
      "type": "VARCHAR(100)",
      "value": "clientId"
    },
    {
      "name": "location",
      "type": "GEOMETRY(POINT, 4326)",
      "value": "ST_GeomFromText('POINT(' || payload.longitude || ' ' || payload.latitude || ')')"
    }
  ]
}
```

## 性能优化

### 批量处理优化

1. **批量大小设置**：根据数据量调整 `batchSize`，建议 500-5000
2. **批量间隔设置**：根据实时性要求调整 `batchInterval`
3. **事务控制**：合理使用事务保证数据一致性

### 索引优化

```sql
-- 为常用查询字段创建索引
CREATE INDEX idx_device_data_device_id ON device_data(device_id);
CREATE INDEX idx_device_data_timestamp ON device_data(timestamp);
CREATE INDEX idx_device_data_temperature ON device_data(temperature);

-- JSONB 索引
CREATE INDEX idx_device_data_data_gin ON device_data USING GIN (data);
```

### 分区表

对于大量数据，可以使用分区表提高性能：

```sql
-- 创建分区表
CREATE TABLE device_data (
  id SERIAL,
  device_id VARCHAR(100),
  timestamp TIMESTAMP,
  data JSONB
) PARTITION BY RANGE (timestamp);

-- 创建分区
CREATE TABLE device_data_2024_01 PARTITION OF device_data
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## 错误处理

### 常见错误

1. **连接错误**：检查 PostgreSQL 服务状态和网络连接
2. **表不存在**：确保目标表已创建且结构正确
3. **字段类型不匹配**：检查字段类型映射是否正确
4. **约束违反**：检查数据是否符合表约束条件

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
- **事务成功率**：事务提交成功比例
- **错误率**：各种错误的发生频率

## 最佳实践

### 数据建模

1. **规范化设计**：合理设计表结构，避免数据冗余
2. **索引策略**：为查询频繁的字段创建索引
3. **约束设计**：使用适当的约束保证数据完整性

### 性能调优

1. **连接池配置**：合理配置数据库连接池
2. **批量优化**：使用批量插入提高性能
3. **查询优化**：优化复杂查询的 SQL 语句

### 数据一致性

1. **事务使用**：关键数据使用事务保证一致性
2. **外键约束**：使用外键保证数据关联完整性
3. **数据验证**：在插入前验证数据格式和内容

### 备份和恢复

1. **定期备份**：设置自动备份策略
2. **恢复测试**：定期测试备份恢复流程
3. **监控告警**：设置关键指标监控和告警 