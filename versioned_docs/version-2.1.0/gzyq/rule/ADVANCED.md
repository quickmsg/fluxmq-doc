# 规则引擎高级使用指南

## 概述
本指南面向已经掌握规则引擎基础功能的用户，介绍 FluxMQ 2.1.0 版本规则引擎的高级特性、最佳实践和性能优化技巧。

## 内置 SQL 函数高级应用

### 数据类型转换函数
FluxMQ 2.1.0 新增了丰富的数据类型转换函数，帮助用户灵活处理不同格式的数据：

#### 字符串处理函数
```sql
-- 将 JSON 对象转换为字符串存储
SELECT json(payload) as json_payload FROM "$EVENT.PUBLISH" WHERE topic = 'sensor/data'

-- 将字节数组转换为十六进制字符串
SELECT hexStr(payload) as hex_data FROM "$EVENT.PUBLISH" WHERE topic = 'binary/data'

-- 字符串分割处理
SELECT split(topic, '/') as topic_parts FROM "$EVENT.PUBLISH"

-- 获取最后一个路径段
SELECT last(split(topic, '/')) as device_id FROM "$EVENT.PUBLISH"
```

#### 时间处理函数
```sql
-- 格式化时间戳为可读日期
SELECT 
  clientId,
  date(timestamp) as publish_date,
  datetime(timestamp) as publish_datetime
FROM "$EVENT.PUBLISH"

-- 时间字符串与时间戳互转
SELECT 
  datetimeToTimestamp("2023-07-29 11:06:27") as ts,
  dateToTimestamp("2023-07-29") as date_ts
FROM "$EVENT.PUBLISH"
```

#### 加密和编码函数
```sql
-- 生成消息唯一标识
SELECT 
  uuid() as message_uuid,
  md5(payload) as payload_hash,
  base64_encode(payload) as encoded_payload
FROM "$EVENT.PUBLISH"
```

### 高级查询示例

#### 复杂条件筛选
```sql
-- 多条件组合查询
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/temperature' 
  AND payload.temperature > 30 
  AND clientId.startsWith('device_')

-- 使用内置函数进行条件判断
SELECT * FROM "$EVENT.PUBLISH"
WHERE isJson(payload) = true 
  AND find(topic, 'alert') != null
```

#### 数据预处理
```sql
-- 复合字段生成
SELECT 
  clientId,
  topic,
  json(payload) as json_str,
  md5(concat(clientId, topic, timestamp)) as unique_key,
  substring(clientId, 7) as device_serial
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'device/+/report'
```

## 规则引擎性能优化

### SQL 语句优化建议

#### 1. 避免性能陷阱
```sql
-- ❌ 避免：给 payload 创建别名会影响性能
SELECT payload as p FROM "$EVENT.PUBLISH"

-- ✅ 推荐：直接使用 payload
SELECT payload FROM "$EVENT.PUBLISH"
```

#### 2. 合理使用索引字段
```sql
-- ✅ 推荐：优先使用已索引字段进行过滤
SELECT * FROM "$EVENT.PUBLISH" 
WHERE clientId = 'device001'  -- clientId 通常有索引

-- ❌ 避免：避免对复杂字段进行复杂运算
SELECT * FROM "$EVENT.PUBLISH" 
WHERE md5(payload) = '...'  -- 性能较差
```

#### 3. 规则设计最佳实践
```sql
-- ✅ 推荐：精确的主题匹配
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = 'sensor/temperature/room1'

-- ✅ 合理的通配符使用
SELECT * FROM "$EVENT.PUBLISH" WHERE topic =~ 'sensor/+/temperature'

-- ❌ 避免：过于宽泛的匹配
SELECT * FROM "$EVENT.PUBLISH" WHERE topic =~ '#'
```

## 离线消息处理

### 配置离线消息存储
FluxMQ 2.1.0 增强了离线消息处理能力，支持多种存储后端：

#### MySQL 离线存储配置
```sql
-- 离线消息保存 SQL
INSERT INTO offline_messages (
  id, clientId, topic, qos, payload, timestamp
) VALUES (
  '${id}', '${clientId}', '${topic}', 
  ${qos}, '${json(payload)}', ${timestamp}
)

-- 离线消息查询 SQL
SELECT id, topic, qos, payload 
FROM offline_messages 
WHERE clientId = '${clientId}' 
ORDER BY timestamp ASC

-- 离线消息删除 SQL
DELETE FROM offline_messages WHERE id = '${id}'
```

#### Redis 离线存储配置
适用于高并发场景，提供更好的性能表现。

### 离线消息规则示例
```sql
-- 监听未确认的 QoS 1/2 消息
SELECT 
  id,
  clientId,
  topic,
  qos,
  payload,
  timestamp
FROM "$EVENT.ACK" 
WHERE qos > 0 AND ack_status = 'failed'
```

## 多数据源集成

### 新增数据源支持
FluxMQ 2.1.0 新增了多个数据源支持：

#### ClickHouse 集成
```sql
-- ClickHouse 适用于大数据分析场景
INSERT INTO sensor_data (
  device_id, metric_name, metric_value, timestamp
) VALUES (
  '${clientId}', 
  '${split(topic, "/").get(2)}', 
  ${payload.value}, 
  ${timestamp}
)
```

#### Pulsar 消息队列
```sql
-- 配置 Pulsar 主题和消息内容
Topic: devices.${split(topic, "/").get(1)}
Message: ${json(payload)}
```

#### RocketMQ 集成
```sql
-- RocketMQ 消息发送配置
Topic: mqtt-messages
Tags: ${split(topic, "/").get(0)}
Keys: ${clientId}
Body: ${json(payload)}
```

## 规则组合和链式处理

### 规则链设计模式
通过多个规则的组合，实现复杂的业务逻辑：

#### 数据预处理规则
```sql
-- 规则1：数据清洗和标准化
SELECT 
  clientId,
  topic,
  toDouble(payload.temperature) as temp,
  toDouble(payload.humidity) as humid,
  datetime(timestamp) as record_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/data' AND isJson(payload)
```

#### 告警检测规则
```sql
-- 规则2：异常值检测
SELECT 
  clientId,
  'ALERT' as alert_type,
  payload.temperature as alert_value,
  'High temperature detected' as message
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data' 
  AND payload.temperature > 40
```

#### 数据归档规则
```sql
-- 规则3：历史数据存储
SELECT 
  uuid() as record_id,
  clientId as device_id,
  split(topic, '/').get(1) as device_type,
  json(payload) as sensor_data,
  timestamp as create_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'
```

## 监控和调试

### 规则执行监控
- 利用 Dashboard 的规则管理界面监控规则执行状态
- 查看规则匹配次数和执行成功率
- 分析规则执行性能指标

### 调试技巧
1. **使用 SQL 调试功能**：在创建规则时启用 SQL 调试，验证语句正确性
2. **逐步验证**：从简单的 SELECT * 开始，逐步添加条件和函数
3. **日志监控**：关注系统日志中的规则引擎相关信息

### 常见问题排查
```sql
-- 检查数据类型匹配
SELECT 
  isJson(payload) as is_valid_json,
  isBytes(payload) as is_bytes,
  payload
FROM "$EVENT.PUBLISH" LIMIT 10

-- 验证主题匹配
SELECT topic, topic =~ 'sensor/+/data' as topic_match
FROM "$EVENT.PUBLISH" LIMIT 10
```

## 安全和权限控制

### 规则访问控制
- 为不同规则设置不同的执行权限
- 限制规则访问的数据源和动作类型
- 定期审核规则配置和权限设置

### 数据脱敏
```sql
-- 敏感数据处理示例
SELECT 
  clientId,
  topic,
  md5(payload.user_id) as hashed_user_id,  -- 用户ID哈希化
  payload.public_data as data
FROM "$EVENT.PUBLISH"
WHERE topic = 'user/profile/update'
```

## 最佳实践总结

1. **规则设计原则**
   - 保持规则简单和专一
   - 避免在单个规则中处理过多逻辑
   - 合理使用函数，避免过度复杂化

2. **性能优化**
   - 优先使用精确匹配而非模糊匹配
   - 避免不必要的数据转换操作
   - 合理设置规则触发条件

3. **可维护性**
   - 为规则添加清晰的描述信息
   - 定期清理不再使用的规则
   - 建立规则版本管理机制

4. **监控和运维**
   - 建立规则执行监控体系
   - 设置关键规则的告警机制
   - 定期进行性能评估和优化

通过遵循这些高级使用指南，您可以充分发挥 FluxMQ 规则引擎的强大功能，构建高效、可靠的 IoT 数据处理方案。