
# HTTP

```YAML
http: # http相关配置 端口固定60000
  port: 60000
  accessLog: false # http访问日志
  username: fluxmq # 访问用户名
  password: fluxmq # 访问密码
```
| 参数名 | 描述 | 默认值          |
| --- | --- |--------------|
| port | mqtt启动的监听端口 | 必填项          |
| host | 启动的host | 可选，默认0.0.0.0 |
| accessLog | 开启http请求日志 | 必填项          |
| username | 管理后台登录用户名 | 必填项          |
| password | 管理后台登录密码 | 必填项          |
| ssl | ssl参数配置 | 可选           |
