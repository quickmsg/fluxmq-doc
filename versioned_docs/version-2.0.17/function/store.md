# 持久化

> 持久化的数据包含如下：

- fluxmq集群中运行的数据：保留、延迟、会话消息、ACK未确认消息。
- fluxmq集群所有的web配置持久化。

## 配置


### LOCAL
> 本地存储，会持久化数据，重启后数据不会丢失
```yaml
store:
  storeType: LOCAL # MYSQL,LOCAL,MEMORY,POSTGRESQL
```

### MEMORY
> 内存模式，不会持久化数据，重启后数据会丢失

```yaml
store:
  storeType: MEMORY # MYSQL,LOCAL,MEMORY,POSTGRESQL
```


### MYSQL
> MYSQL模式，会持久化数据，重启后数据不会丢失

下载SQL语句初始化FluxMQ持久化所需要的表结构：

[点击下载初始化表SQL](https://fluxmq.obs.cn-east-3.myhuaweicloud.com/fluxmq-2.0.17-MYSQL.sql)


```yaml
store:
  storeType: MYSQL # MYSQL,LOCAL
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false
    username: root
    password: 123456
```
<div class="table-2">

| 参数名        | 描述         | 默认值                                             |
|------------|------------|-------------------------------------------------|
| storeType  | 存儲类型       | 默认MEMORY                                        |
| datasource | 选择MYSQL存储时 | 选填                                              |
| url        | 地址         | jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false |
| username   | 用户名        | root                                            |
| password   | 密码         | 123456                                          |

</div>

### POSTGRESQL
> POSTGRESQL模式，会持久化数据，重启后数据不会丢失

下载SQL语句初始化FluxMQ持久化所需要的表结构：

[点击下载初始化表SQL](https://fluxmq.obs.cn-east-3.myhuaweicloud.com/fluxmq-2.0.17-PG.sql)

```yaml
store:
  storeType: POSTGRESQL # MYSQL,LOCAL,MEMORY,POSTGRESQL
  datasource:
    url: jdbc:postgresql://127.0.0.1:5432/fluxmq
    username: postgres
    password: fluxmq
    schema: fluxmq
```
模式不指定时候，默认为public模式。

<div class="table-2">

| 参数名        | 描述         | 默认值                                             |
|------------|------------|-------------------------------------------------|
| storeType  | 存儲类型       | 默认LOCAL                                         |
| datasource | 选择MYSQL存储时 | 选填                                              |
| url        | 地址         | jdbc:postgresql://127.0.0.1:5432/fluxmq |
| username   | 用户名        | root                                            |
| password   | 密码         | 123456                                          |
| schema     | 模式         | public                                          |

</div>