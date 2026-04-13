# 创建规则
本指南介绍如何在 FluxMQ Dashboard 中创建规则。登录 FluxMQ Dashboard，点击左侧导航目录中的 **规则引擎** -> **规则管理**。然后点击 **新增规则**，在弹出的 **规则配置** 窗口中定义 SQL、数据类型与规则动作。以下步骤演示如何创建一个规则，该规则监听主题为 test/# 的消息，并将接收到的消息转发到主题 target/1。

## 定义规则
在**规则管理**页面上，输入规则的名称并添加备注以便未来管理。<br />在 **SQL 编辑器**中，可以通过下拉框选择符合您业务需求的**规则数据类型**，如发布消息、订阅消息等，支持多选。<br />配置 **规则动作类型** 指定数据转发的目标数据源和动作，数据源配置的详细信息参阅 FluxMQ-数据源配置手册。<br />FluxMQ 内置了丰富的 SQL 语句示例，以帮助您入门。有关 SQL 语法和用法的更多详细信息，请参阅 <a href="GRAMMAR#jump1">**SQL 语法与示例**</a>。<br />![](@site/static/images/gzyq/rule/rule_1.png)

## 测试 SQL 语句
这是一个可选步骤，但如果您第一次使用 FluxMQ 规则引擎，建议进行测试。在 **规则管理** 列表中，先 **保存** 一条规则后，点击该规则卡片上的 **测试**，打开 **规则测试** 弹窗。<br />选择数据类型后，可在文本框中编辑模拟上下文 JSON，点击 **执行测试**。执行成功后，**测试结果** 区域会展示 SQL 输出。<br />![](@site/static/images/gzyq/rule/rule_2.png)<br />SQL 处理结果中的所有字段都可以通过后续操作（内置操作或数据桥接）以 $\{key\}的形式进行引用。有关字段的详细说明，请参阅 <a href="EVENT#jump1">**SQL 事件类型与字段**</a>。

## 添加消息重发布操作
要将主题为 test/# 的消息重新发布到主题 target/1，在规则配置窗口中点击 **添加动作**，在 **动作配置** 弹窗的 **动作类型** 中选择 **保存到MQTT**（MQTT 转发），并配置以下设置：

- **主题**：在本示例中设置为目标主题 target/1；
- **QoS**：在本示例中设置为重新发布的消息的 QoS 为 0；
- 若环境要求绑定 MQTT 数据源，请按提示完成 **数据源配置**。

![](@site/static/images/gzyq/rule/rule_3.png)<br />在**新增规则**窗口底部点击 **保存** 以完成规则创建。此规则将作为新条目出现在 **规则管理** 列表中。您可以查看规则 ID、数据类型、动作类型；在规则 **停用** 状态下可 **编辑**、**删除**，并支持 **复制**、**启用/停用**。<br />![](@site/static/images/gzyq/rule/rule_4.png)

## 使用数据桥接转发
您还可以添加使用数据桥接转发的操作。点击 **添加动作**，在 **动作类型** 中选择 **保存到Mysql**（或其它数据库桥接），并按提示选择数据源、填写 SQL 模板。以下为动作配置弹窗示例：<br />![](@site/static/images/gzyq/rule/rule_5.png)

## 2.1.0 版本新增功能

### 内置函数增强
FluxMQ 2.1.0 版本大幅增强了 SQL 函数库，新增了30多个内置函数，包括：

**数据类型转换函数：**
- `json()` - 将对象转换为 JSON 字符串
- `str()` - 将字节数组转换为字符串
- `int8()`, `int16()`, `int32()`, `int64()` - 数值类型转换
- `toDouble()` - 转换为浮点数

**时间处理函数：**
- `date()` - 格式化日期 (yyyy-MM-dd)
- `datetime()` - 格式化时间 (yyyy-MM-dd HH:mm:ss)
- `dateToTimestamp()` - 日期字符串转时间戳
- `datetimeToTimestamp()` - 时间字符串转时间戳

**字符串处理函数：**
- `split()` - 字符串分割
- `find()` - 查找子字符串
- `substring()` - 字符串截取
- `last()` - 获取数组最后一个元素

**加密和编码函数：**
- `md5()`, `sha1()`, `sha256()`, `sha512()` - 各种哈希算法
- `base64_encode()` - Base64 编码
- `uuid()`, `uuidUpper()` - UUID 生成

**使用示例：**
```sql
SELECT 
  uuid() as message_id,
  json(payload) as json_payload,
  datetime(timestamp) as format_time,
  md5(clientId) as client_hash
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/data'
```

### 新增数据源支持
FluxMQ 2.1.0 新增了多个数据源支持：

- **ClickHouse** - 适用于大数据分析场景
- **Pulsar** - 高性能消息队列
- **RocketMQ** - 阿里云消息队列
- **TDengine** - 时序数据库

### 离线消息功能
新增离线消息处理能力，支持：
- QoS 1/2 消息的离线存储
- 客户端重连后自动投递
- 支持 MySQL、Redis、PostgreSQL 等存储后端

**离线消息动作配置示例：**
```sql
-- 离线消息存储到 MySQL
INSERT INTO offline_messages (
  id, clientId, topic, qos, payload, timestamp
) VALUES (
  '${id}', '${clientId}', '${topic}', 
  ${qos}, '${json(payload)}', ${timestamp}
)
```

### 高级 SQL 语法支持
- 支持 `CASE WHEN` 条件表达式
- 支持更复杂的 JSON 路径解析
- 增强的字符串模式匹配
- 支持 Java String API 方法调用

**示例：**
```sql
SELECT 
  clientId,
  CASE 
    WHEN payload.temperature > 40 THEN 'HIGH'
    WHEN payload.temperature > 20 THEN 'NORMAL'
    ELSE 'LOW'
  END as temp_level,
  topic.startsWith('sensor') as is_sensor
FROM "$EVENT.PUBLISH"
```

## 下一步
- 了解更多内置函数：[内置 SQL 函数](FUNCTION.md)
- 查看实战案例：[规则引擎实战案例](EXAMPLES.md)
- 高级用法指南：[规则引擎高级使用指南](ADVANCED.md)
- 故障排查：[规则引擎故障排查与性能优化](TROUBLESHOOTING.md)
