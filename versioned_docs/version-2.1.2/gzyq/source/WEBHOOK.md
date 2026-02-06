# Webhook

## 什么是Webhook
FluxMQ提供了Webhook功能，可以将消息发送到HTTP服务中，HTTP服务可以是自己的业务系统，也可以是第三方的系统，比如钉钉、企业微信等。

## Webhook配置
> FluxMQ默认仅提供POST请求的Webhook，如果需要其他请求方式，可以联系我们。

### Webhook配置说明
| 配置项    | 说明                                        |
|--------|-------------------------------------------|
| 请求地址   | Webhook的URL地址：ip:port/path                |
| method | 暫不支持配置、Webhook的请求方式，目前仅支持POST请求           |
| 请求头    | Webhook的请求头，可以配置多个，每个请求头占一行，格式为：key:value |

