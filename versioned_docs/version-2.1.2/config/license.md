# License 配置

## 配置方式

### 方式一：简写（仅本地文件）

```yaml
license: fluxmq.lic
```

指定读取 license 的文件路径。未配置时默认读取启动目录的 `license.base64` 或 `fluxmq.lic`。

### 方式二：完整配置（支持 LOCAL / FCP）

```yaml
license:
  file: fluxmq.lic   # 本地 license 文件路径
  mode: LOCAL       # LOCAL=本地文件；FCP=连接 fmq-admin 授权服务
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| file | 本地 license 文件路径 | fluxmq.lic |
| mode | LOCAL：本地文件；FCP：连接 fmq-admin 获取授权 | LOCAL |

### FCP 模式（连接 fmq-admin）

当 `license.mode: FCP` 时，需同时配置 **proxy**，用于连接 fmq-admin 的代理与鉴权：

```yaml
license:
  mode: FCP

proxy:
  serverUrl: tcp://fmq-admin-host:8081   # 代理服务器地址 (tcp://host:port)
  token: your-proxy-token                # 代理 Token（由 fmq-admin 分配）
  applicationId: your-application-id    # 应用 ID
  applicationName: my-fluxmq             # 可选，应用名称
```

| 参数 | 必填 | 说明 |
|------|------|------|
| serverUrl | 是 | 代理服务器地址，如 `tcp://127.0.0.1:8081` |
| token | 是 | 代理 Token，用于鉴权 |
| applicationId | 是 | 应用 ID |
| applicationName | 否 | 应用名称，便于在管理端识别 |