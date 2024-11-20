# EVENTBUS配置
```yaml
eventbus:
  compressed: true # 是否压缩
  batch: true # 是否批量
  batchSize: 2000 # 单次批量消息数
  batchDuration: 50 # 单次发送间隔
  async: true # 是否异步发送
  asyncThreadSize: 4 # 异步发送线程
  asyncMessageSize: 200000  # 异步发送队列大小
```

| 参数名      | 描述     | 默认值      |
|----------|--------|----------|
| compressed    | 是否压缩   | 默认 true  |
| batch | 是否批量   | 默认 true  |
| batchSize | 批量发送大小 | 默认2000   |
| batchDuration | 批量发送间隔 | 默认 50ms  |
| async | 是否异步   | 默认 true  |
| asyncThreadSize | 异步线程大小 | 默认CPU/2  |
| asyncMessageSize | 异步队列大小 | 默认200000 |