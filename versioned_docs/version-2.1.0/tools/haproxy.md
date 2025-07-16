# HaProxy配置
## 源码下载
haproxy [源码地址](https://www.haproxy.org/download/)
## 源码编译

> [官方文档地址](https://github.com/haproxy/haproxy/blob/master/INSTALL)

```shell
make clean
make -j $(nproc) TARGET=linux-glibc USE_OPENSSL=1 USE_QUIC=1 USE_QUIC_OPENSSL_COMPAT=1 USE_LUA=1 USE_PCRE2=1 
sudo make install
```


## 配置文件

> 创建/etc/haproxy/haproxy.cfg文件，根据需要对下面的配置文件进行修改并粘贴在该文件中。

```bash
global  
  log 127.0.0.1 local3 info 
  daemon  
  maxconn 10240

defaults  
  log global 
  mode tcp 
  option tcplog 
  timeout connect 10s
  # timeout需要根据mqtt的keepalive时间来进行设置，设置为 keepalive * 1.2  
  timeout client 240s  
  timeout server 240s 
  maxconn 20000

# mqtt tcp 协议代理配置
backend mqtt_backend
  mode tcp
  stick-table type string len 32 size 100k expire 30m
  stick on req.payload(0,0), mqtt_field_value(connect,client_identifier)
  # 增加 send-proxy 会把真实带IP透传给fluxmq，fluxmq配置中需要将proxy字段设置为true
  # server fluxmq1 fluxmq1.com:1883 check send-proxy-v2
  server fluxmq1 fluxmq1.com:1883 check
  server fluxmq2 fluxmq2.com:1883 check
  server flmxmq3 fluxmq3.com:1883 check
frontend mqtt_servers
  bind *:1883
  mode tcp
  # 等待缓冲区填满，以便解析MQTT报文
  tcp-request inspect-delay 10s
  # 拒绝非MQTT协议的连接
  tcp-request content reject unless { req.payload(0,0), mqtt_is_valid }
  default_backend mqtt_backend

# mqtt tls 协议代理配置
backend mqtts_backend
  mode tcp
  balance roundrobin
 
  server fluxmq1 fluxmq1.com:1883 check
  server fluxmq2 fluxmq2.com:1883 check
  server flmxmq3 fluxmq3.com:1883 check

frontend mqtts_frontend
  bind *:1883 ssl crt /etc/haproxy/certs/server.pem 
  # 双向认证
  # bind *:8883 ssl ca-file /etc/haproxy/certs/cacert.pem crt /etc/haproxy/certs/server.pem verify required
  mode tcp
  default_backend mqtts_backend

#mqtt ws 代理配置
backend mqtt_ws_backend
  mode tcp
  balance roundrobin
  server fluxmq1 fluxmq1.com:8883 check
  server fluxmq2 fluxmq2.com:8883 check
  server flmxmq3 fluxmq3.com:8883 check

frontend mqtt_ws_frontend
  bind *:8883 
  mode tcp
  default_backend mqtt_ws_backend

# mqtt wss 代理配置
backend mqtt_wss_backend
  mode tcp
  balance roundrobin
  server fluxmq1 fluxmq1.com:8883 check
  server fluxmq2 fluxmq2.com:8883 check
  server flmxmq3 fluxmq3.com:8883 check

frontend mqtt_wss_frontend
  bind *:8883 ssl crt /etc/haproxy/certs/server.pem
  mode tcp 
  default_backend mqtt_wss_backend
```
## Systemd 启动

> 将下述文件按照对应操作系统的规范置于对应位置，根据haprxoy二进制文件的位置修改execStart和execReload中的路径，然后使用systemctl命令进行服务的启动。

```
[Unit]
Description=HAProxy Load Balancer
After=network-online.target rsyslog.service
Wants=network-online.target

[Service]
EnvironmentFile=-/etc/default/haproxy
EnvironmentFile=-/etc/sysconfig/haproxy
BindReadOnlyPaths=/dev/log:/var/lib/haproxy/dev/log
Environment="CONFIG=/etc/haproxy/haproxy.cfg" "PIDFILE=/run/haproxy.pid" "EXTRAOPTS=-S /run/haproxy-master.sock"
ExecStart=/usr/sbin/haproxy -Ws -f $CONFIG -p $PIDFILE $EXTRAOPTS
ExecReload=/usr/sbin/haproxy -Ws -f $CONFIG -c $EXTRAOPTS
ExecReload=/bin/kill -USR2 $MAINPID
KillMode=mixed
Restart=always
SuccessExitStatus=143
Type=notify

# The following lines leverage SystemD's sandboxing options to provide
# defense in depth protection at the expense of restricting some flexibility
# in your setup (e.g. placement of your configuration files) or possibly
# reduced performance. See systemd.service(5) and systemd.exec(5) for further
# information.

# NoNewPrivileges=true
# ProtectHome=true
# If you want to use 'ProtectSystem=strict' you should whitelist the PIDFILE,
# any state files and any other files written using 'ReadWritePaths' or
# 'RuntimeDirectory'.
# ProtectSystem=true
# ProtectKernelTunables=true
# ProtectKernelModules=true
# ProtectControlGroups=true
# If your SystemD version supports them, you can add: @reboot, @swap, @sync
# SystemCallFilter=~@cpu-emulation @keyring @module @obsolete @raw-io

[Install]
WantedBy=multi-user.target
```