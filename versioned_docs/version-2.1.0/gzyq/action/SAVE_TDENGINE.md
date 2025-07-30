# TDengine 数据存储

## 概述

TDengine 动作用于将规则引擎处理后的数据存储到 TDengine 时序数据库中。TDengine 是一个专为物联网、工业互联网等场景设计的时序数据库，具有高性能、高可靠、易运维等特点。

## 配置参数

### 基础配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `dataSource` | string | 是 | - | TDengine 数据源名称 |
| `database` | string | 是 | - | 目标数据库名称 |
| `table` | string | 是 | - | 目标表名 |
| `fields` | array | 是 | - | 字段映射配置 |
| `tags` | array | 否 | - | 标签字段配置 |
| `batchSize` | number | 否 | 1000 | 批量插入大小 |
| `batchInterval` | number | 否 | 1000 | 批量间隔（毫秒） |
| `timeout` | number | 否 | 30000 | 操作超时时间（毫秒） |

### 字段映射配置

```json
{
  "fields": [
    {
      "name": "ts",
      "type": "TIMESTAMP",
      "value": "timestamp"
    },
    {
      "name": "value",
      "type": "DOUBLE",
      "value": "payload.value"
    }
  ],
  "tags": [
    {
      "name": "device_id",
      "type": "NCHAR(64)",
      "value": "clientId"
    },
    {
      "name": "sensor_type",
      "type": "NCHAR(32)",
      "value": "split(topic, '/').get(1)"
    }
  ]
}
```

## 使用示例

### 基础配置示例

```json
{
  "action": "SAVE_TDENGINE",
  "config": {
    "dataSource": "tdengine_ds",
    "database": "iot_data",
    "table": "sensor_data",
    "fields": [
      {
        "name": "ts",
        "type": "TIMESTAMP",
        "value": "timestamp"
      },
      {
        "name": "temperature",
        "type": "DOUBLE",
        "value": "payload.temperature"
      },
      {
        "name": "humidity",
        "type": "DOUBLE",
        "value": "payload.humidity"
      }
    ],
    "tags": [
      {
        "name": "device_id",
        "type": "NCHAR(64)",
        "value": "clientId"
      },
      {
        "name": "location",
        "type": "NCHAR(128)",
        "value": "payload.location"
      }
    ],
    "batchSize": 1000,
    "batchInterval": 1000
  }
}
```

### 规则示例

```sql
-- 收集传感器数据并存储到 TDengine
SELECT 
  clientId,
  timestamp,
  payload.temperature as temperature,
  payload.humidity as humidity,
  payload.location as location
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'
  AND isJson(payload)
```

## 高级特性

### 超级表设计

TDengine 的超级表特性非常适合物联网场景：

```sql
-- 创建超级表
CREATE STABLE sensor_data (
  ts TIMESTAMP,
  temperature DOUBLE,
  humidity DOUBLE,
  pressure DOUBLE
) TAGS (
  device_id NCHAR(64),
  sensor_type NCHAR(32),
  location NCHAR(128)
);

-- 创建子表
CREATE TABLE sensor_data_001 USING sensor_data TAGS ('device_001', 'temperature', 'room_101');
```

### 标签优化

合理使用标签提高查询性能：

```json
{
  "tags": [
    {
      "name": "device_id",
      "type": "NCHAR(64)",
      "value": "clientId"
    },
    {
      "name": "device_type",
      "type": "NCHAR(32)",
      "value": "payload.device_type"
    },
    {
      "name": "region",
      "type": "NCHAR(32)",
      "value": "payload.region"
    }
  ]
}
```

### 批量插入优化

TDengine 特别适合批量插入操作：

```json
{
  "batchSize": 10000,
  "batchInterval": 500,
  "maxSqlLength": 1048576
}
```

## 性能优化

### 批量处理优化

1. **批量大小设置**：根据数据量调整 `batchSize`，建议 1000-10000
2. **批量间隔设置**：根据实时性要求调整 `batchInterval`
3. **SQL长度限制**：控制单条SQL语句长度，避免过长

### 表结构优化

1. **超级表设计**：合理设计超级表结构
2. **标签策略**：优化标签设计提高查询效率
3. **分区策略**：利用TDengine自动分区特性

### 查询优化

1. **时间范围查询**：优先使用时间范围过滤
2. **标签过滤**：合理使用标签进行数据过滤
3. **聚合查询**：利用TDengine的聚合函数

## 错误处理

### 常见错误

1. **连接错误**：检查 TDengine 服务状态和网络连接
2. **数据库不存在**：确保目标数据库已创建
3. **表不存在**：确保目标表已创建且结构正确
4. **字段类型不匹配**：检查字段类型映射是否正确

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

### 数据一致性

```json
{
  "consistency": "strong",
  "walLevel": 1,
  "fsync": 3000
}
```

## 监控指标

- **插入成功率**：数据插入成功比例
- **插入延迟**：数据插入平均延迟
- **批量处理效率**：批量处理吞吐量
- **存储空间**：数据存储空间使用情况
- **查询性能**：查询响应时间和吞吐量

## 最佳实践

### 数据建模

1. **超级表设计**：合理设计超级表结构
2. **标签设计**：优化标签设计提高查询效率
3. **字段类型**：选择合适的字段类型

### 性能调优

1. **批量优化**：合理设置批量参数
2. **连接池配置**：配置合适的连接池参数
3. **内存配置**：根据数据量调整内存配置

### 运维管理

1. **备份策略**：定期备份重要数据
2. **监控告警**：设置关键指标监控和告警
3. **容量规划**：合理规划存储容量

## 使用场景

### 传感器数据存储

```sql
-- 存储温度传感器数据
SELECT 
  clientId,
  timestamp,
  payload.temperature as temperature,
  payload.humidity as humidity
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'
  AND isJson(payload)
```

### 设备状态监控

```sql
-- 监控设备状态变化
SELECT 
  clientId,
  timestamp,
  payload.status as status,
  payload.battery as battery,
  payload.signal as signal
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/status'
  AND isJson(payload)
```

### 工业设备数据

```sql
-- 存储工业设备数据
SELECT 
  clientId,
  timestamp,
  payload.speed as speed,
  payload.temperature as temperature,
  payload.pressure as pressure,
  payload.vibration as vibration
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'machine/+/data'
  AND isJson(payload)
```

### 能源监控

```sql
-- 监控能源消耗
SELECT 
  clientId,
  timestamp,
  payload.power as power,
  payload.voltage as voltage,
  payload.current as current,
  payload.energy as energy
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'energy/+/data'
  AND isJson(payload)
```

## 企业级特性

### 高可用配置

```json
{
  "ha": {
    "enabled": true,
    "firstEp": "tdengine1:6030",
    "secondEp": "tdengine2:6030",
    "arbitrator": "arbitrator:6042"
  }
}
```

### 数据压缩

```json
{
  "compression": {
    "enabled": true,
    "algorithm": "LZ4"
  }
}
```

### 数据保留策略

```sql
-- 设置数据保留策略
ALTER DATABASE iot_data KEEP 365 DURATION 10 UPDATE 1;
``` 