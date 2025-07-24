# 规则引擎故障排查与性能优化

## 概述
本文档提供 FluxMQ 2.1.0 规则引擎常见问题的排查方法和性能优化建议，帮助用户快速定位和解决问题。

## 常见问题排查

### 1. 规则不执行或匹配不到数据

#### 问题现象
- 规则状态显示正常，但没有输出结果
- 规则匹配计数为 0 或很少
- 动作没有被触发

#### 排查步骤

**1.1 检查事件类型匹配**
```sql
-- 验证事件是否正确触发
SELECT * FROM "$EVENT.PUBLISH" LIMIT 10
```

**1.2 检查主题匹配规则**
```sql
-- 测试主题匹配
SELECT topic, topic =~ 'sensor/+/data' as is_match 
FROM "$EVENT.PUBLISH" 
WHERE timestamp > 1690599987495
LIMIT 10
```

**1.3 验证数据格式**
```sql
-- 检查 payload 数据类型
SELECT 
  isJson(payload) as is_json,
  isBytes(payload) as is_bytes,
  str(payload) as payload_str
FROM "$EVENT.PUBLISH" LIMIT 5
```

**1.4 测试条件过滤**
```sql
-- 逐步缩小条件范围
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic = 'sensor/001/data'  -- 先用精确匹配

SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/data'   -- 再用通配符匹配
```

#### 常见原因和解决方案

| 问题原因 | 解决方案 |
|---------|---------|
| 事件类型选择错误 | 检查 FROM 子句中的事件类型，确保与实际消息类型匹配 |
| 主题匹配规则错误 | 使用 `=~` 进行通配符匹配，`=` 进行精确匹配 |
| 数据类型不匹配 | 使用 `isJson()`, `str()` 等函数进行数据类型转换 |
| 字段路径错误 | 检查 JSON 嵌套路径，如 `payload.sensor.temperature` |
| 条件过于严格 | 放宽过滤条件，逐步缩小范围 |

### 2. SQL 语法错误

#### 问题现象
- 规则保存时提示语法错误
- 规则测试失败

#### 常见语法错误

**2.1 字符串引号使用错误**
```sql
-- ❌ 错误写法
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = "sensor/data"

-- ✅ 正确写法  
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = 'sensor/data'
```

**2.2 保留字冲突**
```sql
-- ❌ 错误：使用了保留字
SELECT order FROM "$EVENT.PUBLISH"

-- ✅ 正确：使用别名
SELECT payload.order as order_info FROM "$EVENT.PUBLISH"
```

**2.3 函数调用错误**
```sql
-- ❌ 错误：函数名拼写错误
SELECT datatime(timestamp) FROM "$EVENT.PUBLISH"

-- ✅ 正确：函数名正确
SELECT datetime(timestamp) FROM "$EVENT.PUBLISH"
```

### 3. 性能问题

#### 问题现象
- 规则执行缓慢
- 系统内存或 CPU 使用率高
- 消息处理延迟

#### 性能诊断

**3.1 检查规则复杂度**
```sql
-- ❌ 避免：复杂的嵌套查询
SELECT 
  (SELECT COUNT(*) FROM another_table) as count,
  complex_function(payload) as result
FROM "$EVENT.PUBLISH"

-- ✅ 推荐：简化查询逻辑
SELECT 
  clientId,
  payload.temperature
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/temperature'
```

**3.2 监控规则执行统计**
- 查看 Dashboard 中的规则执行次数
- 监控规则执行成功率
- 关注规则执行时间

#### 性能优化建议

**避免性能陷阱：**

| 避免的操作 | 替代方案 |
|-----------|---------|
| `SELECT payload as p` | `SELECT payload` |
| 复杂的字符串操作 | 预处理数据或使用简单匹配 |
| 深度嵌套的 JSON 解析 | 数据扁平化处理 |
| 过于宽泛的通配符 | 精确的主题匹配 |

### 4. 动作执行失败

#### 问题现象
- 规则匹配成功但动作未执行
- 数据源连接失败
- 动作执行出现异常

#### 排查步骤

**4.1 检查数据源连接**
- 验证数据库连接参数
- 测试网络连通性
- 检查认证信息

**4.2 验证动作配置**
```sql
-- MySQL 动作示例
INSERT INTO sensor_data (
  device_id, temperature, timestamp
) VALUES (
  '${clientId}',    -- 确保字段存在
  ${payload.temp},  -- 确保数据类型匹配
  '${datetime(timestamp)}'  -- 确保时间格式正确
)
```

**4.3 检查模板变量**
- 确保所有 `${variable}` 变量在 SQL 结果中存在
- 验证变量值的数据类型
- 检查特殊字符转义

### 5. 内存泄漏问题

#### 问题现象
- 系统内存使用持续增长
- 规则引擎响应变慢
- 最终导致系统崩溃

#### 排查和解决

**5.1 检查规则配置**
```sql
-- 避免：无限制的数据选择
SELECT * FROM "$EVENT.PUBLISH"  -- 没有过滤条件

-- 推荐：添加合理的过滤条件
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/data' 
  AND timestamp > 1690599987495
```

**5.2 优化数据处理**
- 避免在规则中缓存大量数据
- 及时清理不再需要的规则
- 使用批量处理代替单条处理

## 性能监控指标

### 1. 关键监控指标

| 指标名称 | 说明 | 正常范围 | 异常阈值 |
|---------|------|---------|---------|
| 规则匹配率 | 规则匹配成功的比例 | >80% | <50% |
| 规则执行时间 | 单个规则的平均执行时间 | <100ms | >1s |
| 动作成功率 | 动作执行成功的比例 | >95% | <90% |
| 内存使用率 | 规则引擎内存占用 | <70% | >90% |
| 队列积压 | 待处理消息队列长度 | <1000 | >10000 |

### 2. 监控工具配置

**2.1 启用规则引擎监控**
```yaml
# application.yml
fluxmq:
  rule-engine:
    metrics:
      enabled: true
      collection-interval: 30s
    monitoring:
      slow-query-threshold: 1000ms
      memory-warning-threshold: 80%
```

**2.2 配置告警规则**
```sql
-- 监控规则执行失败
SELECT 
  'RULE_EXECUTION_FAILED' as alert_type,
  rule_name,
  error_message,
  datetime(timestamp) as failure_time
FROM "$EVENT.RULE_FAILED"
```

## 性能调优建议

### 1. 规则设计优化

**1.1 合理的规则粒度**
```sql
-- ❌ 避免：单个规则处理过多逻辑
SELECT 
  CASE 
    WHEN payload.type = 'temperature' THEN process_temperature()
    WHEN payload.type = 'humidity' THEN process_humidity()
    WHEN payload.type = 'pressure' THEN process_pressure()
    ...
  END as result
FROM "$EVENT.PUBLISH"

-- ✅ 推荐：拆分为多个专门的规则
-- 规则1：处理温度数据
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/temperature'

-- 规则2：处理湿度数据
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/humidity'
```

**1.2 索引友好的查询**
```sql
-- ✅ 推荐：使用索引字段进行过滤
SELECT * FROM "$EVENT.PUBLISH" 
WHERE clientId = 'device001'  -- clientId 通常有索引

-- ❌ 避免：对非索引字段进行复杂计算
SELECT * FROM "$EVENT.PUBLISH" 
WHERE md5(payload) = '...'
```

### 2. 数据源优化

**2.1 连接池配置**
```yaml
# MySQL 数据源优化
datasource:
  mysql:
    initial-size: 5
    max-active: 20
    max-wait: 60000
    validation-query: SELECT 1
    test-on-borrow: true
```

**2.2 批量操作**
```sql
-- 批量插入优化
INSERT INTO sensor_data (device_id, value, timestamp) VALUES
  ('${device1}', ${value1}, '${time1}'),
  ('${device2}', ${value2}, '${time2}'),
  ('${device3}', ${value3}, '${time3}');
```

### 3. 系统资源优化

**3.1 内存配置**
```bash
# JVM 内存参数
-Xms2g -Xmx4g 
-XX:NewRatio=2 
-XX:SurvivorRatio=8
-XX:+UseG1GC
```

**3.2 线程池配置**
```yaml
fluxmq:
  rule-engine:
    thread-pool:
      core-size: 10
      max-size: 50
      queue-capacity: 1000
      keep-alive: 60s
```

## 日志分析

### 1. 规则引擎日志配置

```xml
<!-- logback-spring.xml -->
<logger name="com.fluxmq.rule" level="INFO" additivity="false">
    <appender-ref ref="RULE_FILE"/>
</logger>

<appender name="RULE_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/rule-engine.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>logs/rule-engine.%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
</appender>
```

### 2. 关键日志信息

**2.1 规则执行日志**
```
2023-07-29 10:30:15 [INFO] Rule[sensor_data_storage] executed successfully, matched: 150, cost: 25ms
2023-07-29 10:30:16 [WARN] Rule[temperature_alert] execution slow, cost: 1200ms
2023-07-29 10:30:17 [ERROR] Rule[humidity_storage] failed, error: Connection timeout
```

**2.2 性能分析**
```bash
# 分析规则执行时间
grep "cost:" rule-engine.log | awk '{print $NF}' | sort -n

# 统计失败规则
grep "ERROR" rule-engine.log | awk '{print $4}' | sort | uniq -c

# 监控内存使用
grep "memory" rule-engine.log | tail -20
```

## 最佳实践总结

### 1. 预防性措施
- **规则测试**：新规则上线前充分测试
- **逐步部署**：先在测试环境验证，再部署到生产环境
- **监控预警**：建立完善的监控和告警机制
- **定期审查**：定期检查和优化现有规则

### 2. 故障响应流程
1. **快速定位**：通过监控指标快速识别问题
2. **日志分析**：查看详细的执行日志
3. **临时处理**：必要时禁用有问题的规则
4. **根因分析**：深入分析问题原因
5. **修复验证**：修复后在测试环境验证
6. **生产部署**：谨慎部署到生产环境

### 3. 性能优化原则
- **简单优先**：保持规则逻辑简单清晰
- **批量处理**：合理使用批量操作
- **资源监控**：持续监控系统资源使用
- **定期优化**：根据监控数据定期优化性能

通过遵循这些故障排查和性能优化指南，您可以确保 FluxMQ 规则引擎稳定高效地运行，及时发现和解决问题，为业务系统提供可靠的数据处理能力。