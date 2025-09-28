# Endpoint API 参考

本文档详细介绍 FluxMQ 2.1.1 版本中 Endpoint 管理的所有 API 接口。

## 基础信息

- **基础路径**: `/api/endpoints`
- **认证方式**: 支持 HTTP Basic Auth 和 Token 认证
- **内容类型**: `application/json`
- **字符编码**: UTF-8

## 端点管理 API

### 添加端点

添加新的 MQTT 端点。

**请求**

```http
POST /api/endpoints/add
Content-Type: application/json
Authorization: Basic <base64-encoded-credentials>
```

**请求体**

```json
{
    "port": 1884,
    "useWebsocket": false,
    "path": "/mqtt",
    "enableAuth": true,
    "enableAcl": true,
    "enableBridge": false,
    "messageMaxSize": 4194304,
    "maxSessionSize": 100,
    "maxConnectionSize": 1000,
    "maxConnectionPerSecond": 100,
    "sslConfig": {
        "enabled": false
    },
    "serverOptions": {},
    "childOptions": {},
    "enabled": true,
    "isDefault": false
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint added successfully",
    "data": {
        "port": 1884,
        "status": "started",
        "createTime": "2024-02-15T10:30:00Z"
    }
}
```

**错误响应**

```json
{
    "code": 400,
    "message": "Port already in use",
    "error": "Port 1884 is already configured"
}
```

### 更新端点

更新现有端点的配置。

**请求**

```http
POST /api/endpoints/update
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884,
    "useWebsocket": true,
    "path": "/mqtt",
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 8388608,
    "maxConnectionSize": 2000
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint updated successfully",
    "data": {
        "port": 1884,
        "status": "restarted",
        "updateTime": "2024-02-15T10:35:00Z"
    }
}
```

### 删除端点

删除指定的端点。

**请求**

```http
POST /api/endpoints/remove
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint removed successfully",
    "data": {
        "port": 1884,
        "status": "stopped"
    }
}
```

### 查询端点列表

获取所有端点的配置信息。

**请求**

```http
GET /api/endpoints/list
```

**查询参数**

- `status`: 过滤状态（active, inactive, all）
- `type`: 过滤类型（mqtt, websocket, all）
- `page`: 页码（默认 1）
- `size`: 每页大小（默认 20）

**响应**

```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "endpoints": {
            "1883": {
                "port": 1883,
                "useWebsocket": false,
                "enableAuth": true,
                "enableAcl": true,
                "messageMaxSize": 4194304,
                "maxConnectionSize": 1000,
                "status": "active",
                "createTime": "2024-02-15T10:00:00Z",
                "updateTime": "2024-02-15T10:30:00Z"
            },
            "1884": {
                "port": 1884,
                "useWebsocket": true,
                "path": "/mqtt",
                "enableAuth": true,
                "enableAcl": true,
                "messageMaxSize": 8388608,
                "maxConnectionSize": 2000,
                "status": "active",
                "createTime": "2024-02-15T10:30:00Z",
                "updateTime": "2024-02-15T10:35:00Z"
            }
        },
        "activePorts": [1883, 1884],
        "total": 2,
        "page": 1,
        "size": 20
    }
}
```

### 查询单个端点

获取指定端点的详细配置。

**请求**

```http
GET /api/endpoints/get?port=1883
```

**响应**

```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "port": 1883,
        "useWebsocket": false,
        "enableAuth": true,
        "enableAcl": true,
        "enableBridge": false,
        "messageMaxSize": 4194304,
        "maxSessionSize": 100,
        "maxConnectionSize": 1000,
        "maxConnectionPerSecond": 100,
        "sslConfig": {
            "enabled": false
        },
        "serverOptions": {},
        "childOptions": {},
        "enabled": true,
        "isDefault": true,
        "status": "active",
        "createTime": "2024-02-15T10:00:00Z",
        "updateTime": "2024-02-15T10:30:00Z"
    }
}
```

## 状态管理 API

### 启动端点

启动指定的端点。

**请求**

```http
POST /api/endpoints/start
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint started successfully",
    "data": {
        "port": 1884,
        "status": "active"
    }
}
```

### 停止端点

停止指定的端点。

**请求**

```http
POST /api/endpoints/stop
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint stopped successfully",
    "data": {
        "port": 1884,
        "status": "inactive"
    }
}
```

### 重启端点

重启指定的端点。

**请求**

```http
POST /api/endpoints/restart
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884
}
```

**响应**

```json
{
    "code": 200,
    "message": "Endpoint restarted successfully",
    "data": {
        "port": 1884,
        "status": "active",
        "restartTime": "2024-02-15T10:40:00Z"
    }
}
```

### 查询端点状态

获取指定端点的运行状态。

**请求**

```http
GET /api/endpoints/status?port=1883
```

**响应**

```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "port": 1883,
        "status": "active",
        "uptime": "2h30m15s",
        "connections": {
            "current": 45,
            "max": 1000,
            "total": 1250
        },
        "messages": {
            "received": 15000,
            "sent": 14800,
            "dropped": 5
        },
        "lastActivity": "2024-02-15T10:45:00Z"
    }
}
```

## 监控 API

### 端点指标

获取端点的性能指标。

**请求**

```http
GET /api/endpoints/metrics?port=1883
```

**查询参数**

- `port`: 端点端口
- `period`: 时间周期（1m, 5m, 1h, 1d）
- `format`: 返回格式（json, prometheus）

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
                "rate": 2.5
            },
            "messages": {
                "received": 15000,
                "sent": 14800,
                "dropped": 5,
                "rate": 100.5
            },
            "sessions": {
                "current": 40,
                "max": 100,
                "rate": 1.2
            },
            "performance": {
                "cpuUsage": 15.5,
                "memoryUsage": 256.8,
                "responseTime": 2.3
            }
        }
    }
}
```

### 端点健康检查

检查端点的健康状态。

**请求**

```http
GET /api/endpoints/health?port=1883
```

**响应**

```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "port": 1883,
        "health": "healthy",
        "checks": {
            "listening": true,
            "accepting": true,
            "responding": true,
            "memory": "ok",
            "cpu": "ok"
        },
        "timestamp": "2024-02-15T10:45:00Z"
    }
}
```

## 配置管理 API

### 检查端口可用性

检查指定端口是否可用。

**请求**

```http
GET /api/endpoints/check-port?port=1884
```

**响应**

```json
{
    "code": 200,
    "message": "Port is available",
    "data": {
        "port": 1884,
        "available": true,
        "reason": "Port is not in use"
    }
}
```

**端口被占用时的响应**

```json
{
    "code": 400,
    "message": "Port is not available",
    "data": {
        "port": 1884,
        "available": false,
        "reason": "Port is already in use by process 1234"
    }
}
```

### 验证配置

验证端点配置的有效性。

**请求**

```http
POST /api/endpoints/validate
Content-Type: application/json
```

**请求体**

```json
{
    "port": 1884,
    "useWebsocket": false,
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 4194304
}
```

**响应**

```json
{
    "code": 200,
    "message": "Configuration is valid",
    "data": {
        "valid": true,
        "warnings": [],
        "errors": []
    }
}
```

**配置无效时的响应**

```json
{
    "code": 400,
    "message": "Configuration is invalid",
    "data": {
        "valid": false,
        "warnings": [],
        "errors": [
            "Message max size exceeds limit",
            "Invalid SSL configuration"
        ]
    }
}
```

## 批量操作 API

### 批量添加端点

批量添加多个端点。

**请求**

```http
POST /api/endpoints/batch-add
Content-Type: application/json
```

**请求体**

```json
{
    "endpoints": [
        {
            "port": 1883,
            "useWebsocket": false,
            "enableAuth": true,
            "enableAcl": true
        },
        {
            "port": 1884,
            "useWebsocket": true,
            "path": "/mqtt",
            "enableAuth": true,
            "enableAcl": true
        }
    ]
}
```

**响应**

```json
{
    "code": 200,
    "message": "Batch operation completed",
    "data": {
        "success": 2,
        "failed": 0,
        "results": [
            {
                "port": 1883,
                "status": "success",
                "message": "Endpoint added successfully"
            },
            {
                "port": 1884,
                "status": "success",
                "message": "Endpoint added successfully"
            }
        ]
    }
}
```

### 批量更新端点

批量更新多个端点。

**请求**

```http
POST /api/endpoints/batch-update
Content-Type: application/json
```

**请求体**

```json
{
    "endpoints": [
        {
            "port": 1883,
            "maxConnectionSize": 2000
        },
        {
            "port": 1884,
            "messageMaxSize": 8388608
        }
    ]
}
```

### 批量删除端点

批量删除多个端点。

**请求**

```http
POST /api/endpoints/batch-remove
Content-Type: application/json
```

**请求体**

```json
{
    "ports": [1883, 1884, 1885]
}
```

## 配置导入导出 API

### 导出配置

导出所有端点配置。

**请求**

```http
GET /api/endpoints/export
```

**查询参数**

- `format`: 导出格式（json, yaml）
- `includeDisabled`: 是否包含禁用的端点

**响应**

```json
{
    "code": 200,
    "message": "Export completed",
    "data": {
        "format": "json",
        "timestamp": "2024-02-15T10:45:00Z",
        "endpoints": {
            "1883": {
                "port": 1883,
                "useWebsocket": false,
                "enableAuth": true,
                "enableAcl": true
            },
            "1884": {
                "port": 1884,
                "useWebsocket": true,
                "path": "/mqtt",
                "enableAuth": true,
                "enableAcl": true
            }
        }
    }
}
```

### 导入配置

导入端点配置。

**请求**

```http
POST /api/endpoints/import
Content-Type: application/json
```

**请求体**

```json
{
    "format": "json",
    "endpoints": {
        "1883": {
            "port": 1883,
            "useWebsocket": false,
            "enableAuth": true,
            "enableAcl": true
        }
    },
    "overwrite": true
}
```

## 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 认证失败 | 检查认证信息 |
| 403 | 权限不足 | 检查用户权限 |
| 404 | 端点不存在 | 检查端点端口 |
| 409 | 端口冲突 | 使用其他端口 |
| 500 | 服务器内部错误 | 查看服务器日志 |

## 使用示例

### cURL 示例

```bash
# 添加端点
curl -X POST http://localhost:8080/api/endpoints/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
  -d '{
    "port": 1884,
    "useWebsocket": false,
    "enableAuth": true,
    "enableAcl": true,
    "messageMaxSize": 4194304
  }'

# 查询端点列表
curl -X GET http://localhost:8080/api/endpoints/list \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ="

# 查询端点状态
curl -X GET http://localhost:8080/api/endpoints/status?port=1884 \
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ="
```

### JavaScript 示例

```javascript
// 添加端点
const addEndpoint = async (config) => {
  const response = await fetch('/api/endpoints/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:password')
    },
    body: JSON.stringify(config)
  });
  
  return await response.json();
};

// 查询端点列表
const getEndpoints = async () => {
  const response = await fetch('/api/endpoints/list', {
    headers: {
      'Authorization': 'Basic ' + btoa('admin:password')
    }
  });
  
  return await response.json();
};
```

### Python 示例

```python
import requests
import json

# 添加端点
def add_endpoint(port, config):
    url = f"http://localhost:8080/api/endpoints/add"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic YWRtaW46cGFzc3dvcmQ="
    }
    data = {"port": port, **config}
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 查询端点状态
def get_endpoint_status(port):
    url = f"http://localhost:8080/api/endpoints/status"
    params = {"port": port}
    headers = {"Authorization": "Basic YWRtaW46cGFzc3dvcmQ="}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```
