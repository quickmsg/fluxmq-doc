# 消息推送

## 消息发布接口

| **参数名**      | **参数说明**                         |
|--------------|----------------------------------|
| PATH         | POST  http://ip:8080/api/publish |
| Context-Type | application/json                 |

### Request Body

```json  
{                   
	"topic": "test/test",
	"payload": "测试一下",
	"payload_encoding": "plain",
	"qos": 1,
	"retain": false
}
 ```

`payload_encoding`取值

| **参数名**      | **参数说明**                         |
|--------------|----------------------------------|
| plain         | 明文 |
| base64 | base加密               |

### Response
> code为0时成功

```json  
{                   
  "code": 0
}
 ```