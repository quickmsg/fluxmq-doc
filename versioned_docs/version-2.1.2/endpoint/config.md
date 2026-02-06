# Endpoint 配置详解

本文档详细介绍 FluxMQ 2.1.2 版本中 Endpoint 的各种配置选项和使用方法。

## 基础配置

### 端口配置

```yaml
endpoint:
  port: 1883                    # MQTT 监听端口
  useWebsocket: false          # 是否启用 WebSocket 支持
  path: "/mqtt"               # WebSocket 路径（仅 WebSocket 模式）
```

**端口选择建议：**
- 标准 MQTT：1883（非加密）、8883（SSL/TLS）
- WebSocket MQTT：8080、8083
- 避免使用系统保留端口（< 1024）

### 协议配置

#### 标准 MQTT

```yaml
endpoint:
  port: 1883
  useWebsocket: false
  # 其他配置...
```

#### WebSocket MQTT

```yaml
endpoint:
  port: 8080
  useWebsocket: true
  path: "/mqtt"
  # 其他配置...
```

## 安全配置

### 认证配置

```yaml
endpoint:
  enableAuth: true             # 启用客户端认证
  authType: "database"         # 认证类型：database, redis, http, fixed
  authConfig:
    # 数据库认证配置
    datasource:
      url: "jdbc:mysql://localhost:3306/fluxmq"
      username: "root"
      password: "password"
    # 或 Redis 认证配置
    redis:
      host: "localhost"
      port: 6379
      password: ""
```

### ACL 配置

```yaml
endpoint:
  enableAcl: true              # 启用访问控制
  aclType: "database"          # ACL 类型：database, redis, http, config
  aclConfig:
    # 数据库 ACL 配置
    datasource:
      url: "jdbc:mysql://localhost:3306/fluxmq"
      username: "root"
      password: "password"
    # 或配置文件 ACL
    config:
      rules:
        - username: "admin"
          allow: ["#"]
        - username: "user"
          allow: ["test/#"]
```

### SSL/TLS 配置

```yaml
endpoint:
  sslConfig:
    enabled: true              # 启用 SSL/TLS
    keyStorePath: "/path/to/keystore.jks"
    keyStorePassword: "password"
    trustStorePath: "/path/to/truststore.jks"
    trustStorePassword: "password"
    protocols: ["TLSv1.2", "TLSv1.3"]
    cipherSuites: ["TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"]
```

## 性能配置

### 连接限制

```yaml
endpoint:
  maxConnectionSize: 1000      # 最大连接数
  maxConnectionPerSecond: 100  # 每秒最大连接数
  maxSessionSize: 100          # 最大会话数
  exclusivePool: false         # 是否使用独占连接池
```

### 消息配置

```yaml
endpoint:
  messageMaxSize: 4194304      # 最大消息大小（字节）
  maxSendWindowSize: 16        # 最大发送窗口大小
  maxReceiveWindowSize: 16     # 最大接收窗口大小
```

### 性能优化

```yaml
endpoint:
  sessionPersistence: true     # 会话持久化
  aclRefreshPeriod: 300       # ACL 刷新周期（秒）
  metrics: true                # 启用指标收集
  wiretap: false              # 启用消息监听
```

## 高级配置

### 服务器选项

```yaml
endpoint:
  serverOptions:
    # Netty 服务器选项
    soBacklog: 128
    soReuseaddr: true
    tcpNodelay: true
    soKeepalive: true
    # 线程池配置
    bossGroupSize: 1
    workerGroupSize: 4
    # 其他选项...
```

### 子选项配置

```yaml
endpoint:
  childOptions:
    # Netty 子选项
    soKeepalive: true
    tcpNodelay: true
    soLinger: 0
    # 其他选项...
```

### 桥接配置

```yaml
endpoint:
  enableBridge: false         # 启用桥接功能
  bridgeConfig:
    remoteHost: "remote-mqtt-broker.com"
    remotePort: 1883
    clientId: "bridge-client"
    username: "bridge-user"
    password: "bridge-password"
    topics:
      - "sensor/#"
      - "device/+/status"
```

## 存储配置

### Ignite 存储

```yaml
store:
  storeType: IGNITE            # 使用 Ignite 存储
  ignite:
    configPath: "/path/to/ignite.xml"
    cacheName: "ENDPOINT_CONFIG"
    persistence: true
    backupCount: 1
```

### 数据库存储

```yaml
store:
  storeType: MYSQL             # 或 POSTGRESQL
  datasource:
    url: "jdbc:mysql://localhost:3306/fluxmq"
    username: "root"
    password: "password"
    driver: "com.mysql.cj.jdbc.Driver"
    maxPoolSize: 10
    minPoolSize: 2
```

### 本地存储

```yaml
store:
  storeType: LOCAL
  local:
    dataPath: "/var/lib/fluxmq/endpoints"
    backupPath: "/var/backups/fluxmq/endpoints"
```

## 集群配置

### 集群发现

```yaml
cluster:
  localAddress: "127.0.0.1"
  addresses: 
    - "127.0.0.1"
    - "127.0.0.2"
    - "127.0.0.3"
```

### Kubernetes 发现

```yaml
cluster:
  kubernetes:
    enabled: true
    service: "fluxmq"
    namespace: "default"
    port: 8080
```

### 配置同步

```yaml
cluster:
  sync:
    enabled: true
    interval: 5000            # 同步间隔（毫秒）
    timeout: 30000            # 同步超时（毫秒）
    retryCount: 3             # 重试次数
```

## 监控配置

### 指标收集

```yaml
endpoint:
  metrics: true               # 启用指标收集
  metricsConfig:
    enabled: true
    port: 9090
    path: "/metrics"
    format: "prometheus"       # prometheus, json
```

### 日志配置

```yaml
endpoint:
  logging:
    level: "INFO"             # DEBUG, INFO, WARN, ERROR
    format: "json"             # json, text
    file: "/var/log/fluxmq/endpoint.log"
    maxSize: "100MB"
    maxFiles: 10
```

## 配置示例

### 生产环境配置

```yaml
# 生产环境端点配置
endpoint:
  port: 1883
  useWebsocket: false
  enableAuth: true
  enableAcl: true
  messageMaxSize: 4194304
  maxConnectionSize: 5000
  maxConnectionPerSecond: 1000
  maxSessionSize: 1000
  sslConfig:
    enabled: true
    keyStorePath: "/etc/ssl/keystore.jks"
    keyStorePassword: "${SSL_KEYSTORE_PASSWORD}"
  metrics: true
  sessionPersistence: true
```

### 开发环境配置

```yaml
# 开发环境端点配置
endpoint:
  port: 1883
  useWebsocket: false
  enableAuth: false
  enableAcl: false
  messageMaxSize: 1048576
  maxConnectionSize: 100
  maxConnectionPerSecond: 100
  maxSessionSize: 100
  metrics: true
  wiretap: true
```

### WebSocket 配置

```yaml
# WebSocket 端点配置
endpoint:
  port: 8080
  useWebsocket: true
  path: "/mqtt"
  enableAuth: true
  enableAcl: true
  messageMaxSize: 4194304
  maxConnectionSize: 1000
  sslConfig:
    enabled: true
    keyStorePath: "/etc/ssl/websocket-keystore.jks"
    keyStorePassword: "${WEBSOCKET_SSL_PASSWORD}"
```

## 配置验证

### 配置检查

```bash
# 检查端点配置
GET /api/endpoints/validate?port=1883

# 检查端口可用性
GET /api/endpoints/check-port?port=1884

# 检查配置语法
POST /api/endpoints/validate-config
Content-Type: application/json

{
    "port": 1883,
    "enableAuth": true,
    "enableAcl": true
}
```

### 配置测试

```bash
# 测试端点连接
curl -X POST /api/endpoints/test \
  -H "Content-Type: application/json" \
  -d '{"port": 1883, "host": "localhost"}'
```

## 配置管理

### 配置备份

```bash
# 备份所有端点配置
GET /api/endpoints/backup

# 备份特定端点配置
GET /api/endpoints/backup?port=1883
```

### 配置恢复

```bash
# 恢复端点配置
POST /api/endpoints/restore
Content-Type: application/json

{
    "config": "...",
    "port": 1883
}
```

### 配置迁移

```bash
# 导出配置
GET /api/endpoints/export

# 导入配置
POST /api/endpoints/import
Content-Type: application/json

{
    "configs": [...]
}
```

## 最佳实践

### 1. 端口规划

- 使用不同端口范围区分环境
- 预留端口用于测试和开发
- 避免使用系统保留端口

### 2. 安全配置

- 生产环境必须启用认证和 ACL
- 配置 SSL/TLS 加密
- 设置合理的连接限制

### 3. 性能优化

- 根据业务需求调整连接数限制
- 配置合适的消息大小限制
- 启用连接池优化

### 4. 监控配置

- 启用指标收集
- 配置日志记录
- 设置告警阈值

## 故障排查

### 配置问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :1883
   ```

2. **配置不生效**
   ```bash
   # 检查集群状态
   GET /api/cluster/status
   ```

3. **SSL 配置错误**
   ```bash
   # 检查证书文件
   keytool -list -keystore /path/to/keystore.jks
   ```

### 日志分析

```bash
# 查看端点启动日志
tail -f logs/fluxmq.log | grep "Endpoint"

# 查看配置同步日志
tail -f logs/fluxmq.log | grep "ConfigSync"

# 查看错误日志
tail -f logs/fluxmq.log | grep "ERROR"
```
