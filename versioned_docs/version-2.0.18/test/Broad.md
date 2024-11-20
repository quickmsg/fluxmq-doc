# 广播压测

![image.png](@site/static/images/test/img.png)
```shell
-Dname=$AppName  -Duser.timezone=Asia/Shanghai -Xmx28G -Xms28G -XX:MetaspaceSize=200M  -XX:+UseG1GC   -XX:MaxGCPauseMillis=200 -Xloggc:`$APP_HOME`/gc.log -XX:GCLogFileSize=10M -XX:NumberOfGCLogFiles=10 -XX:+UseGCLogFileRotation -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+PrintGCDetails -XX:+DisableExplicitGC -verbose:gc
```
> 仅仅部署一台MQTT节点进行压测

### 10W TPS
| 订阅 | 推送 | 报文大小 | cpu | 内存内存(最大使用) |
| --- | --- | --- | --- | --- |
| 50000 | 2/s | 160B | 20% | 1.7G |
| 50000 | 2/s | 1024B | 22% | 1.9G |

**160B压测截图：**


![Dashboard](@site/static/images/test/img_5.png)

![MQTT](@site/static/images/test/img_6.png)

![JVM](@site/static/images/test/img_7.png)



**1024B压测截图：**
![Dashboard](@site/static/images/test/img_8.png)
![MQTT](@site/static/images/test/img_9.png)
![JVM](@site/static/images/test/img_10.png)




### 20W TPS

| 订阅 | 推送 | 报文大小 | cpu | 内存(最大使用) |
| --- | --- | --- | --- | --- |
| 50000 | 4/s | 160B | 23% | 1.7G |
| 50000 | 4/s | 1024B | 24% | 1.9G |

**160B压测截图：**

![MQTT](@site/static/images/test/img_11.png)
![MQTT](@site/static/images/test/img_12.png)
![JVM](@site/static/images/test/img_13.png)
![MQTT](@site/static/images/test/img_14.png)



**1024B压测截图：**

![JVM](@site/static/images/test/img_18.png)
![Dashboard](@site/static/images/test/img_15.png)
![MQTT](@site/static/images/test/img_16.png)
![MQTT](@site/static/images/test/img_17.png)



### 40W TPS
| 订阅 | 推送 | 报文大小 | cpu | 内存(最大使用) |
| --- | --- | --- | --- | --- |
| 100000 | 4/s | 160B | 48% | 15G |
| 100000 | 4/s | 1024B | GC过长 已到瓶颈 |  |

**160B压测截图：**


![Dashboard](@site/static/images/test/img_19.png)
![MQTT](@site/static/images/test/img_20.png)
![MQTT](@site/static/images/test/img_21.png)
![JVM](@site/static/images/test/img_22.png)


**1024B压测截图：**
> **如果追求极致性能 还是有很大优化空间**
![JVM](@site/static/images/test/img_23.png)
