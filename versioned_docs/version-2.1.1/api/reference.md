# API 接口参考

本文档详细介绍 FluxMQ 2.1.1 版本中所有 HTTP API 接口，按照功能模块进行分类。

## 基础信息

- **基础路径**: 根据模块不同，基础路径不同
- **认证方式**: 支持 HTTP Basic Auth 和 Token 认证
- **内容类型**: `application/json`
- **字符编码**: UTF-8

## 端点管理 API

### 添加端点

添加新的 MQTT 端点。

**请求**

```http
POST /endpoints/add
Content-Type: application/json
```

**请求体**

```json
{
    "id": "endpoint-1883",
    "port": 1883,
    "useWebsocket": false,
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 4194304,
    "maxConnectionSize": 1000,
    "enabled": true
}
```

**响应**

```json
{
    "code": 200,
    "message": "success"
}
```

### 更新端点

更新现有端点的配置。

**请求**

```http
POST /endpoints/update
Content-Type: application/json
```

**请求体**

```json
{
    "id": "endpoint-1883",
    "port": 1883,
    "useWebsocket": true,
    "path": "/mqtt",
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 8388608
}
```

**响应**

```json
{
    "code": 200,
    "message": "success"
}
```

### 删除端点

删除指定的端点。

**请求**

```http
POST /endpoints/remove
Content-Type: application/json
```

**请求体**

```json
{
    "id": "endpoint-1883"
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint configuration removed successfully"
}
```

### 查询端点列表

获取所有端点的配置信息。

**请求**

```http
GET /endpoints/list
```

**响应**

```json
{
    "endpoints": {
        "endpoint-1883": {
            "id": "endpoint-1883",
            "port": 1883,
            "useWebsocket": false,
            "enableAuth": true,
            "enableAcl": true,
            "messageMaxSize": 4194304,
            "enabled": true
        }
    }
}
```

### 查询端点状态

获取指定端点的运行状态。

**请求**

```http
GET /endpoints/status?id=endpoint-1883
```

**响应**

```json
{
    "id": "endpoint-1883",
    "running": true,
    "endpointNumber": 45
}
```

### 检查端口可用性

检查指定端口是否可用。

**请求**

```http
GET /endpoints/check-port?port=1884
```

**响应**

```json
{
    "port": 1884,
    "available": true
}
```

## 系统管理 API

### 系统配置

获取系统配置信息。

**请求**

```http
GET /system/config
```

**响应**

```json
{
    "mqtt": {
        "port": 1883,
        "host": "0.0.0.0"
    },
    "http": {
        "port": 8080,
        "host": "0.0.0.0"
    },
    "cluster": {
        "enabled": false
    }
}
```

### 系统健康检查

检查系统健康状态。

**请求**

```http
GET /health
```

**响应**

```json
{
    "status": "UP",
    "timestamp": "2024-02-15T10:45:00Z"
}
```

### 集群信息

获取集群节点信息。

**请求**

```http
GET /public/cluster
```

**响应**

```json
{
    "nodes": [
        {
            "id": "node-1",
            "address": "127.0.0.1",
            "status": "active"
        }
    ]
}
```

### 配置导出

导出系统配置。

**请求**

```http
GET /system/config/export
```

**响应**

```json
{
    "config": "...",
    "timestamp": "2024-02-15T10:45:00Z"
}
```

### 配置导入

导入系统配置。

**请求**

```http
POST /api/system/config/import
Content-Type: application/json
```

**请求体**

```json
{
    "config": "..."
}
```

## MQTT 连接管理 API

### 查询连接

查询 MQTT 连接信息。

**请求**

```http
POST /mqtt/connection
Content-Type: application/json
```

**请求体**

```json
{
    "page": 1,
    "size": 20,
    "clientId": "client-001",
    "username": "user1"
}
```

**响应**

```json
{
    "data": [
        {
            "clientId": "client-001",
            "username": "user1",
            "ip": "127.0.0.1",
            "port": 12345,
            "connectTime": "2024-02-15T10:00:00Z",
            "lastActivity": "2024-02-15T10:45:00Z"
        }
    ],
    "total": 1,
    "page": 1,
    "size": 20
}
```

### 关闭连接

关闭指定的 MQTT 连接。

**请求**

```http
POST /mqtt/connection/close
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

**响应**

```json
{
    "code": 200,
    "message": "Connection closed successfully"
}
```

### 断开连接

断开指定的 MQTT 连接。

**请求**

```http
POST /mqtt/connection/down
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

### 连接运行时信息

获取连接运行时信息。

**请求**

```http
POST /mqtt/connection/runtime
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

### API 连接查询

通过 API 查询连接信息。

**请求**

```http
POST /api/mqtt/connection
Content-Type: application/json
```

## 消息发布 API

### 发布消息

发布 MQTT 消息。

**请求**

```http
POST /api/publish
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/temperature",
    "payload": "25.5",
    "qos": 1,
    "retain": false,
    "clientId": "http-publisher"
}
```

**响应**

```json
{
    "code": 0
}
```

### 连接检查

检查连接状态。

**请求**

```http
POST /api/check
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

### 关闭连接

关闭连接。

**请求**

```http
POST /api/close
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

## 主题管理 API

### 查询主题

查询主题信息。

**请求**

```http
POST /topic/query
Content-Type: application/json
```

**请求体**

```json
{
    "page": 1,
    "size": 20,
    "topic": "sensor/#"
}
```

**响应**

```json
{
    "data": [
        {
            "topic": "sensor/temperature",
            "subscribers": 5,
            "lastMessage": "2024-02-15T10:45:00Z"
        }
    ],
    "total": 1,
    "page": 1,
    "size": 20
}
```

### 主题连接查询

查询主题连接信息。

**请求**

```http
POST /topic/connect/query
Content-Type: application/json
```

## 订阅管理 API

### 本地订阅

创建本地订阅。

**请求**

```http
POST /api/local/subscribe
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/#",
    "qos": 1
}
```

### 连接订阅

为连接添加订阅。

**请求**

```http
POST /mqtt/connection/subscribe
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001",
    "topic": "sensor/#",
    "qos": 1
}
```

### 代理订阅

添加代理订阅。

**请求**

```http
POST /mqtt/proxy/subscribe/add
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/#",
    "qos": 1
}
```

### 查询代理订阅

查询代理订阅状态。

**请求**

```http
POST /mqtt/proxy/subscribe/status
Content-Type: application/json
```

### 删除代理订阅

删除代理订阅。

**请求**

```http
POST /mqtt/proxy/subscribe/delete
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/#"
}
```

## 规则引擎 API

### 添加规则

添加规则引擎规则。

**请求**

```http
POST /rule/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "temperature-rule",
    "sql": "SELECT * FROM 'sensor/temperature'",
    "actions": [
        {
            "type": "save_mysql",
            "config": {
                "table": "temperature_data"
            }
        }
    ]
}
```

**响应**

```json
"success"
```

### 查询规则

查询规则列表。

**请求**

```http
POST /rule/query
Content-Type: application/json
```

**请求体**

```json
{
    "page": 1,
    "size": 20,
    "name": "temperature"
}
```

### 删除规则

删除规则。

**请求**

```http
POST /rule/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "rule-001"
}
```

### 规则状态

设置规则状态。

**请求**

```http
POST /rule/state/set
Content-Type: application/json
```

**请求体**

```json
{
    "id": "rule-001",
    "enabled": true
}
```

### 规则测试

测试规则。

**请求**

```http
POST /rule/test
Content-Type: application/json
```

**请求体**

```json
{
    "sql": "SELECT * FROM 'sensor/temperature'",
    "testData": {
        "topic": "sensor/temperature",
        "payload": "25.5"
    }
}
```

### 规则运行时信息

获取规则运行时信息。

**请求**

```http
POST /rule/runtime
Content-Type: application/json
```

**请求体**

```json
{
    "id": "rule-001"
}
```

### 规则 SQL 解析

解析规则 SQL。

**请求**

```http
POST /rule/sql
Content-Type: application/json
```

**请求体**

```json
{
    "sql": "SELECT * FROM 'sensor/temperature'"
}
```

### 保存动作类型

获取保存动作类型。

**请求**

```http
POST /rule/actions
Content-Type: application/json
```

## 数据源管理 API

### 添加数据源

添加数据源。

**请求**

```http
POST /source/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "mysql-db",
    "type": "mysql",
    "config": {
        "url": "jdbc:mysql://localhost:3306/fluxmq",
        "username": "root",
        "password": "password"
    }
}
```

### 查询数据源

查询数据源列表。

**请求**

```http
POST /source/query
Content-Type: application/json
```

**请求体**

```json
{
    "page": 1,
    "size": 20,
    "type": "mysql"
}
```

### 删除数据源

删除数据源。

**请求**

```http
POST /source/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "source-001"
}
```

### 数据源类型

获取数据源类型列表。

**请求**

```http
GET /source/type
```

**响应**

```json
[
    "mysql",
    "postgresql",
    "redis",
    "kafka",
    "mongodb"
]
```

### 检查数据源

检查数据源连接。

**请求**

```http
POST /source/check
Content-Type: application/json
```

**请求体**

```json
{
    "id": "source-001"
}
```

### 查询数据源信息

查询数据源详细信息。

**请求**

```http
POST /source/query/info
Content-Type: application/json
```

**请求体**

```json
{
    "id": "source-001"
}
```

### 删除数据源查询

删除数据源查询。

**请求**

```http
POST /source/query/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "query-001"
}
```

## 认证管理 API

### 添加认证策略

添加认证策略。

**请求**

```http
POST /auth/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "mysql-auth",
    "type": "database",
    "config": {
        "datasource": {
            "url": "jdbc:mysql://localhost:3306/fluxmq",
            "username": "root",
            "password": "password"
        },
        "sql": "SELECT password FROM users WHERE username = ?"
    }
}
```

**响应**

```json
"success"
```

### 查询认证策略

查询认证策略列表。

**请求**

```http
POST /auth/query
Content-Type: application/json
```

### 删除认证策略

删除认证策略。

**请求**

```http
POST /auth/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "auth-001"
}
```

### 密码加密策略

获取密码加密策略。

**请求**

```http
POST /auth/password/encrypt
Content-Type: application/json
```

### 盐值类型策略

获取盐值类型策略。

**请求**

```http
POST /auth/salt/type
Content-Type: application/json
```

## ACL 管理 API

### 添加 ACL 策略

添加 ACL 策略。

**请求**

```http
POST /acl/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "topic-acl",
    "type": "database",
    "config": {
        "datasource": {
            "url": "jdbc:mysql://localhost:3306/fluxmq",
            "username": "root",
            "password": "password"
        },
        "sql": "SELECT permission FROM acl WHERE username = ? AND topic = ?"
    }
}
```

### 查询 ACL 策略

查询 ACL 策略列表。

**请求**

```http
POST /acl/query
Content-Type: application/json
```

### 删除 ACL 策略

删除 ACL 策略。

**请求**

```http
POST /acl/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "acl-001"
}
```

## 日志管理 API

### 查询日志

查询系统日志。

**请求**

```http
POST /log/query
Content-Type: application/json
```

**请求体**

```json
{
    "page": 1,
    "size": 20,
    "level": "INFO",
    "startTime": "2024-02-15T00:00:00Z",
    "endTime": "2024-02-15T23:59:59Z"
}
```

### 添加日志

添加日志记录。

**请求**

```http
POST /log/add
Content-Type: application/json
```

**请求体**

```json
{
    "level": "INFO",
    "message": "System started",
    "module": "system"
}
```

### 删除日志

删除日志记录。

**请求**

```http
POST /log/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "log-001"
}
```

### 下载日志

下载日志文件。

**请求**

```http
POST /log/download
Content-Type: application/json
```

### 远程查询日志

远程查询日志。

**请求**

```http
POST /log/remote/query
Content-Type: application/json
```

### 日志主题查询

查询日志主题。

**请求**

```http
GET /api/log/topics
```

### 添加日志主题

添加日志主题。

**请求**

```http
POST /api/log/topic/add
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/#",
    "level": "INFO"
}
```

### 删除日志主题

删除日志主题。

**请求**

```http
POST /api/log/topic/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "log-topic-001"
}
```

## 脚本管理 API

### 添加脚本

添加脚本。

**请求**

```http
POST /script/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "data-processor",
    "type": "javascript",
    "content": "function process(data) { return data * 2; }"
}
```

### 查询脚本

查询脚本列表。

**请求**

```http
POST /script/query
Content-Type: application/json
```

### 删除脚本

删除脚本。

**请求**

```http
POST /script/delete
Content-Type: application/json
```

**请求体**

```json
{
    "id": "script-001"
}
```

### 脚本状态

设置脚本状态。

**请求**

```http
POST /script/state
Content-Type: application/json
```

**请求体**

```json
{
    "id": "script-001",
    "enabled": true
}
```

### 检查脚本

检查脚本语法。

**请求**

```http
POST /script/check
Content-Type: application/json
```

**请求体**

```json
{
    "content": "function process(data) { return data * 2; }"
}
```

## 指令管理 API

### 指令类型

获取指令类型列表。

**请求**

```http
GET /command/type
```

**响应**

```json
[
    "KAFKA",
    "ROCKETMQ",
    "RABBITMQ",
    "PULSAR",
    "NACOS"
]
```

### 添加指令

添加指令配置。

**请求**

```http
POST /command/add
Content-Type: application/json
```

**请求体**

```json
{
    "type": "KAFKA",
    "config": {
        "bootstrapServers": "localhost:9092",
        "topic": "mqtt-messages"
    }
}
```

## 扩展管理 API

### 添加扩展

添加扩展配置。

**请求**

```http
POST /extension/add
Content-Type: application/json
```

**请求体**

```json
{
    "name": "custom-extension",
    "type": "processor",
    "config": {
        "className": "com.example.CustomProcessor"
    }
}
```

## 监控 API

### Prometheus 指标

获取 Prometheus 格式的监控指标。

**请求**

```http
GET /prometheus
```

**响应**

```
# HELP fluxmq_connections_total Total number of connections
# TYPE fluxmq_connections_total counter
fluxmq_connections_total 150

# HELP fluxmq_messages_total Total number of messages
# TYPE fluxmq_messages_total counter
fluxmq_messages_total 10000
```

### 仪表板

获取监控仪表板数据。

**请求**

```http
GET /monitor/dashboard
```

### 保存仪表板

保存仪表板配置。

**请求**

```http
POST /monitor/dashboard
Content-Type: application/json
```

**请求体**

```json
{
    "name": "system-dashboard",
    "panels": [
        {
            "title": "Connections",
            "type": "stat",
            "metric": "fluxmq_connections_total"
        }
    ]
}
```

## 会话管理 API

### 查询会话消息

查询会话消息。

**请求**

```http
POST /mqtt/session/query
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001",
    "page": 1,
    "size": 20
}
```

### 清除会话消息

清除会话消息。

**请求**

```http
POST /mqtt/session/clear
Content-Type: application/json
```

**请求体**

```json
{
    "clientId": "client-001"
}
```

## 保留消息 API

### 查询保留消息

查询保留消息。

**请求**

```http
POST /mqtt/retain/query
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/#",
    "page": 1,
    "size": 20
}
```

### 删除保留消息

删除保留消息。

**请求**

```http
POST /mqtt/retain/delete
Content-Type: application/json
```

**请求体**

```json
{
    "topic": "sensor/temperature"
}
```

## 公共 API

### 登录

用户登录。

**请求**

```http
POST /public/login
Content-Type: application/json
```

**请求体**

```json
{
    "username": "admin",
    "password": "password"
}
```

**响应**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires": "2024-02-16T10:45:00Z"
}
```

### 许可证信息

获取许可证信息。

**请求**

```http
GET /public/license
```

**响应**

```json
{
    "type": "trial",
    "expires": "2024-12-31T23:59:59Z",
    "features": ["mqtt", "rules", "acl"]
}
```

### 许可证导入

导入许可证。

**请求**

```http
POST /license/import
Content-Type: application/json
```

**请求体**

```json
{
    "license": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 刷新许可证

刷新许可证。

**请求**

```http
POST /license/refresh
Content-Type: application/json
```

## 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 认证失败 | 检查认证信息 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源ID |
| 409 | 资源冲突 | 检查资源状态 |
| 500 | 服务器内部错误 | 查看服务器日志 |

## 使用示例

### cURL 示例

```bash
# 发布消息
curl -X POST http://localhost:8080/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "sensor/temperature",
    "payload": "25.5",
    "qos": 1
  }'

# 查询连接
curl -X POST http://localhost:8080/mqtt/connection \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "size": 20
  }'

# 添加规则
curl -X POST http://localhost:8080/rule/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "temperature-rule",
    "sql": "SELECT * FROM '\''sensor/temperature'\''",
    "actions": [{"type": "save_mysql", "config": {"table": "temperature_data"}}]
  }'
```

### JavaScript 示例

```javascript
// 发布消息
const publishMessage = async (topic, payload) => {
  const response = await fetch('/api/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic,
      payload: payload,
      qos: 1
    })
  });
  
  return await response.json();
};

// 查询连接
const getConnections = async (page = 1, size = 20) => {
  const response = await fetch('/mqtt/connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page, size })
  });
  
  return await response.json();
};
```

### Python 示例

```python
import requests
import json

# 发布消息
def publish_message(topic, payload):
    url = "http://localhost:8080/api/publish"
    data = {
        "topic": topic,
        "payload": payload,
        "qos": 1
    }
    
    response = requests.post(url, json=data)
    return response.json()

# 查询连接
def get_connections(page=1, size=20):
    url = "http://localhost:8080/mqtt/connection"
    data = {"page": page, "size": size}
    
    response = requests.post(url, json=data)
    return response.json()
```