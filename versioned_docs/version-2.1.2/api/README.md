# API 前言

本文档详细介绍 FluxMQ 2.1.2 版本中所有 HTTP API 接口，按照功能模块进行分类。

## 基础信息

- **基础路径**: 根据模块不同，基础路径不同
- **认证方式**: 支持 HTTP Basic Auth 和 Token 认证
- **内容类型**: `application/json`
- **字符编码**: UTF-8

## API 模块分类

FluxMQ 提供了丰富的 HTTP API 接口，涵盖以下功能模块：

### 核心文档

- [完整 API 参考](./reference.md) - 所有 API 接口的完整文档
- [消息发布 API](./Publish.md) - 通过 HTTP 发布 MQTT 消息
- [连接检查 API](./Check.md) - 检查客户端连接状态
- [连接踢出 API](./kick.md) - 踢出指定客户端连接

### API 功能分类

完整的 API 接口按功能分为以下模块，详细信息请查看 [完整 API 参考](./reference.md)：

- **端点管理 API** - 动态管理 MQTT 端点
- **连接管理 API** - 管理 MQTT 客户端连接
- **主题管理 API** - 管理 MQTT 主题
- **订阅管理 API** - 管理 MQTT 订阅
- **规则引擎 API** - 管理规则引擎规则
- **数据源管理 API** - 管理数据源配置
- **认证管理 API** - 管理认证策略
- **ACL 管理 API** - 管理访问控制列表
- **系统管理 API** - 系统配置和管理
- **日志管理 API** - 日志查询和管理
- **监控 API** - 系统监控和指标
- **脚本管理 API** - 管理脚本
- **指令管理 API** - 管理指令配置
- **扩展管理 API** - 管理扩展功能
- **会话管理 API** - 管理 MQTT 会话
- **保留消息 API** - 管理保留消息

## 通用说明

### 认证方式

所有 API 接口（除了公共接口）都需要认证。支持以下认证方式：

1. **HTTP Basic Auth**
   ```bash
   curl -u username:password http://localhost:8080/api/endpoint
   ```

2. **Token 认证**
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8080/api/endpoint
   ```

### 响应格式

所有 API 接口统一使用 JSON 格式响应。

**成功响应示例**

```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

**错误响应示例**

```json
{
    "code": 400,
    "message": "Invalid parameters",
    "error": "Missing required field: id"
}
```

### 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 认证失败 | 检查认证信息 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源ID |
| 409 | 资源冲突 | 检查资源状态 |
| 500 | 服务器内部错误 | 查看服务器日志 |

### 分页参数

需要分页的接口统一使用以下参数：

```json
{
    "page": 1,
    "size": 20
}
```

**分页响应格式**

```json
{
    "data": [],
    "total": 100,
    "page": 1,
    "size": 20
}
```

## 快速开始

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
```

### Python 示例

```python
import requests

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
```

## 相关文档

- [快速开始](../README.md)
- [端点管理](../endpoint/README.md)
- [规则引擎](../gzyq/rule/README.md)

