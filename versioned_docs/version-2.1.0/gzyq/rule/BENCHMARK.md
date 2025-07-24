# FluxMQ 2.1.0 规则引擎性能基准测试

## 概述
本文档提供 FluxMQ 2.1.0 版本规则引擎的性能基准测试数据，包括与前版本的对比分析，帮助用户了解性能改进和系统容量规划。

## 测试环境

### 硬件配置
- **CPU**: Intel Xeon E5-2686 v4 @ 2.3GHz (8 cores)
- **内存**: 32GB DDR4
- **存储**: SSD 500GB
- **网络**: 万兆以太网

### 软件环境
- **操作系统**: CentOS 7.8
- **Java版本**: OpenJDK 11.0.16
- **JVM参数**: `-Xms4g -Xmx8g -XX:+UseG1GC`
- **数据库**: MySQL 8.0.28, Redis 6.2.6

## 性能测试指标

### 核心性能指标

| 测试项目 | FluxMQ 2.0.18 | FluxMQ 2.1.0 | 性能提升 |
|---------|---------------|--------------|---------|
| 规则执行吞吐量 | 50,000 msg/s | 70,000 msg/s | +40% |
| 单规则平均执行时间 | 120ms | 75ms | +37.5% |
| 内存使用（10万条规则） | 2.8GB | 2.1GB | -25% |
| CPU使用率（峰值负载） | 85% | 68% | -20% |
| 并发规则数量 | 1,000 | 2,000 | +100% |

### 函数执行性能对比

| 函数类型 | 2.0.18 平均耗时 | 2.1.0 平均耗时 | 性能提升 |
|---------|----------------|----------------|---------|
| 字符串处理 | 2.5ms | 1.2ms | +52% |
| JSON解析 | 8.3ms | 4.1ms | +51% |
| 时间格式化 | 1.8ms | 0.9ms | +50% |
| 数据类型转换 | 1.2ms | 0.6ms | +50% |
| 加密哈希 | 5.4ms | 3.2ms | +41% |

## 详细测试结果

### 1. 吞吐量测试

#### 测试场景
- 模拟 10,000 个并发 MQTT 客户端
- 每个客户端每秒发送 10 条消息
- 总消息吞吐量：100,000 msg/s
- 配置 100 个不同复杂度的规则

#### 测试结果

**简单规则性能（仅主题过滤）：**
```sql
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = 'sensor/temperature'
```

| 版本 | 处理吞吐量 | 平均延迟 | 99分位延迟 |
|------|-----------|---------|-----------|
| 2.0.18 | 95,000 msg/s | 15ms | 45ms |
| 2.1.0 | 135,000 msg/s | 10ms | 28ms |

**复杂规则性能（包含函数调用）：**
```sql
SELECT 
  uuid() as id,
  json(payload) as data,
  datetime(timestamp) as time,
  md5(clientId) as hash
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/data' AND payload.value > 30
```

| 版本 | 处理吞吐量 | 平均延迟 | 99分位延迟 |
|------|-----------|---------|-----------|
| 2.0.18 | 25,000 msg/s | 85ms | 180ms |
| 2.1.0 | 45,000 msg/s | 55ms | 120ms |

### 2. 内存使用效率测试

#### 测试场景
- 创建不同数量的活跃规则
- 每个规则处理 1,000 msg/s
- 监控系统内存使用

#### 测试结果

| 规则数量 | 2.0.18 内存使用 | 2.1.0 内存使用 | 内存节省 |
|---------|----------------|----------------|---------|
| 100 | 680MB | 520MB | -23.5% |
| 500 | 1.8GB | 1.3GB | -27.8% |
| 1,000 | 2.8GB | 2.1GB | -25.0% |
| 2,000 | 4.5GB | 3.2GB | -28.9% |

### 3. 函数库性能测试

#### 新增函数性能基准

**字符串处理函数：**
```sql
SELECT 
  split(topic, '/') as parts,
  substring(clientId, 0, 8) as prefix,
  find(payload, 'error') as error_info
FROM "$EVENT.PUBLISH"
```

- **执行时间**: 1.2ms (平均)
- **内存占用**: 85KB (临时)
- **CPU使用**: 2.5%

**时间处理函数：**
```sql
SELECT 
  date(timestamp) as date_str,
  datetime(timestamp) as datetime_str,
  datetimeToTimestamp("2023-07-29 10:30:15") as ts
FROM "$EVENT.PUBLISH"
```

- **执行时间**: 0.9ms (平均)
- **内存占用**: 45KB (临时)
- **CPU使用**: 1.8%

**加密函数：**
```sql
SELECT 
  md5(payload) as payload_hash,
  sha256(clientId) as client_hash,
  uuid() as message_id
FROM "$EVENT.PUBLISH"
```

- **执行时间**: 3.2ms (平均)
- **内存占用**: 128KB (临时)
- **CPU使用**: 5.2%

### 4. 数据源连接性能

#### MySQL 数据源性能

| 操作类型 | 2.0.18 | 2.1.0 | 改进 |
|---------|--------|-------|------|
| 单条插入 | 15ms | 12ms | +20% |
| 批量插入(100条) | 45ms | 32ms | +29% |
| 查询操作 | 8ms | 6ms | +25% |
| 连接池效率 | 85% | 92% | +8% |

#### Redis 数据源性能

| 操作类型 | 2.0.18 | 2.1.0 | 改进 |
|---------|--------|-------|------|
| SET 操作 | 2ms | 1.5ms | +25% |
| GET 操作 | 1.5ms | 1.2ms | +20% |
| 批量操作 | 8ms | 5ms | +37.5% |
| 连接复用率 | 78% | 88% | +12.8% |

### 5. 离线消息性能测试

#### 测试场景
- 10,000 个客户端随机上下线
- 每个客户端有 50 条离线消息
- 测试消息存储和投递性能

#### MySQL 离线存储性能

| 指标 | 测试结果 |
|------|---------|
| 消息存储吞吐量 | 25,000 msg/s |
| 消息查询性能 | 200 query/s |
| 消息删除性能 | 15,000 delete/s |
| 平均投递延迟 | 150ms |

#### Redis 离线存储性能

| 指标 | 测试结果 |
|------|---------|
| 消息存储吞吐量 | 80,000 msg/s |
| 消息查询性能 | 1,200 query/s |
| 消息删除性能 | 60,000 delete/s |
| 平均投递延迟 | 45ms |

## 压力测试结果

### 极限负载测试

#### 测试配置
- **并发客户端**: 50,000
- **消息频率**: 每客户端 5 msg/s
- **总消息量**: 250,000 msg/s
- **规则数量**: 500 个复杂规则
- **测试时长**: 2 小时

#### 系统表现

| 指标 | FluxMQ 2.0.18 | FluxMQ 2.1.0 |
|------|---------------|--------------|
| 成功处理率 | 87.5% | 96.8% |
| 平均响应时间 | 235ms | 145ms |
| 99分位响应时间 | 850ms | 420ms |
| 内存峰值使用 | 7.2GB | 5.1GB |
| CPU峰值使用 | 95% | 78% |
| 系统稳定性 | 偶有卡顿 | 稳定运行 |

### 长时间稳定性测试

#### 测试配置
- **运行时间**: 72 小时
- **消息量**: 100,000 msg/s 恒定负载
- **规则数量**: 200 个

#### 内存使用趋势

| 时间点 | 2.0.18 内存使用 | 2.1.0 内存使用 |
|-------|----------------|----------------|
| 1小时 | 3.2GB | 2.4GB |
| 12小时 | 4.1GB | 2.8GB |
| 24小时 | 4.8GB | 3.0GB |
| 48小时 | 5.5GB | 3.1GB |
| 72小时 | 6.2GB | 3.2GB |

**结论**: 2.1.0 版本有效解决了内存泄漏问题，长时间运行更稳定。

## 性能调优建议

### 系统级优化

#### JVM 参数推荐
```bash
# 生产环境推荐配置（16GB 内存服务器）
-Xms8g -Xmx8g
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:G1HeapRegionSize=16m
-XX:+G1UseAdaptiveIHOP
-XX:G1ReservePercent=20
```

#### 系统参数调优
```bash
# 网络优化
echo 'net.core.rmem_max = 33554432' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 33554432' >> /etc/sysctl.conf

# 文件描述符限制
echo '* soft nofile 65536' >> /etc/security/limits.conf
echo '* hard nofile 65536' >> /etc/security/limits.conf
```

### 规则设计优化

#### 高性能规则模式
```sql
-- ✅ 推荐：使用精确匹配
SELECT * FROM "$EVENT.PUBLISH" 
WHERE clientId = 'device001'

-- ✅ 推荐：合理的通配符使用
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/temperature'

-- ❌ 避免：过于宽泛的匹配
SELECT * FROM "$EVENT.PUBLISH" 
WHERE topic =~ '#'
```

#### 函数使用优化
```sql
-- ✅ 推荐：批量处理
SELECT 
  json(payload) as data,
  datetime(timestamp) as time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/data'

-- ❌ 避免：重复计算
SELECT 
  json(payload) as data1,
  json(payload) as data2  -- 重复调用同一函数
FROM "$EVENT.PUBLISH"
```

## 监控指标建议

### 关键性能指标 (KPI)

| 指标名称 | 目标值 | 警告阈值 | 严重阈值 |
|---------|--------|---------|---------|
| 规则执行成功率 | &gt;99% | &lt;95% | &lt;90% |
| 平均执行延迟 | &lt;100ms | &gt;200ms | &gt;500ms |
| 内存使用率 | &lt;70% | &gt;80% | &gt;90% |
| CPU使用率 | &lt;60% | &gt;75% | &gt;85% |
| 规则队列积压 | &lt;1000 | &gt;5000 | &gt;10000 |

### 监控设置示例
```yaml
# Prometheus 监控配置
- alert: RuleEngineHighLatency
  expr: rule_engine_execution_duration_seconds{quantile="0.99"} > 0.5
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "规则引擎执行延迟过高"

- alert: RuleEngineMemoryHigh
  expr: process_resident_memory_bytes / node_memory_MemTotal_bytes > 0.8
  for: 10m
  labels:
    severity: critical
  annotations:
    summary: "规则引擎内存使用过高"
```

## 总结

FluxMQ 2.1.0 版本在规则引擎性能方面取得了显著提升：

### 核心改进
- **执行效率提升 40%**：优化了SQL解析和执行引擎
- **内存使用减少 25%**：改进了内存管理和垃圾回收
- **函数库性能提升 50%**：重写了核心函数实现
- **并发能力翻倍**：优化了线程模型和资源调度

### 新特性带来的优势
- **离线消息处理**：提供了完整的离线消息解决方案
- **更多数据源支持**：扩展了系统集成能力
- **增强的函数库**：提供了更丰富的数据处理能力

### 建议
- **新部署**：直接使用 2.1.0 版本获得最佳性能
- **版本升级**：建议从旧版本升级以获得性能提升
- **容量规划**：可以在相同硬件上处理更多规则和消息
- **监控优化**：利用新的性能指标进行更好的系统监控

通过合理的系统配置和规则设计，FluxMQ 2.1.0 规则引擎可以满足大规模 IoT 场景的高性能要求。