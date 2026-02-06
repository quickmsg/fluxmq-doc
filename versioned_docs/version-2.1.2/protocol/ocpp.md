# OCPP
> OCPP，即开放充电通信协议（Open Charge Point Protocol），是一种用于电动汽车充电设备之间通信的协议标准

## 启动
> 请参考WEBSOCKET使用

OCPP协议基于WEBSOCKET协议，报文内容是JSON格式。因为可以直接使用WEBSOCKET插件进行协议接入。

## 安全白皮书

支持BASIC认证
![img.png](@site/static/images/protocol/ocpp/img.png)
开启BASIC认证后,连接WEBSOCKET的HTTP需要携带以下信息:
```TEXT
Authorization: Basic Y2h5aW5ncDoxMjM0NTY=
```
Authorization首部的格式为Basic base64(userid:password)


