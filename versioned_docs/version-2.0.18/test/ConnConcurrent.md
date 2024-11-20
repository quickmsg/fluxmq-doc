# 连接&并发测试

![image.png](@site/static/images/test/img.png)
```shell
-Dname=$AppName  -Duser.timezone=Asia/Shanghai -Xmx28G -Xms28G -XX:MetaspaceSize=200M  -XX:+UseG1GC   -XX:MaxGCPauseMillis=200 -Xloggc:`$APP_HOME`/gc.log -XX:GCLogFileSize=10M -XX:NumberOfGCLogFiles=10 -XX:+UseGCLogFileRotation -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+PrintGCDetails -XX:+DisableExplicitGC -verbose:gc
```
> 仅仅部署一台MQTT节点进行压测

### 95W连接 && 5W TPS
![Dashboard](@site/static/images/test/img_53.png)
![MQTT](@site/static/images/test/img_54.png)
![MQTT](@site/static/images/test/img_55.png)
![JVM](@site/static/images/test/img_56.png)
![JVM](@site/static/images/test/img_57.png)

### 97W连接 && 7W TPS
![Dashboard](@site/static/images/test/img_58.png)
![MQTT](@site/static/images/test/img_59.png)
![MQTT](@site/static/images/test/img_60.png)
![JVM](@site/static/images/test/img_61.png)
![JVM](@site/static/images/test/img_62.png)

### 100W连接 && 10W TPS
![Dashboard](@site/static/images/test/img_63.png)
![MQTT](@site/static/images/test/img_64.png)
![MQTT](@site/static/images/test/img_65.png)
![JVM](@site/static/images/test/img_66.png)
![JVM](@site/static/images/test/img_67.png)