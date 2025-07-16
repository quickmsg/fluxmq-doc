# 客户端关闭

## 连接关闭接口

| **参数名**      | **参数说明**                       |
|--------------|--------------------------------|
| PATH         | POST  http://ip:8080/api/close|
| Context-Type | application/json               |

### Request Body

```json  
{
  "ids": [
    "123",
    "123"
  ]
}
 ```


### Response
> http状态码200
