# 安装包部署
> 免费提供非商业化使用，商业化使用请联系管理员 18510240791

## 2.1.0 版本新特性
FluxMQ 2.1.0 版本包含以下重要更新：
- **规则引擎增强**：新增30+内置函数，支持更复杂的数据处理
- **离线消息功能**：支持QoS1/2消息的离线存储和自动投递
- **新增数据源**：支持ClickHouse、RocketMQ、TDengine等
- **性能优化**：规则引擎执行性能提升40%，内存使用减少25%
- **监控增强**：新增规则引擎性能监控和优化建议

## 下载安装包
[Release](https://www.fluxmq.com/#/download)
## 配置
### FluxMQ启动配置文件
修改安装包下的:config.yaml,具体文件参考 `配置指南`
### JVM启动参数
修改安装包下的:jvm_options.conf,启动时根据配置修改运行参数即可
```shell
-Dname=FluxMQ  
-Duser.timezone=Asia/Shanghai
-XX:MetaspaceSize=200M  
-XX:+UseG1GC  
-Xmx16G 
-Xms16G 
-XX:MaxGCPauseMillis=200 
-Xloggc:`$APP_HOME`/gc.log 
-XX:GCLogFileSize=10M 
-XX:NumberOfGCLogFiles=10 
-XX:+UseGCLogFileRotation 
-XX:+PrintGCDateStamps 
-XX:+PrintGCTimeStamps 
-XX:+PrintGCDetails 
-XX:+DisableExplicitGC 
# 2.1.0 版本优化参数
-XX:+UseStringDeduplication
-XX:+OptimizeStringConcat
-XX:+UseCompressedOops
-XX:+UseCompressedClassPointers
```
## Windows
使用管理员权限运行`start.bat`即可运行FluxMQ。

## Linux
### 添加执行权限
```shell
chmod +x fluxmq start.sh stop.sh
```
### 启动
```shell
./start.sh
```

### 停止
```shell
./stop.sh
```
