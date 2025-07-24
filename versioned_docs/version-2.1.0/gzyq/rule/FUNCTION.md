# 内置 SQL 函数

FluxMQ 提供了丰富的内置函数库，包含 80+ 个强大的函数，帮助您在规则引擎中进行数据转换、处理和计算。这些函数涵盖了数据类型转换、字符串处理、时间操作、数学计算、加密编码、JSON 处理、数组操作等多个方面。

:::tip 版本说明
FluxMQ 2.1.0 版本大幅增强了 SQL 函数库，新增了 50+ 个内置函数，使您能够更灵活地处理 MQTT 消息和 IoT 数据。
:::

## 🔄 数据类型转换函数

### 基础类型转换

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `str(src)` | 将任意类型转换为字符串 | `str(123)` → `"123"` |
| `int8(src)` | 转换为 8 位整数（byte） | `int8("127")` → `127` |
| `int16(src)` | 转换为 16 位整数（short） | `int16("32767")` → `32767` |
| `int32(src)` | 转换为 32 位整数（int） | `int32("123456")` → `123456` |
| `int64(src)` | 转换为 64 位整数（long） | `int64("9223372036854775807")` → `9223372036854775807` |
| `toFloat(src)` | 转换为单精度浮点数 | `toFloat("3.14")` → `3.14` |
| `toDouble(src)` | 转换为双精度浮点数 | `toDouble("3.141592653589793")` → `3.141592653589793` |
| `toBool(src)` | 转换为布尔类型 | `toBool("true")` → `true` |
| `toDecimal(src)` | 转换为高精度小数 | `toDecimal("123.456789")` → `123.456789` |

### 进制转换

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `hexStr(src)` | 转换为十六进制字符串 | `hexStr("hello")` → `"68656c6c6f"` |
| `hexToInt(hex)` | 十六进制转整数 | `hexToInt("FF")` → `255` |
| `intToHex(num)` | 整数转十六进制 | `intToHex(255)` → `"FF"` |
| `binToInt(bin)` | 二进制转整数 | `binToInt("1010")` → `10` |
| `intToBin(num)` | 整数转二进制 | `intToBin(10)` → `"1010"` |
| `octToInt(oct)` | 八进制转整数 | `octToInt("12")` → `10` |
| `intToOct(num)` | 整数转八进制 | `intToOct(10)` → `"12"` |

## 📝 字符串处理函数

### 字符串操作

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `length(str)` | 返回字符串长度 | `length("hello")` → `5` |
| `upper(str)` | 转换为大写 | `upper("hello")` → `"HELLO"` |
| `lower(str)` | 转换为小写 | `lower("HELLO")` → `"hello"` |
| `trim(str)` | 去除首尾空格 | `trim(" hello ")` → `"hello"` |
| `ltrim(str)` | 去除左侧空格 | `ltrim(" hello")` → `"hello"` |
| `rtrim(str)` | 去除右侧空格 | `rtrim("hello ")` → `"hello"` |
| `reverse(str)` | 反转字符串 | `reverse("hello")` → `"olleh"` |
| `repeat(str, count)` | 重复字符串 | `repeat("hi", 3)` → `"hihihi"` |

### 字符串查找和替换

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `find(src, substr)` | 从头查找子串 | `find("hello world", "world")` → `"world"` |
| `find(src, substr, "leading")` | 从头查找第一个匹配 | `find("abcabc", "abc", "leading")` → `"abcabc"` |
| `find(src, substr, "trailing")` | 从尾查找第一个匹配 | `find("abcabc", "abc", "trailing")` → `"abc"` |
| `indexOf(str, substr)` | 返回子串位置 | `indexOf("hello", "ell")` → `1` |
| `lastIndexOf(str, substr)` | 返回子串最后位置 | `lastIndexOf("hello hello", "ello")` → `7` |
| `replace(str, old, new)` | 替换第一个匹配 | `replace("hello", "l", "x")` → `"hexlo"` |
| `replaceAll(str, old, new)` | 替换所有匹配 | `replaceAll("hello", "l", "x")` → `"hexxo"` |
| `contains(str, substr)` | 检查是否包含子串 | `contains("hello", "ell")` → `true` |
| `startsWith(str, prefix)` | 检查是否以指定前缀开始 | `startsWith("hello", "he")` → `true` |
| `endsWith(str, suffix)` | 检查是否以指定后缀结束 | `endsWith("hello", "lo")` → `true` |

### 字符串分割和截取

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `split(src, delimiter)` | 分割字符串 | `split("a,b,c", ",")` → `["a", "b", "c"]` |
| `split(src, delimiter, "leading")` | 从头分割一次 | `split("a,b,c", ",", "leading")` → `["a", "b,c"]` |
| `split(src, delimiter, "trailing")` | 从尾分割一次 | `split("a,b,c", ",", "trailing")` → `["a,b", "c"]` |
| `substring(str, start)` | 从指定位置截取到末尾 | `substring("hello", 1)` → `"ello"` |
| `substring(str, start, end)` | 截取指定范围 | `substring("hello", 1, 4)` → `"ell"` |
| `left(str, length)` | 从左截取指定长度 | `left("hello", 3)` → `"hel"` |
| `right(str, length)` | 从右截取指定长度 | `right("hello", 3)` → `"llo"` |
| `charAt(str, index)` | 获取指定位置字符 | `charAt("hello", 1)` → `"e"` |

### 字符串格式化

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `concat(str1, str2, ...)` | 连接多个字符串 | `concat("hello", " ", "world")` → `"hello world"` |
| `format(template, args...)` | 格式化字符串 | `format("Hello {0}", "world")` → `"Hello world"` |
| `padLeft(str, length, char)` | 左填充到指定长度 | `padLeft("5", 3, "0")` → `"005"` |
| `padRight(str, length, char)` | 右填充到指定长度 | `padRight("5", 3, "0")` → `"500"` |

## ⏰ 时间日期函数

### 时间获取

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `now()` | 获取当前时间戳（毫秒） | `now()` → `1690599987495` |
| `currentDate()` | 获取当前日期 | `currentDate()` → `"2023-07-29"` |
| `currentTime()` | 获取当前时间 | `currentTime()` → `"11:06:27"` |
| `currentDateTime()` | 获取当前日期时间 | `currentDateTime()` → `"2023-07-29 11:06:27"` |

### 时间格式化

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `date(timestamp)` | 格式化为日期字符串 | `date(1690599987495)` → `"2023-07-29"` |
| `datetime(timestamp)` | 格式化为日期时间字符串 | `datetime(1690599987495)` → `"2023-07-29 11:06:27"` |
| `time(timestamp)` | 格式化为时间字符串 | `time(1690599987495)` → `"11:06:27"` |
| `formatDate(timestamp, format)` | 自定义格式化日期 | `formatDate(1690599987495, "yyyy/MM/dd")` → `"2023/07/29"` |

### 时间转换

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `dateToTimestamp(dateStr)` | 日期字符串转时间戳 | `dateToTimestamp("2023-07-29")` → `1690560000000` |
| `datetimeToTimestamp(datetimeStr)` | 日期时间字符串转时间戳 | `datetimeToTimestamp("2023-07-29 11:06:27")` → `1690599987000` |
| `timeToTimestamp(timeStr)` | 时间字符串转时间戳 | `timeToTimestamp("11:06:27")` → `39987000` |

### 时间计算

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `addYears(timestamp, years)` | 增加年份 | `addYears(1690599987495, 1)` → `1722135987495` |
| `addMonths(timestamp, months)` | 增加月份 | `addMonths(1690599987495, 3)` → `1698375987495` |
| `addDays(timestamp, days)` | 增加天数 | `addDays(1690599987495, 7)` → `1691204787495` |
| `addHours(timestamp, hours)` | 增加小时 | `addHours(1690599987495, 2)` → `1690607187495` |
| `addMinutes(timestamp, minutes)` | 增加分钟 | `addMinutes(1690599987495, 30)` → `1690601787495` |
| `addSeconds(timestamp, seconds)` | 增加秒数 | `addSeconds(1690599987495, 60)` → `1690600047495` |

### 时间提取

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `year(timestamp)` | 提取年份 | `year(1690599987495)` → `2023` |
| `month(timestamp)` | 提取月份 | `month(1690599987495)` → `7` |
| `day(timestamp)` | 提取日期 | `day(1690599987495)` → `29` |
| `hour(timestamp)` | 提取小时 | `hour(1690599987495)` → `11` |
| `minute(timestamp)` | 提取分钟 | `minute(1690599987495)` → `6` |
| `second(timestamp)` | 提取秒数 | `second(1690599987495)` → `27` |
| `weekday(timestamp)` | 提取星期几 | `weekday(1690599987495)` → `6` |
| `weekOfYear(timestamp)` | 提取年中第几周 | `weekOfYear(1690599987495)` → `30` |
| `dayOfYear(timestamp)` | 提取年中第几天 | `dayOfYear(1690599987495)` → `210` |

## 🧮 数学计算函数

### 基础数学函数

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `abs(num)` | 绝对值 | `abs(-5)` → `5` |
| `max(a, b, ...)` | 最大值 | `max(1, 5, 3)` → `5` |
| `min(a, b, ...)` | 最小值 | `min(1, 5, 3)` → `1` |
| `round(num)` | 四舍五入 | `round(3.6)` → `4` |
| `round(num, digits)` | 指定小数位四舍五入 | `round(3.14159, 2)` → `3.14` |
| `floor(num)` | 向下取整 | `floor(3.9)` → `3` |
| `ceil(num)` | 向上取整 | `ceil(3.1)` → `4` |
| `truncate(num)` | 截断小数部分 | `truncate(3.9)` → `3` |

### 高级数学函数

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `sqrt(num)` | 平方根 | `sqrt(16)` → `4` |
| `pow(base, exp)` | 乘方 | `pow(2, 3)` → `8` |
| `exp(num)` | e的幂 | `exp(1)` → `2.718281828459045` |
| `log(num)` | 自然对数 | `log(2.718281828459045)` → `1` |
| `log10(num)` | 以10为底的对数 | `log10(100)` → `2` |
| `sin(angle)` | 正弦值（弧度） | `sin(1.5708)` → `1` |
| `cos(angle)` | 余弦值（弧度） | `cos(0)` → `1` |
| `tan(angle)` | 正切值（弧度） | `tan(0.7854)` → `1` |
| `random()` | 生成0-1随机数 | `random()` → `0.7234567` |
| `randomInt(min, max)` | 生成指定范围随机整数 | `randomInt(1, 10)` → `7` |

## 🔐 加密编码函数

### 哈希函数

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `md5(str)` | MD5 哈希 | `md5("hello")` → `"5d41402abc4b2a76b9719d911017c592"` |
| `sha1(str)` | SHA1 哈希 | `sha1("hello")` → `"aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"` |
| `sha256(str)` | SHA256 哈希 | `sha256("hello")` → `"2cf24dba4f21d4288..."` |
| `sha512(str)` | SHA512 哈希 | `sha512("hello")` → `"9b71d224bd62f378..."` |
| `crc32(str)` | CRC32 校验 | `crc32("hello")` → `"907060870"` |

### 编码解码

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `base64Encode(str)` | Base64 编码 | `base64Encode("hello")` → `"aGVsbG8="` |
| `base64Decode(str)` | Base64 解码 | `base64Decode("aGVsbG8=")` → `"hello"` |
| `urlEncode(str)` | URL 编码 | `urlEncode("hello world")` → `"hello%20world"` |
| `urlDecode(str)` | URL 解码 | `urlDecode("hello%20world")` → `"hello world"` |
| `htmlEncode(str)` | HTML 编码 | `htmlEncode("<div>")` → `"&lt;div&gt;"` |
| `htmlDecode(str)` | HTML 解码 | `htmlDecode("&lt;div&gt;")` → `"<div>"` |

## 📄 JSON 处理函数

### JSON 操作

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `json(obj)` | 对象转 JSON 字符串 | `json({"name": "test"})` → `"{\"name\":\"test\"}"` |
| `parseJson(str)` | 解析 JSON 字符串 | `parseJson("{\"name\":\"test\"}")` → `{"name": "test"}` |
| `jsonPath(json, path)` | 提取 JSON 路径值 | `jsonPath("{\"user\":{\"name\":\"tom\"}}", "$.user.name")` → `"tom"` |
| `jsonKeys(json)` | 获取 JSON 对象键列表 | `jsonKeys("{\"a\":1,\"b\":2}")` → `["a", "b"]` |
| `jsonValues(json)` | 获取 JSON 对象值列表 | `jsonValues("{\"a\":1,\"b\":2}")` → `[1, 2]` |
| `jsonSize(json)` | 获取 JSON 对象大小 | `jsonSize("{\"a\":1,\"b\":2}")` → `2` |

### JSON 验证

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `isJson(str)` | 检查是否为有效 JSON | `isJson("{\"name\":\"test\"}")` → `true` |
| `isJsonArray(str)` | 检查是否为 JSON 数组 | `isJsonArray("[1,2,3]")` → `true` |
| `isJsonObject(str)` | 检查是否为 JSON 对象 | `isJsonObject("{\"a\":1}")` → `true` |

## 📋 数组处理函数

### 数组操作

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `arrayLength(arr)` | 获取数组长度 | `arrayLength([1,2,3])` → `3` |
| `first(arr)` | 获取第一个元素 | `first([1,2,3])` → `1` |
| `last(arr)` | 获取最后一个元素 | `last([1,2,3])` → `3` |
| `nth(arr, index)` | 获取指定索引元素 | `nth([1,2,3], 1)` → `2` |
| `contains(arr, value)` | 检查数组是否包含值 | `contains([1,2,3], 2)` → `true` |
| `indexOf(arr, value)` | 获取值在数组中的索引 | `indexOf([1,2,3], 2)` → `1` |

### 数组聚合

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `sum(arr)` | 求和 | `sum([1,2,3])` → `6` |
| `avg(arr)` | 平均值 | `avg([1,2,3])` → `2` |
| `maxArray(arr)` | 数组最大值 | `maxArray([1,5,3])` → `5` |
| `minArray(arr)` | 数组最小值 | `minArray([1,5,3])` → `1` |
| `distinct(arr)` | 去重 | `distinct([1,1,2,3])` → `[1,2,3]` |
| `sort(arr)` | 排序 | `sort([3,1,2])` → `[1,2,3]` |
| `reverse(arr)` | 反转 | `reverse([1,2,3])` → `[3,2,1]` |

## 🔍 类型检查函数

### 数据类型判断

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `isNull(value)` | 检查是否为 null | `isNull(null)` → `true` |
| `isNotNull(value)` | 检查是否不为 null | `isNotNull("test")` → `true` |
| `isEmpty(value)` | 检查是否为空 | `isEmpty("")` → `true` |
| `isNotEmpty(value)` | 检查是否不为空 | `isNotEmpty("test")` → `true` |
| `isNumber(value)` | 检查是否为数字 | `isNumber("123")` → `true` |
| `isString(value)` | 检查是否为字符串 | `isString("test")` → `true` |
| `isBoolean(value)` | 检查是否为布尔值 | `isBoolean(true)` → `true` |
| `isArray(value)` | 检查是否为数组 | `isArray([1,2,3])` → `true` |
| `isBytes(value)` | 检查是否为字节数组 | `isBytes(bytes("test"))` → `true` |

## 🆔 ID 生成函数

### 唯一标识生成

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `uuid()` | 生成 32 位小写 UUID | `uuid()` → `"56ea0797a6ed4d309bf71e0dd6ecd73c"` |
| `uuidUpper()` | 生成 32 位大写 UUID | `uuidUpper()` → `"09D27DE32DBF4AA19FD46339A31E184B"` |
| `uuidWithHyphen()` | 生成带连字符的 UUID | `uuidWithHyphen()` → `"550e8400-e29b-41d4-a716-446655440000"` |
| `snowflakeId()` | 生成雪花算法 ID | `snowflakeId()` → `1425566194560000000` |
| `nanoid()` | 生成 NanoID | `nanoid()` → `"V1StGXR8_Z5jdHi6B-myT"` |
| `nanoid(size)` | 生成指定长度 NanoID | `nanoid(10)` → `"V1StGXR8_Z"` |

## 🛠️ 实用工具函数

### 数据转换

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `bytes(src)` | 转换为字节数组 | `bytes("hello")` → `[104, 101, 108, 108, 111]` |
| `coalesce(val1, val2, ...)` | 返回第一个非 null 值 | `coalesce(null, "default")` → `"default"` |
| `ifNull(value, default)` | 如果为 null 则返回默认值 | `ifNull(null, "default")` → `"default"` |
| `greatest(val1, val2, ...)` | 返回最大值 | `greatest(1, 5, 3)` → `5` |
| `least(val1, val2, ...)` | 返回最小值 | `least(1, 5, 3)` → `1` |

### 条件函数

| **函数名** | **说明** | **示例** |
|-----------|---------|---------|
| `ifCondition(condition, trueValue, falseValue)` | 条件判断 | `ifCondition(true, "yes", "no")` → `"yes"` |
| `decode(value, search1, result1, ..., default)` | 多条件匹配 | `decode(2, 1, "one", 2, "two", "other")` → `"two"` |

## 📊 函数使用示例

### 示例 1：MQTT 消息处理
```sql
-- 处理温湿度传感器数据
SELECT 
    clientId,
    topic,
    json(msg) as message,
    toDouble(jsonPath(msg, '$.temperature')) as temp,
    toDouble(jsonPath(msg, '$.humidity')) as humidity,
    datetime(timestamp) as receive_time,
    uuid() as record_id
FROM "$EVENT.PUBLISH"
WHERE topic LIKE 'sensor/+/data'
```

### 示例 2：数据验证和转换
```sql
-- 验证和清理 IoT 设备数据
SELECT 
    *,
    CASE 
        WHEN isNumber(jsonPath(msg, '$.value')) AND 
             toDouble(jsonPath(msg, '$.value')) BETWEEN -40 AND 85 
        THEN 'VALID'
        ELSE 'INVALID'
    END as data_status,
    coalesce(jsonPath(msg, '$.deviceId'), clientId) as device_identifier,
    md5(concat(clientId, topic, str(timestamp))) as message_hash
FROM "$EVENT.PUBLISH"
WHERE isJson(msg)
```

### 示例 3：时间序列数据聚合
```sql
-- 按小时聚合传感器数据
SELECT 
    hour(timestamp) as hour_of_day,
    avg(toDouble(jsonPath(msg, '$.temperature'))) as avg_temp,
    max(toDouble(jsonPath(msg, '$.temperature'))) as max_temp,
    min(toDouble(jsonPath(msg, '$.temperature'))) as min_temp,
    count(*) as reading_count
FROM "$EVENT.PUBLISH"
WHERE topic = 'sensor/temperature/data'
    AND isJson(msg)
    AND isNumber(jsonPath(msg, '$.temperature'))
GROUP BY hour(timestamp)
```

### 示例 4：设备状态监控
```sql
-- 设备在线状态检测
SELECT 
    clientId,
    CASE 
        WHEN now() - timestamp < 300000 THEN 'ONLINE'
        WHEN now() - timestamp < 900000 THEN 'WARNING'
        ELSE 'OFFLINE'
    END as device_status,
    formatDate(timestamp, 'yyyy-MM-dd HH:mm:ss') as last_seen,
    floor((now() - timestamp) / 60000) as minutes_since_last_message
FROM "$EVENT.PUBLISH"
WHERE topic LIKE 'device/+/heartbeat'
```

### 示例 5：数据库保存模板
```plsql
-- 保存处理后的消息到数据库
INSERT INTO iot_messages(
    device_id, 
    topic, 
    message_data, 
    temperature, 
    humidity, 
    created_at,
    message_hash
) VALUES (
    '${coalesce(jsonPath(msg, "$.deviceId"), clientId)}',
    '${topic}',
    '${json(msg)}',
    ${ifNull(jsonPath(msg, "$.temperature"), "NULL")},
    ${ifNull(jsonPath(msg, "$.humidity"), "NULL")},
    '${datetime(timestamp)}',
    '${md5(concat(clientId, topic, str(timestamp)))}'
)
```

## 💡 最佳实践

### 1. 性能优化
- 在大数据量处理时，避免在 WHERE 子句中使用复杂函数
- 优先使用类型检查函数验证数据，避免转换异常
- 合理使用缓存机制，避免重复计算

### 2. 错误处理
- 使用 `coalesce()` 和 `ifNull()` 处理空值
- 在类型转换前先使用类型检查函数验证
- 使用 `isJson()` 验证 JSON 数据有效性

### 3. 数据安全
- 对敏感数据使用哈希函数进行脱敏
- 使用 UUID 生成唯一标识符
- 避免在函数中暴露敏感信息

### 4. 可读性
- 使用有意义的别名
- 合理使用格式化函数美化输出
- 添加注释说明复杂的函数组合

:::info 注意事项
- 所有函数的字符串参数都必须是合法的格式
- 数值转换函数要求输入在有效范围内
- 时间戳函数使用毫秒级精度
- JSON 路径表达式遵循 JSONPath 语法
:::

通过合理使用这些内置函数，您可以构建强大而灵活的规则引擎，满足各种 IoT 数据处理需求。
