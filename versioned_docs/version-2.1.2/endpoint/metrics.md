# Endpoint 监控指标

本文档详细介绍 FluxMQ 2.1.2 版本中 Endpoint 的监控指标和性能数据。

## 指标概览

FluxMQ 2.1.2 版本提供了丰富的端点监控指标，帮助您了解系统运行状态和性能表现。

### 指标分类

- **连接指标**: 连接数、连接速率、连接状态
- **消息指标**: 消息吞吐量、消息延迟、消息丢失
- **会话指标**: 会话数、会话持久化、会话状态
- **性能指标**: CPU 使用率、内存使用率、响应时间
- **错误指标**: 错误率、异常统计、失败原因

## 连接指标

### 当前连接数

**指标名称**: `fluxmq_endpoint_connections_current`

**描述**: 当前活跃连接数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_connections_current{port="1883",endpoint="mqtt-1883"} 45
```

### 最大连接数

**指标名称**: `fluxmq_endpoint_connections_max`

**描述**: 配置的最大连接数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_connections_max{port="1883",endpoint="mqtt-1883"} 1000
```

### 连接速率

**指标名称**: `fluxmq_endpoint_connections_rate`

**描述**: 每秒新连接数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_connections_rate{port="1883",endpoint="mqtt-1883"} 2.5
```

### 总连接数

**指标名称**: `fluxmq_endpoint_connections_total`

**描述**: 累计连接总数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_connections_total{port="1883",endpoint="mqtt-1883"} 1250
```

## 消息指标

### 消息接收速率

**指标名称**: `fluxmq_endpoint_messages_received_rate`

**描述**: 每秒接收消息数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_messages_received_rate{port="1883",endpoint="mqtt-1883"} 100.5
```

### 消息发送速率

**指标名称**: `fluxmq_endpoint_messages_sent_rate`

**描述**: 每秒发送消息数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_messages_sent_rate{port="1883",endpoint="mqtt-1883"} 98.2
```

### 消息丢失数

**指标名称**: `fluxmq_endpoint_messages_dropped_total`

**描述**: 累计丢失消息数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `reason`: 丢失原因（buffer_full, client_disconnected, etc.）

**示例**:
```
fluxmq_endpoint_messages_dropped_total{port="1883",endpoint="mqtt-1883",reason="buffer_full"} 5
```

### 消息大小

**指标名称**: `fluxmq_endpoint_message_size_bytes`

**描述**: 消息大小分布

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `direction`: 消息方向（in, out）

**示例**:
```
fluxmq_endpoint_message_size_bytes{port="1883",endpoint="mqtt-1883",direction="in"} 1024
```

## 会话指标

### 当前会话数

**指标名称**: `fluxmq_endpoint_sessions_current`

**描述**: 当前活跃会话数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_sessions_current{port="1883",endpoint="mqtt-1883"} 40
```

### 最大会话数

**指标名称**: `fluxmq_endpoint_sessions_max`

**描述**: 配置的最大会话数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_sessions_max{port="1883",endpoint="mqtt-1883"} 100
```

### 会话持久化

**指标名称**: `fluxmq_endpoint_sessions_persistent`

**描述**: 持久化会话数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_sessions_persistent{port="1883",endpoint="mqtt-1883"} 35
```

## 性能指标

### CPU 使用率

**指标名称**: `fluxmq_endpoint_cpu_usage_percent`

**描述**: CPU 使用率百分比

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_cpu_usage_percent{port="1883",endpoint="mqtt-1883"} 15.5
```

### 内存使用量

**指标名称**: `fluxmq_endpoint_memory_usage_bytes`

**描述**: 内存使用量（字节）

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `type`: 内存类型（heap, non_heap）

**示例**:
```
fluxmq_endpoint_memory_usage_bytes{port="1883",endpoint="mqtt-1883",type="heap"} 268435456
```

### 响应时间

**指标名称**: `fluxmq_endpoint_response_time_seconds`

**描述**: 平均响应时间（秒）

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `operation`: 操作类型（connect, publish, subscribe）

**示例**:
```
fluxmq_endpoint_response_time_seconds{port="1883",endpoint="mqtt-1883",operation="connect"} 0.002
```

## 错误指标

### 错误率

**指标名称**: `fluxmq_endpoint_errors_rate`

**描述**: 每秒错误数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `error_type`: 错误类型（auth_failed, acl_denied, protocol_error）

**示例**:
```
fluxmq_endpoint_errors_rate{port="1883",endpoint="mqtt-1883",error_type="auth_failed"} 0.1
```

### 连接错误

**指标名称**: `fluxmq_endpoint_connection_errors_total`

**描述**: 累计连接错误数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识
- `error_code`: 错误代码

**示例**:
```
fluxmq_endpoint_connection_errors_total{port="1883",endpoint="mqtt-1883",error_code="CONNECTION_REFUSED"} 5
```

## 业务指标

### 主题订阅数

**指标名称**: `fluxmq_endpoint_subscriptions_current`

**描述**: 当前订阅数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_subscriptions_current{port="1883",endpoint="mqtt-1883"} 120
```

### 主题发布数

**指标名称**: `fluxmq_endpoint_topics_published_total`

**描述**: 累计发布主题数

**标签**:
- `port`: 端点端口
- `endpoint`: 端点标识

**示例**:
```
fluxmq_endpoint_topics_published_total{port="1883",endpoint="mqtt-1883"} 5000
```

## 监控配置

### Prometheus 配置

在 `prometheus.yml` 中添加 FluxMQ 端点监控：

```yaml
scrape_configs:
  - job_name: 'fluxmq-endpoints'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/api/endpoints/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
```

### Grafana 仪表板

创建 Grafana 仪表板监控端点指标：

```json
{
  "dashboard": {
    "title": "FluxMQ Endpoints",
    "panels": [
      {
        "title": "Connection Count",
        "type": "stat",
        "targets": [
          {
            "expr": "fluxmq_endpoint_connections_current",
            "legendFormat": "{{endpoint}}"
          }
        ]
      },
      {
        "title": "Message Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(fluxmq_endpoint_messages_received_total[5m])",
            "legendFormat": "Received - {{endpoint}}"
          },
          {
            "expr": "rate(fluxmq_endpoint_messages_sent_total[5m])",
            "legendFormat": "Sent - {{endpoint}}"
          }
        ]
      }
    ]
  }
}
```

## API 接口

### 获取指标

**请求**

```http
GET /api/endpoints/metrics?port=1883&format=prometheus
```

**响应**

```
# HELP fluxmq_endpoint_connections_current Current connection count
# TYPE fluxmq_endpoint_connections_current gauge
fluxmq_endpoint_connections_current{port="1883",endpoint="mqtt-1883"} 45

# HELP fluxmq_endpoint_messages_received_rate Message receive rate
# TYPE fluxmq_endpoint_messages_received_rate gauge
fluxmq_endpoint_messages_received_rate{port="1883",endpoint="mqtt-1883"} 100.5
```

### 获取 JSON 格式指标

**请求**

```http
GET /api/endpoints/metrics?port=1883&format=json
```

**响应**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "port": 1883,
    "timestamp": "2024-02-15T10:45:00Z",
    "metrics": {
      "connections": {
        "current": 45,
        "max": 1000,
        "rate": 2.5,
        "total": 1250
      },
      "messages": {
        "received": 15000,
        "sent": 14800,
        "dropped": 5,
        "receivedRate": 100.5,
        "sentRate": 98.2
      },
      "sessions": {
        "current": 40,
        "max": 100,
        "persistent": 35
      },
      "performance": {
        "cpuUsage": 15.5,
        "memoryUsage": 268435456,
        "responseTime": 0.002
      },
      "errors": {
        "rate": 0.1,
        "authFailed": 2,
        "aclDenied": 1,
        "connectionErrors": 5
      }
    }
  }
}
```

## 告警规则

### Prometheus 告警规则

```yaml
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
          description: "Connection count is {{ $value }}% of maximum"

      - alert: HighErrorRate
        expr: fluxmq_endpoint_errors_rate > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on endpoint {{ $labels.endpoint }}"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighMemoryUsage
        expr: fluxmq_endpoint_memory_usage_bytes > 1073741824  # 1GB
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on endpoint {{ $labels.endpoint }}"
          description: "Memory usage is {{ $value }} bytes"
```

## 监控最佳实践

### 1. 关键指标监控

- **连接数**: 监控当前连接数是否接近最大值
- **消息速率**: 监控消息处理能力是否满足需求
- **错误率**: 监控错误率是否在可接受范围内
- **资源使用**: 监控 CPU 和内存使用情况

### 2. 告警设置

- 设置合理的告警阈值
- 避免告警风暴
- 配置告警通知渠道
- 定期审查告警规则

### 3. 性能优化

- 根据监控数据调整配置
- 识别性能瓶颈
- 优化资源使用
- 预测容量需求

### 4. 故障排查

- 使用监控数据定位问题
- 分析错误模式
- 追踪性能变化
- 制定应急预案

## 监控工具集成

### 与 Prometheus 集成

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'fluxmq'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/api/endpoints/metrics'
    scrape_interval: 15s
```

### 与 Grafana 集成

```json
{
  "datasource": {
    "type": "prometheus",
    "url": "http://localhost:9090",
    "access": "proxy"
  }
}
```

### 与 AlertManager 集成

```yaml
# alertmanager.yml
route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
receivers:
- name: 'web.hook'
  webhook_configs:
  - url: 'http://127.0.0.1:5001/'
```
