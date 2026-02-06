# NACOS

## 场景说明
支持Nacos注册中心，通过HTTP请求，方便使用feign进行服务接口调用完成指令下发，默认POST请求 "/public/mqtt/publish"

## 前提条件
- 拥有可使用的Nacos实例

## 配置指令消费实例
### 1. 选择左侧导航栏的“指令消费”，单击左上角的“+”来新建指令消费配置。
![nacos_cmd_1.png](@site/static/images/command/nacos_cmd_1.png)

### 2. 配置界面参考下表参数说明，填写相关内容。以下参数取值仅为示例，填写完成后单击“提交”。
#### 编辑指令消费
| **参数名**    | **参数说明**                       |
|------------|--------------------------------|
| 指令消费类型     | 默认，如：Nacos                     |
| 指令消费名称     | 指令消费实例名，如：param_cmd            |
| 注册地址       | Nacos注册地址，如：127.0.0.1:8848     |
| namespace  | Nacos配置namespace名，默认：DEFAULT   |
| 服务名称       | 在Nacos注册的服务名，如：fluxmq          |
| 分组         | namespace下的分组，默认：DEFAULT_GROUP |
| 用户名        | 访问Nacos的用户名                    |
| 密码         | 访问Nacos的密码                     |
![nacos_cmd_2.png](@site/static/images/command/nacos_cmd_2.png)

### 3. 管理指令消费实例，可以通过看板界面继续编辑、启停用、删除操作
![nacos_cmd_3.png](@site/static/images/command/nacos_cmd_3.png)

### 4. 服务调用代码Demo
```
@FeignClient("fluxmq")//服务名称
public interface MqttPulishService {
    @PostMapping("/api/publish")
    void send(@RequestBody PublishBody body);
}

@Data
public class PublishBody {
    private String topic;
    private int qos;
    private boolean retain;
    private String payload_encoding;
    private String payload;
}

```

`payload_encoding`取值

| **参数名**      | **参数说明**                         |
|--------------|----------------------------------|
| plain         | 明文 |
| base64 | base加密               |
