# redis认证  

> Redis认证是指客户端连接时，通过Redis进行认证，这种方式适用于客户端数量较多的场景，例如生产环境。

![img_1.png](@site/static/images/auth2/redis.png)
## redis设置

### 连接模式

| **连接模式** | **释义**              |
|----------|---------------------|
| 单点       | 支持单实例redis连接        |
| 集群       | 支持redis cluster集群连接 |
| 哨兵       | 支持redis sentinel连接  |

### db设置

支持设置0-16的db



## 加密


### 加密算法

> 加密后的`password`不区分大小写

| **加密方式** | **释义**   |
|----------|----------|
| plain    | 明文       |
| md5      | md5加密    |
| sha1      | sha1加密   |
| sha256     | sha256加密 |
| sha512     | sha512加密 |

### 盐

> 目前支持三种加盐策略


| **加盐策略** | **释义**           |
|----------|------------------|
| disable  | 不加盐              |
| prefix   | `salt`+`password`  |
| suffix   | `password` +`salt` |

## 认证规则

现在新增认证管理器支持正则匹配clientId,定向路由认证管理器,可以操作clientId、username,具体语法如下：
-  客户端ID匹配正则 `Client{regex}`
-  用户名匹配正则  `User{regex}`

如果不配置正则表达式，表示匹配所有，所有请求都将会走该认证管理器。






