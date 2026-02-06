# Endpoint 故障排查

本文档详细介绍 FluxMQ 2.1.2 版本中 Endpoint 常见问题的诊断和解决方法。

## 常见问题分类

### 1. 连接问题
- 端口冲突
- 网络连接失败
- 认证失败
- 连接超时

### 2. 配置问题
- 配置不生效
- 参数错误
- 权限不足
- 存储问题

### 3. 性能问题
- 连接数过多
- 消息处理慢
- 内存使用高
- CPU 使用率高

### 4. 集群问题
- 配置同步失败
- 节点通信异常
- 数据不一致
- 故障转移问题

## 连接问题排查

### 端口冲突

**问题现象**:
```
ERROR: Port 1883 is already in use
```

**排查步骤**:

1. 检查端口占用情况
```bash
# Linux/macOS
netstat -tulpn | grep :1883
lsof -i :1883

# Windows
netstat -ano | findstr :1883
```

2. 检查 FluxMQ 进程
```bash
ps aux | grep fluxmq
```

3. 使用 API 检查端口状态
```bash
curl -X GET "http://localhost:8080/api/endpoints/check-port?port=1883"
```

**解决方案**:
- 停止占用端口的进程
- 使用其他可用端口
- 配置端口复用

### 网络连接失败

**问题现象**:
```
ERROR: Failed to bind to address 0.0.0.0:1883
```

**排查步骤**:

1. 检查网络接口
```bash
ip addr show
ifconfig
```

2. 检查防火墙设置
```bash
# Linux
iptables -L
ufw status

# Windows
netsh advfirewall firewall show rule name=all
```

3. 检查端口监听
```bash
ss -tulpn | grep :1883
```

**解决方案**:
- 配置防火墙规则
- 检查网络接口状态
- 验证 IP 地址配置

### 认证失败

**问题现象**:
```
ERROR: Authentication failed for client
```

**排查步骤**:

1. 检查认证配置
```bash
curl -X GET "http://localhost:8080/api/endpoints/get?port=1883"
```

2. 验证认证数据源
```bash
# 检查数据库连接
mysql -h localhost -u root -p -e "SELECT * FROM users;"

# 检查 Redis 连接
redis-cli ping
```

3. 查看认证日志
```bash
tail -f logs/fluxmq.log | grep "Auth"
```

**解决方案**:
- 验证认证配置
- 检查数据源连接
- 确认用户凭据

## 配置问题排查

### 配置不生效

**问题现象**:
```
WARN: Configuration not applied
```

**排查步骤**:

1. 检查配置语法
```bash
curl -X POST "http://localhost:8080/api/endpoints/validate" \
  -H "Content-Type: application/json" \
  -d '{"port": 1883, "enableAuth": true}'
```

2. 验证集群状态
```bash
curl -X GET "http://localhost:8080/api/cluster/status"
```

3. 检查 Ignite 缓存
```bash
# 查看 Ignite 缓存状态
curl -X GET "http://localhost:8080/api/ignite/status"
```

**解决方案**:
- 修正配置语法错误
- 重启相关服务
- 检查集群同步状态

### 参数错误

**问题现象**:
```
ERROR: Invalid parameter value
```

**排查步骤**:

1. 检查参数范围
```yaml
# 有效参数范围
maxConnectionSize: 1-65535
maxSessionSize: 1-10000
messageMaxSize: 1024-16777216
```

2. 验证配置格式
```bash
# 使用配置验证 API
curl -X POST "http://localhost:8080/api/endpoints/validate-config" \
  -H "Content-Type: application/json" \
  -d @config.json
```

**解决方案**:
- 调整参数到有效范围
- 检查配置格式
- 参考配置文档

## 性能问题排查

### 连接数过多

**问题现象**:
```
WARN: Connection limit reached
```

**排查步骤**:

1. 检查当前连接数
```bash
curl -X GET "http://localhost:8080/api/endpoints/status?port=1883"
```

2. 分析连接模式
```bash
# 查看连接统计
curl -X GET "http://localhost:8080/api/endpoints/metrics?port=1883"
```

3. 检查客户端行为
```bash
# 查看连接日志
tail -f logs/fluxmq.log | grep "Connection"
```

**解决方案**:
- 增加最大连接数限制
- 优化客户端连接管理
- 实施连接池策略

### 消息处理慢

**问题现象**:
```
WARN: Message processing slow
```

**排查步骤**:

1. 检查消息队列状态
```bash
curl -X GET "http://localhost:8080/api/endpoints/metrics?port=1883"
```

2. 分析处理时间
```bash
# 查看性能指标
curl -X GET "http://localhost:8080/api/endpoints/performance?port=1883"
```

3. 检查系统资源
```bash
# 查看系统资源使用
top -p $(pgrep fluxmq)
iostat -x 1
```

**解决方案**:
- 优化消息处理逻辑
- 增加处理线程数
- 调整消息缓冲区大小

### 内存使用高

**问题现象**:
```
WARN: High memory usage
```

**排查步骤**:

1. 检查内存使用情况
```bash
# 查看 JVM 内存使用
jstat -gc $(pgrep fluxmq) 1s

# 查看系统内存
free -h
```

2. 分析内存泄漏
```bash
# 生成堆转储
jmap -dump:format=b,file=heap.hprof $(pgrep fluxmq)
```

3. 检查配置参数
```bash
curl -X GET "http://localhost:8080/api/endpoints/get?port=1883"
```

**解决方案**:
- 调整 JVM 内存参数
- 优化消息缓冲区配置
- 检查内存泄漏

## 集群问题排查

### 配置同步失败

**问题现象**:
```
ERROR: Configuration sync failed
```

**排查步骤**:

1. 检查集群状态
```bash
curl -X GET "http://localhost:8080/api/cluster/status"
```

2. 验证网络连通性
```bash
# 检查节点间通信
telnet node2 8080
ping node2
```

3. 查看同步日志
```bash
tail -f logs/fluxmq.log | grep "Sync"
```

**解决方案**:
- 检查网络连接
- 验证集群配置
- 重启同步服务

### 节点通信异常

**问题现象**:
```
ERROR: Node communication failed
```

**排查步骤**:

1. 检查节点状态
```bash
curl -X GET "http://localhost:8080/api/cluster/nodes"
```

2. 验证网络配置
```bash
# 检查网络接口
ip route show
traceroute node2
```

3. 查看通信日志
```bash
tail -f logs/fluxmq.log | grep "Cluster"
```

**解决方案**:
- 修复网络连接
- 更新集群配置
- 重启故障节点

## 诊断工具

### 健康检查

```bash
# 检查端点健康状态
curl -X GET "http://localhost:8080/api/endpoints/health?port=1883"

# 检查系统健康状态
curl -X GET "http://localhost:8080/api/system/health"
```

### 性能分析

```bash
# 获取性能指标
curl -X GET "http://localhost:8080/api/endpoints/metrics?port=1883"

# 获取系统资源使用
curl -X GET "http://localhost:8080/api/system/resources"
```

### 日志分析

```bash
# 查看错误日志
tail -f logs/fluxmq.log | grep "ERROR"

# 查看警告日志
tail -f logs/fluxmq.log | grep "WARN"

# 查看特定端点日志
tail -f logs/fluxmq.log | grep "Endpoint.*1883"
```

## 监控和告警

### 关键指标监控

1. **连接指标**
   - 当前连接数
   - 连接速率
   - 连接错误率

2. **消息指标**
   - 消息吞吐量
   - 消息延迟
   - 消息丢失率

3. **系统指标**
   - CPU 使用率
   - 内存使用率
   - 磁盘 I/O

### 告警规则

```yaml
# Prometheus 告警规则
groups:
  - name: fluxmq-endpoints
    rules:
      - alert: HighConnectionCount
        expr: fluxmq_endpoint_connections_current / fluxmq_endpoint_connections_max > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High connection count on endpoint {{ $labels.endpoint }}"

      - alert: HighErrorRate
        expr: fluxmq_endpoint_errors_rate > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on endpoint {{ $labels.endpoint }}"
```

## 预防措施

### 1. 配置管理

- 使用配置验证
- 实施配置备份
- 定期配置审查

### 2. 监控设置

- 设置关键指标监控
- 配置告警规则
- 定期性能分析

### 3. 容量规划

- 预测连接数增长
- 规划资源需求
- 实施负载均衡

### 4. 故障演练

- 定期故障演练
- 测试恢复流程
- 验证监控告警

## 应急响应

### 1. 快速诊断

```bash
# 快速健康检查
curl -X GET "http://localhost:8080/api/endpoints/health?port=1883"

# 查看关键指标
curl -X GET "http://localhost:8080/api/endpoints/metrics?port=1883"
```

### 2. 临时措施

- 重启故障端点
- 调整配置参数
- 启用备用端点

### 3. 根本解决

- 分析根本原因
- 实施永久修复
- 更新监控规则

## 联系支持

### 收集信息

在联系技术支持时，请提供以下信息：

1. **系统信息**
   - 操作系统版本
   - Java 版本
   - FluxMQ 版本

2. **配置信息**
   - 端点配置
   - 集群配置
   - 存储配置

3. **日志信息**
   - 错误日志
   - 警告日志
   - 系统日志

4. **监控数据**
   - 性能指标
   - 错误统计
   - 资源使用

### 支持渠道

- GitHub Issues
- 技术论坛
- 邮件支持
- 在线文档
