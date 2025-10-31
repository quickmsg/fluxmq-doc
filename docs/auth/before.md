# 介绍
身份认证是大多数应用的重要组成部分，MQTT 协议支持用户名密码认证，启用身份认证能有效阻止非法客户端的连接。
FluxMQ支持配配置多个认证方式，当配置多认证时候，连接会依次尝试认证，只要有一种认证方式通过即可连接成功。

![img.png](@site/static/images/auth2/authType.png)

## 认证实体


### 未开启HAProxy

```json

{
  "clientId":"Akjdksdnfdjsnfjk",
  "username": "test",
  "password": "yess"
}

```


### 开启HAProxy

```json

{
  "clientId":"Akjdksdnfdjsnfjk",
  "username": "test",
  "password": "yess",
  "destinationAddress": "127.0.0.1",
  "destinationPort": 1883,
  "sourcePort": 1883,
  "sourceAddress": "12.12.12.12"
}

```

如果TLS终结在HAProxy层，则认证实体如下：

```json

{
  "clientId":"Akjdksdnfdjsnfjk",
  "username": "test",
  "password": "yess",
  "destinationAddress": "127.0.0.1",
  "destinationPort": 1883,
  "sourcePort": 1883,
  "sourceAddress": "12.12.12.12",
  "ssl": "jhbzsuiy238",
  "sslCn": "clientId",
  "sslVersion": "TLS1.3"
}

```

## 认证过滤规则

FluxMQ 支持根据客户端ID或用户名使用正则表达式进行认证路由，将不同的客户端定向到不同的认证管理器。

### 语法格式

- **匹配客户端ID**: `Client{正则表达式}`
- **匹配用户名**: `User{正则表达式}`
- **匹配所有**: 留空或不填写

### 配置示例

#### 示例1：按设备类型分类认证

假设你有以下设备类型，需要使用不同的认证方式：

**场景A - IoT设备使用固定密码认证**
- 客户端ID规则：以 `device-` 开头
- 过滤规则配置：`Client{^device-.*}`

```json
{
  "name": "IoT设备认证",
  "filter": "Client{^device-.*}",
  "fixedAuthConfig": [
    {"username": "device001", "password": "pwd123"},
    {"username": "device002", "password": "pwd456"}
  ]
}
```

**场景B - 后台管理系统使用SQL认证**
- 用户名规则：以 `admin-` 开头
- 过滤规则配置：`User{^admin-.*}`

```json
{
  "name": "管理员认证",
  "filter": "User{^admin-.*}",
  "sqlConfig": {
    "driverClassName": "com.mysql.cj.jdbc.Driver",
    "jdbcUrl": "jdbc:mysql://localhost:3306/fluxmq",
    "username": "root",
    "password": "123456",
    "authSql": "select password,salt from admin_users where username = ${username} limit 1"
  }
}
```

#### 示例2：多租户场景

为不同租户配置独立的认证方式：

**租户A - 客户端ID以 `tenantA-` 开头**
```json
{
  "name": "租户A认证",
  "filter": "Client{^tenantA-.*}",
  "httpConfig": {
    "url": "http://tenant-a.example.com/auth",
    "method": "POST"
  }
}
```

**租户B - 客户端ID以 `tenantB-` 开头**
```json
{
  "name": "租户B认证",
  "filter": "Client{^tenantB-.*}",
  "redisConfig": {
    "model": "SINGLE",
    "url": "127.0.0.1:6379",
    "command": "hmget ${username} password salt"
  }
}
```

#### 示例3：测试和生产环境分离

**测试环境客户端**
- 客户端ID包含 `test` 或 `dev`
- 过滤规则：`Client{.*(test|dev).*}`

```json
{
  "name": "测试环境认证",
  "filter": "Client{.*(test|dev).*}",
  "fixedAuthConfig": [
    {"username": "testuser", "password": "testpass"}
  ]
}
```

**生产环境客户端**
- 客户端ID以 `prod-` 开头
- 过滤规则：`Client{^prod-.*}`

```json
{
  "name": "生产环境认证",
  "filter": "Client{^prod-.*}",
  "sqlConfig": {
    "authSql": "select password,salt from production_devices where clientId = ${clientId}"
  }
}
```

### 常用正则表达式

| 场景 | 正则表达式 | 说明 | 匹配示例 |
|------|-----------|------|---------|
| 固定前缀 | `^device-.*` | 以 device- 开头 | device-001, device-abc |
| 固定后缀 | `.*-sensor$` | 以 -sensor 结尾 | temp-sensor, humidity-sensor |
| 包含关键词 | `.*test.*` | 包含 test | mytest, test-001 |
| 数字结尾 | `^device[0-9]+$` | device后跟数字 | device123, device999 |
| 多个选项 | `^(mqtt\|smqtt\|coap)-.*` | 以mqtt/smqtt/coap开头 | mqtt-client, smqtt-001 |
| 精确匹配 | `^admin$` | 只匹配 admin | admin |

### 最佳实践

1. **优先级顺序**：配置多个认证管理器时，它们按配置顺序依次尝试，只要有一个通过即认证成功。

2. **通配认证**：建议最后配置一个不带过滤规则的认证管理器作为默认认证方式。

3. **正则测试**：在正式使用前，先用在线正则工具测试你的表达式是否正确匹配。

4. **性能考虑**：过于复杂的正则表达式可能影响性能，建议使用简单的前缀匹配。

### 注意事项

- 正则表达式区分大小写
- 留空 filter 字段表示匹配所有客户端
- 客户端会按顺序匹配认证管理器，匹配成功后执行对应的认证逻辑
- 如果所有认证管理器都不匹配，则使用默认的认证方式（如果配置了的话）