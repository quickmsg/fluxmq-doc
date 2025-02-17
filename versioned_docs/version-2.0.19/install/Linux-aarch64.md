# linux-aarch64安装

## 下载安装包
```shell
wget https://fluxmq.obs.cn-east-3.myhuaweicloud.com/fluxmq-2.0.18-linux-aarch64.zip
```
## License
FluxMQ默认提供100连接的免费接入，安装包下载后自带免费License，如需更多接入数请联系我们获取商业License！

## Jar启动
1. 执行`add-executable-permission.sh`脚本
```shell
sh add-executable-permission.sh
```
2. 运行服务

```shell
./fluxmq.sh
```

## Systemd启动
创建Systemd Service

```shell
./fluxmq-systemd.sh
```

启动服务
```shell
systemctl start fluxmq
```


## 管理页面
```shell
http://ip:8080/
```

