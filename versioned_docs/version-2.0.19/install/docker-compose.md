# docker-compose

## docker-compose.yml
```yaml
version: '3'
services:
  fluxmq:
    image: fluxmq/enterprise:2.0.19  # 请替换为您的fluxmq镜像名称和标签
    ports:
      - "8080:8080"
      - "1883:1883"
      - "8883:8883"
    expose:
      - 8080
      - 1883
      - 8883
    volumes:
      - /app/:/app/
    networks:
      - fluxmq_network  # 将fluxmq服务添加到自定义网络

networks:
  fluxmq_network:  # 定义自定义网络
```


## 启动
```shell
docker-compose up -d
```

启动完成后访问：http://host:8080

