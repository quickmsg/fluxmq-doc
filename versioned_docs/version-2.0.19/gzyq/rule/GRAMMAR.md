# SQL 语法与示例

## SQL 语法

### FROM、SELECT 和 WHERE 子句
规则的 SQL 语句基本格式为:
```plsql
SELECT <字段名> FROM <事件类型> [WHERE <条件>]
```

- FROM 子句将规则挂载到某个事件类型上，可多选
- SELECT 子句用于对数据进行变换，并选择出需要的字段
- WHERE 子句用于对 SELECT 选择出来的某个字段施加条件过滤
```plsql
## SELECT 语句用于决定最终的输出结果里的字段。比如:
## 下面 SQL 的输出结果中将只有两个字段 "a" 和 "b":

SELECT a, b FROM "$EVENT.PUBLISH"

# 选取 username 为 'abc' 的建立连接消息，输出结果为所有可用字段:

SELECT * FROM "$EVENT.CONNECT" WHERE auth.username = 'abc'

## 选取 clientId 为 'abc' 的终端发来的消息，输出结果将只有 cid 一个字段。

SELECT clientId as cid FROM "$EVENT.PUBLISH" WHERE clientId = 'abc'

## 选取 qos 为 '1' 的发布消息，输出结果将只有 cid 一个字段。
## 注意虽然 SELECT 语句中只选取了 cid 一个字段，所有消息发布事件中的可用字段 (比如 clientId、topic 等) 仍然可以在 WHERE 语句中使用:

SELECT clientId as cid FROM "$EVENT.PUBLISH" WHERE qos = 1

## 但下面这个 SQL 语句就不能工作了，因为变量 xyz 不是消息发布事件中的可用字段:

SELECT clientId as cid FROM "$EVENT.PUBLISH" WHERE xyz = 'abc'
```

### 比较符号
| 函数名 | 函数作用                                           | 返回值         |
|-----|------------------------------------------------|-------------|
| >   | 大于                                             | true/false  |
| \<   | 小于                                             | true/false  |
| \<=  | 小于等于                                           | true/false  |
| >=  | 大于等于                                           | true/false  |
| \<\>  | 不等于                                            | true/false  |
| !=  | 不等于                                            | true/false  |
| =   | 比较两者是否完全相等。可用于比较变量和主题                          | true/false  |
| =~  | 比较主题(topic)是否能够匹配到主题过滤器(topic filter)。只能用于主题匹配 | true/false  |


## SQL 语句示例

### 基本语法举例

- 从 topic 为 "t/a" 的消息中提取所有字段:
```plsql
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = 't/a'
```

- 从 topic 为 "t/a" **或** "t/b" 的消息中提取所有字段:
```plsql
SELECT * FROM "$EVENT.PUBLISH" WHERE topic = 't/a' or topic = 't/b'
```

- 从 topic 能够匹配到 't/#' 的消息中提取所有字段。
```plsql
SELECT * FROM "$EVENT.PUBLISH" WHERE topic =~ "t/#"
```

- 从 topic 能够匹配到 't/#' 的消息中提取 qos、messageId 和 clientId 字段:
```plsql
SELECT qos, messageId, clientId FROM "$EVENT.PUBLISH" WHERE topic =~ "t/#"
```

- 从 建立连接 消息中提取 username 字段，并且筛选条件为 username = 'fluxmq':
```plsql
select auth.username as username from "$EVENT.CONNECT" where auth.username = 'fluxmq'
```

- 从任意 topic 的 JSON 消息体(payload) 中 **提取 x 字段**，并创建别名 x 以便在 WHERE 子句中使用。WHERE 子句限定条件为 x = 1。下面这个 SQL 语句可以匹配到消息体 \{"x": 1\}，但不能匹配到消息体 \{"x": 2\}:
```plsql
SELECT payload.x as x FROM "$EVENT.PUBLISH" WHERE payload.x = 1
```

- 类似于上面的 SQL 语句，但 **嵌套地提取 **消息体中的数据，下面的 SQL 语句可以匹配到 JSON 消息体 \{"x": \{"y": 1\}\}:
```plsql
SELECT payload FROM "$EVENT.PUBLISH" WHERE payload.x.y = 1
```

- 在 clientId = 'c1' 连接成功时，提取其来源 IP 地址:
```plsql
SELECT clientIp FROM "$EVENT.CONNECT" WHERE clientId = 'c1'
```

- 筛选所有订阅 't/#' 主题 **且** 订阅级别为 QoS 1 的 clientId:
```plsql
SELECT clientId FROM "$EVENT.SUBSCRIBE" WHERE topic =~ 't/#' and qos = 1
```

- 筛选所有订阅主题能匹配到 't/#' 且订阅级别为 QoS 1 的 clientId。注意与上例不同的是，这里用的是主题匹配操作符 **'=~'**，所以会匹配订阅 't' 或 't/+/a' 的订阅事件:
```plsql
SELECT clientId FROM "$EVENT.SUBSCRIBE" WHERE topic =~ 't/#' and qos = 1
```

- 从topic包含"fluxmq"字符的消息中提取所有字段，使用 '**like**' 语法，包含的字符用%包裹：
```plsql
SELECT * FROM "$EVENT.PUBLISH" WHERE topic like '%fluxmq%'
```

- 使用**常量字段**，用双引号""包裹字符串，作为常量值；as后面跟字段，作为输出的字段名：
```plsql
SELECT *, "test" as event FROM "$EVENT.PUBLISH"
```

- 可以直接使用Java的String API，如 **startsWith，endsWith**；获取以'test'开头的所有Publish消息：
```plsql
select * from "$EVENT.PUBLISH" where topic.startsWith('test')
```
**提示**

- FROM 子句后面的主题需要用双引号 ""，或者单引号 '' 引起来。
- WHERE 子句后面接筛选条件，如果使用到字符串需要用单引号 '' 引起来。
- FROM 子句里如有多个事件，需要用逗号 "," 分隔。例如 SELECT * FROM "t/1", "t/2" 。
- 可以使用使用 "." 符号对json字段进行嵌套选择。
- 尽量不要给 payload 创建别名，否则会影响运行性能。即尽量不要这么写：SELECT payload as p