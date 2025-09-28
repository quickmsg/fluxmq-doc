# Endpoint 动态管理

FluxMQ 2.1.1 版本引入了基于 Ignite 的动态 Endpoint 管理功能，支持运行时添加、修改和删除 MQTT 端点，无需重启服务。

## 功能特性

### 🚀 动态管理
- **运行时配置**：无需重启服务即可添加、修改、删除 MQTT 端点
- **实时生效**：配置变更立即在所有集群节点生效
- **热更新**：支持端口、认证、ACL 等配置的动态调整

### 🔄 集群同步
- **全集群同步**：配置变更自动同步到所有集群节点
- **持久化存储**：支持 MySQL、PostgreSQL、本地存储等多种后端
- **故障恢复**：节点重启后自动恢复所有端点配置

### 📊 监控管理
- **状态监控**：实时查看端点运行状态
- **性能指标**：连接数、消息吞吐量等关键指标
- **配置历史**：支持配置变更历史追踪

## 核心概念

### Endpoint 配置模型

每个 MQTT 端点包含以下配置项：

```yaml
endpoint:
  port: 1883                    # 监听端口
  useWebsocket: false           # 是否启用 WebSocket
  path: "/mqtt"                # WebSocket 路径
  enableAuth: true             # 启用认证
  enableAcl: true              # 启用 ACL
  enableBridge: false          # 启用桥接
  messageMaxSize: 4194304      # 最大消息大小
  maxSessionSize: 100          # 最大会话数
  maxConnectionSize: 1000      # 最大连接数
  maxConnectionPerSecond: 100  # 每秒最大连接数
  sslConfig: {}                # SSL 配置
  serverOptions: {}             # 服务器选项
  childOptions: {}              # 子选项
  enabled: true                 # 是否启用
  isDefault: false             # 是否为默认端点
```

### 存储架构

- **Ignite 缓存**：所有配置存储在 `ENDPOINT_CONFIG` 缓存中
- **持久化**：支持多种存储后端（MySQL、PostgreSQL、本地文件）
- **集群同步**：配置变更自动同步到所有节点

## 快速开始

### 1. 配置存储后端

在 `config.yaml` 中配置存储：

```yaml
store:
  storeType: MYSQL  # MYSQL, POSTGRESQL, LOCAL, MEMORY
  datasource:
    url: jdbc:mysql://localhost:3306/fluxmq
    username: root
    password: password
    driver: com.mysql.cj.jdbc.Driver
```

### 2. 配置集群

```yaml
cluster:
  localAddress: 127.0.0.1
  addresses: ["127.0.0.1", "127.0.0.2"]
  # 或使用 Kubernetes 发现
  kubernetes:
    service: fluxmq
    namespace: default
```

### 3. 启动服务

```bash
# 启动 FluxMQ 服务
./fluxmq start
```

## API 使用

### 添加端点

```bash
POST /api/endpoints/add
Content-Type: application/json

{
    "port": 1884,
    "useWebsocket": false,
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 4194304,
    "maxSessionSize": 100,
    "maxConnectionPerSecond": 1000
}
```

### 更新端点

```bash
POST /api/endpoints/update
Content-Type: application/json

{
    "port": 1884,
    "useWebsocket": true,
    "path": "/mqtt",
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 8388608
}
```

### 删除端点

```bash
POST /api/endpoints/remove
Content-Type: application/json

{
    "port": 1884
}
```

### 查询端点列表

```bash
GET /api/endpoints/list
```

响应示例：

```json
{
    "code": 200,
    "data": {
        "endpoints": {
            "1883": {
                "port": 1883,
                "useWebsocket": false,
                "enableAuth": true,
                "enableAcl": true,
                "messageMaxSize": 4194304
            },
            "1884": {
                "port": 1884,
                "useWebsocket": true,
                "path": "/mqtt",
                "enableAuth": true,
                "enableAcl": true,
                "messageMaxSize": 8388608
            }
        },
        "activePorts": [1883, 1884],
        "total": 2
    },
    "message": "Success"
}
```

## 使用场景

### 1. 多租户隔离

为不同租户创建独立的 MQTT 端点：

```bash
# 租户 A
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 1883, "enableAuth": true, "enableAcl": true}'

# 租户 B  
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 1884, "enableAuth": true, "enableAcl": true}'
```

### 2. 协议适配

支持不同协议的需求：

```bash
# 标准 MQTT
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 1883, "useWebsocket": false}'

# WebSocket MQTT
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 8080, "useWebsocket": true, "path": "/mqtt"}'
```

### 3. 负载均衡

通过不同端口实现负载分发：

```bash
# 主服务端口
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 1883, "maxConnectionSize": 5000}'

# 备用服务端口
curl -X POST /api/endpoints/add \
  -H "Content-Type: application/json" \
  -d '{"port": 1884, "maxConnectionSize": 3000}'
```

## 监控和管理

### 端点状态监控

```bash
GET /api/endpoints/status?port=1883
```

### 性能指标

```bash
GET /api/endpoints/metrics?port=1883
```

### 配置检查

```bash
GET /api/endpoints/check-port?port=1884
```

## 最佳实践

### 1. 端口规划

- 使用不同端口范围区分服务类型
- 预留端口用于测试和开发
- 避免使用系统保留端口

### 2. 安全配置

- 为生产环境启用认证和 ACL
- 配置 SSL/TLS 加密
- 设置合理的连接限制

### 3. 性能优化

- 根据业务需求调整连接数限制
- 配置合适的消息大小限制
- 启用连接池优化

### 4. 监控告警

- 设置连接数告警阈值
- 监控端点健康状态
- 配置性能指标监控

## 故障排查

### 常见问题

1. **端口冲突**
   - 检查端口是否被占用
   - 使用 `GET /api/endpoints/check-port` 检查

2. **配置不生效**
   - 确认集群节点状态
   - 检查 Ignite 缓存同步

3. **连接失败**
   - 验证端点配置
   - 检查网络连通性

### 日志分析

```bash
# 查看端点启动日志
tail -f logs/fluxmq.log | grep "Endpoint"

# 查看集群同步日志
tail -f logs/fluxmq.log | grep "Cluster"
```

## 升级说明

### 从 2.1.0 升级

1. 备份现有配置
2. 更新到 2.1.1 版本
3. 配置 Ignite 存储
4. 验证端点功能

### 配置迁移

```bash
# 导出现有配置
GET /api/endpoints/export

# 导入到新版本
POST /api/endpoints/import
```

## 相关文档

- [端点配置详解](config.md)
- [API 参考](api.md)
- [监控指标](metrics.md)
- [故障排查](troubleshooting.md)
