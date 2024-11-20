# 内置 SQL 函数
FluxMQ为了增强功能，提供了函数功能，可以通过函数来实现一些字符串处理,可以通过函数来转换想要的数据格式，注意基本类型转换，传入的字符串参数必须合法，并且在范围内

## 函数列表
| **函数名**                     | **说明**                                                                         |
|-----------------------------|--------------------------------------------------------------------------------|
| str(src)                    | - 使用在SQL语句中，可以将字节构转换成字符串<br />- 使用在支持模板替换的想象中，比如数据库保存的SQL，KAFKA的TOPIC等地方       |
| json(src)                   | - 使用在SQL语句中，可以将嵌套的Json结构转换成字符串<br />- 使用在支持模板替换的想象中，比如数据库保存的SQL，KAFKA的TOPIC等地方 |
| bytes(src)                  | 将对象转成字节数组，会先将对象JSON化，再转成UTF8格式的字节数组                                            |
| int8(src)                   | 将对象转为Int8类型，相当于byte                                                            |
| int16(src)                  | 将对象转为Int16类型，相当于short                                                          |
| int32(src)                  | 将对象转为Int32类型，相当于int                                                            |
| int64(src)                  | 将对象转为Int64类型，相当于long                                                           |
| toDouble(src)               | 将对象转为double类型                                                                  |
| hexStr(src)                 | 将对象转成HEX字符串， 会先将对象JSON化，再转成对象的16进制字符串                                          |
| date(src)                   | 格式化时间字符串：yyyy-MM-dd                                                            |
| datetime(src)               | 格式化时间字符串：yyyy-MM-dd HH:mm:ss                                                   |
| dateToTimestamp(src)        | yyyy-MM-dd 时间字符串转成时间戳                                                          |
| datetimeToTimestamp(src)    | yyyy-MM-dd HH:mm:ss 时间字符串转成时间戳                                                 |
| uuid()                      | 生成32位随机小写字符串                                                                   |
| uuidUpper()                 | 生成32位随机大写字符串                                                                   |
| isBytes(src)                | 判断是否是字节数组                                                                      |
| isJson(src)                 | 判断是否是json                                                                      |
| find(src,"字符串")             | 从头查找第一个包含子串的                                                                   |
| find(src,"字符串","leading")   | 从头查找第一个包含子串的                                                                   |
| find(src,"字符串","trailing")  | 从尾查找第一个包含子串的                                                                   |
| split(src,"字符串")            | 根据字符串切割原字符串                                                                    |
| split(src,"字符串","leading")  | 从头切割只切割第一个字符                                                                   |
| split(src,"字符串","trailing") | 从尾切割只切割第一个字符                                                                   |
| last(src)                   | 获取最后一个数组元素                                                                     |
| base64_encode(src)          | 获取base64加密字符串                                                                  |
| md5(src)                    | 获取md5加密字符串                                                                     |
| sha1(src)                   | 获取sha1加密字符串                                                                    |
| sha256(src)                 | 获取sha256加密字符串                                                                  |
| sha512(src)                 | 获取sha512加密字符串                                                                  |

```java
json({"x":"1"}) = "{\"x\":\"1\"}"
bytes("abcd") = [97, 98, 99, 100]
int8("123") = 123
int16("123") = 123
int32("123") = 123
int64("123") = 123
toDouble("123") = 123.0
hexStr("test") = 74657374
date("1690599987495") = "2023-07-29"
datetime("1690599987495") = "2023-07-29 11:06:27"
dateToTimestamp("2023-07-29") = "1690599987495"
datetimeToTimestamp("2023-07-29 11:06:27") = "1690599987495"
uuid() = "56ea0797a6ed4d309bf71e0dd6ecd73c"
uuidUpper() = "09D27DE32DBF4AA19FD46339A31E184B"
split('a/b/ c', '/') = ['a', 'b', ' c']
split('a/b/ c', '/', 'leading') = ['a', 'b/ c']
split('a/b/ c', '/', 'trailing') = ['a/b', ' c']
find('eeabcabcee', 'abc') = 'abcabcee'
find('eeabcabcee', 'abc', 'leading') = 'abcabcee'
find('eeabcabcee', 'abc', 'trailing') = 'abcee' 
```
<a name="OGC3L"></a>
## 函数使用
以发布消息为例，将消息保存到数据库中，发布的数据格式如下：
```json
{
  "msg": "{
    "temperature": 40，
    "humidity": 24
  },
  "qos": 1,
  "topic": "test/fluxmq",
  "clientId": "A1212313",
  "timestamp": 1632931200000
}
```
SQL语句如下：
```plsql
select * from "$EVENT.PUBLISH"
```
保存到数据库中的SQL语句如下:
```plsql
insert into 
	test(topic,qos,msg,clientId,timestamp) 
values
	('${test}',${qos},'${json(msg)}','${clientId}',${timestamp})
```
最终给 'msg' 字段处理成json字符串
```
"{\"temperature\": 40,\"humidity\": 24}"
```