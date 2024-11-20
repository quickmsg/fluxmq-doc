# 重试配置
```yaml
retry:
  retrySize : 10
  retryPeriod : 10
  maxUnConfirmMessageSize : 200
```


| 参数名      | 描述        | 默认值 |
|----------|-----------|-----|
| retrySize    | 重试次数      | 10  |
| retryPeriod | 重试周期（秒）   | 10  |
| maxUnConfirmMessageSize | 最大未确认队列大小 | 200 |
