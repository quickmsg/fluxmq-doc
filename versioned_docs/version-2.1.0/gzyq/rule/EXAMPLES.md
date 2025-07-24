# 规则引擎实战案例

## 概述
本文档提供 FluxMQ 规则引擎在实际业务场景中的完整应用案例，帮助用户快速上手并掌握规则引擎的实际应用。

## 案例一：智能环境监控系统

### 业务背景
某智慧园区需要监控各区域的温湿度数据，当环境异常时自动触发告警，并将历史数据存储到数据库用于分析。

### 数据格式
```json
{
  "deviceId": "sensor_001",
  "location": "building_a/floor_2/room_201",
  "temperature": 25.5,
  "humidity": 65.2,
  "timestamp": 1690599987495
}
```

### 规则配置

#### 规则1：正常数据存储
```sql
-- 规则名称：环境数据存储
-- 描述：将所有环境传感器数据存储到MySQL数据库
SELECT 
  uuid() as id,
  clientId as device_id,
  split(topic, '/').get(1) as building,
  split(topic, '/').get(2) as floor, 
  split(topic, '/').get(3) as room,
  payload.temperature as temperature,
  payload.humidity as humidity,
  datetime(timestamp) as record_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'sensor/+/environment' 
  AND isJson(payload)
```

**动作配置 - MySQL存储：**
```sql
INSERT INTO environment_data (
  id, device_id, building, floor, room, 
  temperature, humidity, record_time
) VALUES (
  '${id}', '${device_id}', '${building}', 
  '${floor}', '${room}', ${temperature}, 
  ${humidity}, '${record_time}'
)
```

#### 规则2：高温告警
```sql
-- 规则名称：高温告警
-- 描述：当温度超过30度时发送告警
SELECT 
  clientId as device_id,
  'HIGH_TEMPERATURE' as alert_type,
  payload.temperature as current_temp,
  'Temperature exceeds threshold' as message,
  split(topic, '/').get(1) as location,
  datetime(timestamp) as alert_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'sensor/+/environment' 
  AND payload.temperature > 30
```

**动作配置 - Webhook告警：**
```json
{
  "alert_type": "${alert_type}",
  "device_id": "${device_id}",
  "location": "${location}",
  "current_temperature": ${current_temp},
  "message": "${message}",
  "timestamp": "${alert_time}"
}
```

#### 规则3：设备离线检测
```sql
-- 规则名称：设备离线检测
-- 描述：检测设备连接状态变化
SELECT 
  clientId as device_id,
  'DEVICE_OFFLINE' as event_type,
  clientIp as last_ip,
  datetime(timestamp) as offline_time
FROM "$EVENT.DISCONNECT" 
WHERE clientId =~ 'sensor_.*'
```

## 案例二：车联网数据处理

### 业务背景
车联网平台需要实时处理车辆上报的GPS、速度、燃油等数据，实现轨迹记录、超速告警、油耗统计等功能。

### 数据格式
```json
{
  "vehicleId": "CAR001",
  "gps": {
    "latitude": 39.9042,
    "longitude": 116.4074
  },
  "speed": 80,
  "fuel": 45.5,
  "engineStatus": "running",
  "timestamp": 1690599987495
}
```

### 规则配置

#### 规则1：轨迹数据存储
```sql
-- 规则名称：车辆轨迹记录
SELECT 
  clientId as vehicle_id,
  payload.gps.latitude as latitude,
  payload.gps.longitude as longitude,
  payload.speed as speed,
  payload.fuel as fuel_level,
  datetime(timestamp) as record_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'vehicle/+/location' 
  AND payload.gps.latitude > 0 
  AND payload.gps.longitude > 0
```

**动作配置 - ClickHouse存储（适合大数据分析）：**
```sql
INSERT INTO vehicle_trajectory (
  vehicle_id, latitude, longitude, speed, 
  fuel_level, record_time
) VALUES (
  '${vehicle_id}', ${latitude}, ${longitude}, 
  ${speed}, ${fuel_level}, '${record_time}'
)
```

#### 规则2：超速告警
```sql
-- 规则名称：超速监控
SELECT 
  clientId as vehicle_id,
  payload.speed as current_speed,
  'SPEED_VIOLATION' as violation_type,
  payload.gps.latitude as latitude,
  payload.gps.longitude as longitude,
  datetime(timestamp) as violation_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'vehicle/+/location' 
  AND payload.speed > 120  -- 超过120km/h
```

**动作配置 - Kafka消息队列：**
```json
{
  "vehicle_id": "${vehicle_id}",
  "violation_type": "${violation_type}",
  "current_speed": ${current_speed},
  "location": {
    "latitude": ${latitude},
    "longitude": ${longitude}
  },
  "timestamp": "${violation_time}"
}
```

#### 规则3：低油量预警
```sql
-- 规则名称：低油量预警
SELECT 
  clientId as vehicle_id,
  payload.fuel as fuel_level,
  'LOW_FUEL' as alert_type,
  datetime(timestamp) as alert_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'vehicle/+/location' 
  AND payload.fuel < 20  -- 油量低于20%
```

## 案例三：智能制造设备监控

### 业务背景
工厂需要监控生产设备的运行状态，包括设备温度、振动、功率等参数，实现预测性维护和异常检测。

### 数据格式
```json
{
  "equipmentId": "MACHINE_001",
  "workshop": "A",
  "line": "L1",
  "metrics": {
    "temperature": 68.5,
    "vibration": 2.3,
    "power": 1500,
    "pressure": 8.2
  },
  "status": "running"
}
```

### 规则配置

#### 规则1：设备状态监控
```sql
-- 规则名称：设备运行状态监控
SELECT 
  clientId as equipment_id,
  payload.workshop as workshop,
  payload.line as production_line,
  payload.metrics.temperature as temperature,
  payload.metrics.vibration as vibration,
  payload.metrics.power as power_consumption,
  payload.metrics.pressure as pressure,
  payload.status as equipment_status,
  datetime(timestamp) as record_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'factory/+/metrics' 
  AND isJson(payload)
```

**动作配置 - TDengine时序数据库：**
```sql
INSERT INTO equipment_metrics USING metrics_template 
TAGS ('${equipment_id}', '${workshop}', '${production_line}') 
VALUES (
  '${record_time}', ${temperature}, ${vibration}, 
  ${power_consumption}, ${pressure}, '${equipment_status}'
)
```

#### 规则2：异常检测和预警
```sql
-- 规则名称：设备异常检测
SELECT 
  clientId as equipment_id,
  'EQUIPMENT_ANOMALY' as alert_type,
  CASE 
    WHEN payload.metrics.temperature > 80 THEN 'HIGH_TEMPERATURE'
    WHEN payload.metrics.vibration > 5.0 THEN 'HIGH_VIBRATION'
    WHEN payload.metrics.power > 2000 THEN 'HIGH_POWER'
    ELSE 'UNKNOWN'
  END as anomaly_type,
  json(payload.metrics) as current_metrics,
  datetime(timestamp) as alert_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'factory/+/metrics' 
  AND (
    payload.metrics.temperature > 80 OR
    payload.metrics.vibration > 5.0 OR 
    payload.metrics.power > 2000
  )
```

#### 规则3：维护提醒
```sql
-- 规则名称：预测性维护
SELECT 
  clientId as equipment_id,
  'MAINTENANCE_DUE' as reminder_type,
  payload.workshop as workshop,
  'Equipment requires maintenance based on running hours' as message,
  datetime(timestamp) as reminder_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'factory/+/status' 
  AND payload.running_hours > 8760  -- 运行超过8760小时(1年)
```

## 案例四：智慧城市空气质量监控

### 业务背景
城市环保部门需要实时监控各监测点的空气质量数据，当污染指数超标时自动发布预警，并为公众提供数据查询服务。

### 数据格式
```json
{
  "stationId": "AQI_001",
  "location": {
    "district": "朝阳区",
    "address": "建国门外大街1号",
    "coordinates": [116.4074, 39.9042]
  },
  "aqi": {
    "pm25": 35,
    "pm10": 68,
    "so2": 12,
    "no2": 28,
    "co": 0.8,
    "o3": 45
  },
  "weather": {
    "temperature": 25,
    "humidity": 60,
    "windSpeed": 12
  }
}
```

### 规则配置

#### 规则1：空气质量数据存储
```sql
-- 规则名称：空气质量数据记录
SELECT 
  clientId as station_id,
  payload.location.district as district,
  payload.location.address as address,
  payload.aqi.pm25 as pm25,
  payload.aqi.pm10 as pm10,
  payload.aqi.so2 as so2,
  payload.aqi.no2 as no2,
  payload.aqi.co as co,
  payload.aqi.o3 as o3,
  payload.weather.temperature as temperature,
  payload.weather.humidity as humidity,
  payload.weather.windSpeed as wind_speed,
  (payload.aqi.pm25 * 2 + payload.aqi.pm10 + payload.aqi.so2 + payload.aqi.no2 + payload.aqi.co * 10 + payload.aqi.o3) / 7 as aqi_index,
  datetime(timestamp) as record_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'aqi/station/+/data'
```

#### 规则2：空气质量预警
```sql
-- 规则名称：空气质量预警
SELECT 
  clientId as station_id,
  payload.location.district as district,
  CASE 
    WHEN payload.aqi.pm25 > 150 THEN 'SEVERE_POLLUTION'
    WHEN payload.aqi.pm25 > 100 THEN 'HEAVY_POLLUTION'
    WHEN payload.aqi.pm25 > 75 THEN 'MODERATE_POLLUTION'
    ELSE 'MILD_POLLUTION'
  END as pollution_level,
  payload.aqi.pm25 as pm25_value,
  'PM2.5 concentration exceeds safe levels' as warning_message,
  datetime(timestamp) as warning_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'aqi/station/+/data' 
  AND payload.aqi.pm25 > 75
```

**动作配置 - 公众号推送：**
```json
{
  "msgtype": "text",
  "text": {
    "content": "【空气质量预警】\n区域：${district}\n污染等级：${pollution_level}\nPM2.5浓度：${pm25_value}μg/m³\n请注意防护！\n时间：${warning_time}"
  }
}
```

#### 规则3：数据质量检查
```sql
-- 规则名称：数据有效性检查
SELECT 
  clientId as station_id,
  'DATA_ANOMALY' as issue_type,
  json(payload) as raw_data,
  datetime(timestamp) as check_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'aqi/station/+/data' 
  AND (
    payload.aqi.pm25 < 0 OR payload.aqi.pm25 > 500 OR
    payload.aqi.pm10 < 0 OR payload.aqi.pm10 > 600 OR
    payload.weather.temperature < -50 OR payload.weather.temperature > 60
  )
```

## 案例五：电商订单实时处理

### 业务背景
电商平台需要实时处理订单事件，包括订单创建、支付、发货、退款等，实现订单状态跟踪、库存更新、财务统计等功能。

### 数据格式
```json
{
  "orderId": "ORD202307290001",
  "userId": "USER001",
  "event": "order_created",
  "products": [
    {
      "productId": "PROD001",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98,
  "paymentMethod": "alipay",
  "timestamp": 1690599987495
}
```

### 规则配置

#### 规则1：订单事件记录
```sql
-- 规则名称：订单事件流水
SELECT 
  payload.orderId as order_id,
  payload.userId as user_id,
  payload.event as event_type,
  payload.totalAmount as amount,
  payload.paymentMethod as payment_method,
  json(payload.products) as products_detail,
  datetime(timestamp) as event_time
FROM "$EVENT.PUBLISH" 
WHERE topic =~ 'ecommerce/order/+/events'
```

**动作配置 - PostgreSQL存储：**
```sql
INSERT INTO order_events (
  order_id, user_id, event_type, amount, 
  payment_method, products_detail, event_time
) VALUES (
  '${order_id}', '${user_id}', '${event_type}', 
  ${amount}, '${payment_method}', '${products_detail}', 
  '${event_time}'
)
```

#### 规则2：库存扣减通知
```sql
-- 规则名称：库存更新通知
SELECT 
  'INVENTORY_UPDATE' as message_type,
  payload.orderId as order_id,
  json(payload.products) as products,
  datetime(timestamp) as update_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'ecommerce/order/+/events' 
  AND payload.event = 'order_paid'
```

**动作配置 - RabbitMQ消息队列：**
```json
{
  "messageType": "${message_type}",
  "orderId": "${order_id}",
  "products": ${products},
  "updateTime": "${update_time}"
}
```

#### 规则3：大额订单监控
```sql
-- 规则名称：大额订单预警
SELECT 
  payload.orderId as order_id,
  payload.userId as user_id,
  payload.totalAmount as amount,
  'HIGH_VALUE_ORDER' as alert_type,
  datetime(timestamp) as order_time
FROM "$EVENT.PUBLISH"
WHERE topic =~ 'ecommerce/order/+/events' 
  AND payload.event = 'order_created'
  AND payload.totalAmount > 10000
```

## 最佳实践总结

### 1. 规则设计原则
- **单一职责**：每个规则专注于处理一种特定的业务场景
- **性能优化**：合理使用索引字段，避免复杂计算
- **错误处理**：添加数据有效性检查，防止异常数据影响规则执行

### 2. 监控和维护
- **规则执行监控**：定期检查规则匹配次数和执行成功率
- **性能监控**：关注规则执行时间，及时优化慢查询
- **日志分析**：通过日志分析规则执行情况，发现潜在问题

### 3. 扩展性考虑
- **规则模块化**：将复杂业务拆分为多个简单规则
- **数据源选择**：根据数据量和查询需求选择合适的存储引擎
- **水平扩展**：设计支持集群部署的规则架构

通过这些实战案例，您可以了解 FluxMQ 规则引擎在不同行业和场景中的应用方法，为您的项目提供参考和启发。