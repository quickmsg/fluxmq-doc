# 配置持久化
> 持久化的数据包含如下：

- fluxmq集群中运行的数据：保留、延迟、会话消息、ACK未确认消息。
- fluxmq集群所有的web配置持久化。

## 配置


### LOCAL
> 本地存储，会持久化数据，重启后数据不会丢失
```yaml
store:
  storeType: LOCAL # MYSQL,LOCAL,MEMORY,POSTGRESQL
```

### MEMORY
> 内存模式，不会持久化数据，重启后数据会丢失

```yaml
store:
  storeType: MEMORY # MYSQL,LOCAL,MEMORY,POSTGRESQL
```


### MYSQL
> MYSQL模式，会持久化数据，重启后数据不会丢失

**第一步：创建数据库并初始化表结构**

使用以下SQL语句初始化FluxMQ持久化所需要的表结构（支持 MySQL 5.7+ 和 MySQL 8.0+）：

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS fluxmq DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fluxmq;

-- 删除已存在的表
DROP TABLE IF EXISTS `ProtocolExtensionInfo`;
DROP TABLE IF EXISTS `SessionMessage`;
DROP TABLE IF EXISTS `DelayMessage`;
DROP TABLE IF EXISTS `RetainMessage`;
DROP TABLE IF EXISTS `CommandData`;
DROP TABLE IF EXISTS `SourceDefinition`;
DROP TABLE IF EXISTS `ScriptInfo`;
DROP TABLE IF EXISTS `RuleDefinition`;
DROP TABLE IF EXISTS `EndpointConfig`;
DROP TABLE IF EXISTS `PolicyModel`;
DROP TABLE IF EXISTS `AlarmLog`;
DROP TABLE IF EXISTS `AlarmTemplate`;
DROP TABLE IF EXISTS `AuthConfig`;
DROP TABLE IF EXISTS `LogTrace`;
DROP TABLE IF EXISTS `ProxySubConfig`;
DROP TABLE IF EXISTS `DashBoardConfig`;

-- 创建表结构
CREATE TABLE `DashBoardConfig` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_desc` VARCHAR(500) DEFAULT NULL COMMENT 'Description',
    `f_grafana_url` VARCHAR(500) DEFAULT NULL COMMENT 'Grafana URL',
    `f_type` VARCHAR(50) DEFAULT NULL COMMENT 'Dashboard type'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Dashboard Configuration';

CREATE TABLE `ProxySubConfig` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_name` VARCHAR(255) NOT NULL COMMENT 'Configuration name',
    `f_sub_type` VARCHAR(50) DEFAULT NULL COMMENT 'Subscription type',
    `f_sub_infos` TEXT COMMENT 'Subscription information (JSON)',
    `f_sql` TEXT COMMENT 'SQL query',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status',
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Proxy Subscription Configuration';

CREATE TABLE `LogTrace` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_name` VARCHAR(255) NOT NULL COMMENT 'Trace name',
    `f_log_type` VARCHAR(50) DEFAULT NULL COMMENT 'Log type',
    `f_filter` TEXT COMMENT 'Filter expression',
    `f_start_time` VARCHAR(50) DEFAULT NULL COMMENT 'Start time',
    `f_end_time` VARCHAR(50) DEFAULT NULL COMMENT 'End time',
    `f_timezone` INT DEFAULT 0 COMMENT 'Timezone offset',
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Log Trace Configuration';

CREATE TABLE `AuthConfig` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_fixed` TEXT COMMENT 'Fixed authentication config (JSON)',
    `f_http` TEXT COMMENT 'HTTP authentication config (JSON)',
    `f_sql` TEXT COMMENT 'SQL authentication config (JSON)',
    `f_redis` TEXT COMMENT 'Redis authentication config (JSON)',
    `f_encrypt` VARCHAR(50) DEFAULT NULL COMMENT 'Encryption method',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status',
    `f_filter` TEXT COMMENT 'Filter expression',
    `f_name` VARCHAR(255) NOT NULL COMMENT 'Configuration name',
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Authentication Configuration';

CREATE TABLE `AlarmTemplate` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_time` VARCHAR(50) DEFAULT NULL COMMENT 'Time',
    `f_name` VARCHAR(255) NOT NULL COMMENT 'Template name',
    `f_desc` VARCHAR(500) DEFAULT NULL COMMENT 'Description',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status',
    `f_alert_template` VARCHAR(50) DEFAULT NULL COMMENT 'Alert template type',
    `f_recipients` TEXT COMMENT 'Recipients (JSON)',
    `f_message_way` VARCHAR(50) DEFAULT NULL COMMENT 'Message delivery method',
    `f_hook` TEXT COMMENT 'Webhook URL',
    `f_alarm_type` VARCHAR(50) DEFAULT NULL COMMENT 'Alarm type'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Alarm Template Configuration';

CREATE TABLE `AlarmLog` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_time` VARCHAR(50) DEFAULT NULL COMMENT 'Time',
    `f_alarm_type` VARCHAR(50) DEFAULT NULL COMMENT 'Alarm type',
    `f_content` TEXT COMMENT 'Alarm content',
    `f_is_send` TINYINT(1) DEFAULT 0 COMMENT 'Send status',
    INDEX `idx_time` (`f_time`),
    INDEX `idx_alarm_type` (`f_alarm_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Alarm Log';

CREATE TABLE `PolicyModel` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_acl_model` TEXT COMMENT 'ACL model configuration (JSON)',
    `f_dsl_models` TEXT COMMENT 'DSL models (JSON)',
    `f_sql_model` TEXT COMMENT 'SQL model configuration (JSON)',
    `f_http_model` TEXT COMMENT 'HTTP model configuration (JSON)',
    `f_time` VARCHAR(50) DEFAULT NULL COMMENT 'Time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ACL Policy Model';

CREATE TABLE `EndpointConfig` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_port` INT NOT NULL COMMENT 'Port number',
    `f_metrics` TINYINT(1) DEFAULT 0 COMMENT 'Enable metrics',
    `f_wiretap` TINYINT(1) DEFAULT 0 COMMENT 'Enable wiretap',
    `f_proxy` TINYINT(1) DEFAULT 0 COMMENT 'Enable proxy',
    `f_enable_auth` TINYINT(1) DEFAULT 0 COMMENT 'Enable authentication',
    `f_enable_acl` TINYINT(1) DEFAULT 0 COMMENT 'Enable ACL',
    `f_enable_bridge` TINYINT(1) DEFAULT 0 COMMENT 'Enable bridge',
    `f_message_max_size` INT DEFAULT NULL COMMENT 'Max message size',
    `f_max_session_size` INT DEFAULT 0 COMMENT 'Max session size',
    `f_use_websocket` TINYINT(1) DEFAULT 0 COMMENT 'Use WebSocket',
    `f_max_connection_size` INT DEFAULT 0 COMMENT 'Max connection size',
    `f_exclusive_pool` TINYINT(1) DEFAULT 0 COMMENT 'Exclusive thread pool',
    `f_path` VARCHAR(255) DEFAULT NULL COMMENT 'WebSocket path',
    `f_max_send_window_size` INT DEFAULT 0 COMMENT 'Max send window size',
    `f_max_receive_window_size` INT DEFAULT 0 COMMENT 'Max receive window size',
    `f_acl_refresh_period` INT DEFAULT 0 COMMENT 'ACL refresh period',
    `f_session_persistence` TINYINT(1) DEFAULT 0 COMMENT 'Session persistence',
    `f_max_connection_per_second` INT DEFAULT 0 COMMENT 'Max connections per second',
    `f_ssl_config` TEXT COMMENT 'SSL configuration (JSON)',
    `f_server_options` TEXT COMMENT 'Server options (JSON)',
    `f_child_options` TEXT COMMENT 'Child options (JSON)',
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_update_time` VARCHAR(50) DEFAULT NULL COMMENT 'Update time',
    `f_enabled` TINYINT(1) DEFAULT 1 COMMENT 'Enabled status',
    `f_is_default` TINYINT(1) DEFAULT 0 COMMENT 'Is default endpoint',
    INDEX `idx_port` (`f_port`),
    INDEX `idx_enabled` (`f_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='MQTT Endpoint Configuration';

CREATE TABLE `RuleDefinition` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_rule_name` VARCHAR(255) NOT NULL COMMENT 'Rule name',
    `f_description` VARCHAR(500) DEFAULT NULL COMMENT 'Description',
    `f_rule_data_type` VARCHAR(50) DEFAULT NULL COMMENT 'Rule data type',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status',
    `f_async` TINYINT(1) DEFAULT 0 COMMENT 'Async execution',
    `f_sql` TEXT COMMENT 'SQL query',
    `f_rule_actions` TEXT COMMENT 'Rule actions (JSON)',
    `f_cep_rule_bean` TEXT COMMENT 'CEP rule bean (JSON)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Rule Engine Definition';

CREATE TABLE `ScriptInfo` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_match_topic` VARCHAR(500) DEFAULT NULL COMMENT 'Match topic pattern',
    `f_script` TEXT COMMENT 'Script content',
    `f_script_type` VARCHAR(50) DEFAULT NULL COMMENT 'Script type',
    `f_description` VARCHAR(500) DEFAULT NULL COMMENT 'Description',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Script Configuration';

CREATE TABLE `SourceDefinition` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_source` VARCHAR(50) DEFAULT NULL COMMENT 'Source type',
    `f_source_name` VARCHAR(255) NOT NULL COMMENT 'Source name',
    `f_source_attributes` TEXT COMMENT 'Source attributes (JSON)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Data Source Definition';

CREATE TABLE `CommandData` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_command` VARCHAR(50) NOT NULL COMMENT 'Command type',
    `f_command_name` VARCHAR(255) NOT NULL COMMENT 'Command name',
    `f_properties` TEXT COMMENT 'Properties (JSON)',
    `f_mapping` TEXT COMMENT 'Mapping configuration (JSON)',
    `f_status` TINYINT(1) DEFAULT 0 COMMENT 'Status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Command Configuration';

CREATE TABLE `RetainMessage` (
    `id` VARCHAR(500) NOT NULL PRIMARY KEY COMMENT 'Topic name',
    `f_qos` INT DEFAULT 0 COMMENT 'QoS level',
    `f_retain` TINYINT(1) DEFAULT 0 COMMENT 'Retain flag',
    `f_time` VARCHAR(50) DEFAULT NULL COMMENT 'Time',
    `f_body` LONGBLOB COMMENT 'Message body',
    INDEX `idx_time` (`f_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='MQTT Retain Messages';

CREATE TABLE `DelayMessage` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_topic` VARCHAR(500) NOT NULL COMMENT 'Topic name',
    `f_client_id` VARCHAR(255) DEFAULT NULL COMMENT 'Client ID',
    `f_qos` INT DEFAULT 0 COMMENT 'QoS level',
    `f_retain` TINYINT(1) DEFAULT 0 COMMENT 'Retain flag',
    `f_execute_node` VARCHAR(255) DEFAULT NULL COMMENT 'Execute node',
    `f_body` LONGBLOB COMMENT 'Message body',
    `f_delay_duration` BIGINT DEFAULT 0 COMMENT 'Delay duration (ms)',
    `f_submit_timestamp` BIGINT DEFAULT 0 COMMENT 'Submit timestamp',
    INDEX `idx_topic` (`f_topic`(255)),
    INDEX `idx_client_id` (`f_client_id`),
    INDEX `idx_submit_timestamp` (`f_submit_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Delayed Messages';

CREATE TABLE `SessionMessage` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_topic` VARCHAR(500) NOT NULL COMMENT 'Topic name',
    `f_qos` INT DEFAULT 0 COMMENT 'QoS level',
    `f_retain` TINYINT(1) DEFAULT 0 COMMENT 'Retain flag',
    `f_client_id` VARCHAR(255) NOT NULL COMMENT 'Client ID',
    `f_time` VARCHAR(50) DEFAULT NULL COMMENT 'Time',
    `f_body` LONGBLOB COMMENT 'Message body',
    INDEX `idx_client_id` (`f_client_id`),
    INDEX `idx_time` (`f_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Session Messages';

CREATE TABLE `ProtocolExtensionInfo` (
    `id` VARCHAR(64) NOT NULL PRIMARY KEY,
    `f_protocol_type` VARCHAR(50) NOT NULL COMMENT 'Protocol type',
    `f_host` VARCHAR(255) DEFAULT NULL COMMENT 'Host address',
    `f_port` INT DEFAULT 0 COMMENT 'Port number',
    `f_enable` TINYINT(1) DEFAULT 0 COMMENT 'Enable status',
    `f_create_time` VARCHAR(50) DEFAULT NULL COMMENT 'Create time',
    `f_properties` TEXT COMMENT 'Properties (JSON)',
    UNIQUE KEY `uk_protocol_type` (`f_protocol_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Protocol Extension Configuration';
```

**第二步：配置 FluxMQ 连接数据库**

```yaml
store:
  storeType: MYSQL
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false
    username: root
    password: 123456
```
<div class="table-2">

| 参数名        | 描述         | 默认值                                              |
|------------|------------|--------------------------------------------------|
| storeType  | 存儲类型       | 默认LOCAL                                          |
| datasource | 选择MYSQL存储时 | 选填                                               |
| url        | 地址         | jdbc:mysql://127.0.0.1:3306/fluxmq?useSSL=false |
| username   | 用户名        | root                                             |
| password   | 密码         | 123456                                           |

</div>

### POSTGRESQL
> POSTGRESQL模式，会持久化数据，重启后数据不会丢失

**第一步：创建数据库并初始化表结构**

使用以下SQL语句初始化FluxMQ持久化所需要的表结构：

```sql
-- 创建数据库（如果已存在可跳过）
-- CREATE DATABASE fluxmq WITH ENCODING 'UTF8';
-- \c fluxmq;

-- 删除已存在的表
DROP TABLE IF EXISTS "ProtocolExtensionInfo" CASCADE;
DROP TABLE IF EXISTS "SessionMessage" CASCADE;
DROP TABLE IF EXISTS "DelayMessage" CASCADE;
DROP TABLE IF EXISTS "RetainMessage" CASCADE;
DROP TABLE IF EXISTS "CommandData" CASCADE;
DROP TABLE IF EXISTS "SourceDefinition" CASCADE;
DROP TABLE IF EXISTS "ScriptInfo" CASCADE;
DROP TABLE IF EXISTS "RuleDefinition" CASCADE;
DROP TABLE IF EXISTS "EndpointConfig" CASCADE;
DROP TABLE IF EXISTS "PolicyModel" CASCADE;
DROP TABLE IF EXISTS "AlarmLog" CASCADE;
DROP TABLE IF EXISTS "AlarmTemplate" CASCADE;
DROP TABLE IF EXISTS "AuthConfig" CASCADE;
DROP TABLE IF EXISTS "LogTrace" CASCADE;
DROP TABLE IF EXISTS "ProxySubConfig" CASCADE;
DROP TABLE IF EXISTS "DashBoardConfig" CASCADE;

-- 创建表结构
CREATE TABLE "DashBoardConfig" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_desc" VARCHAR(500) DEFAULT NULL,
    "f_grafana_url" VARCHAR(500) DEFAULT NULL,
    "f_type" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "ProxySubConfig" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_name" VARCHAR(255) NOT NULL,
    "f_sub_type" VARCHAR(50) DEFAULT NULL,
    "f_sub_infos" TEXT DEFAULT NULL,
    "f_sql" TEXT DEFAULT NULL,
    "f_enable" BOOLEAN DEFAULT FALSE,
    "f_create_time" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "LogTrace" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_name" VARCHAR(255) NOT NULL,
    "f_log_type" VARCHAR(50) DEFAULT NULL,
    "f_filter" TEXT DEFAULT NULL,
    "f_start_time" VARCHAR(50) DEFAULT NULL,
    "f_end_time" VARCHAR(50) DEFAULT NULL,
    "f_timezone" INTEGER DEFAULT 0,
    "f_create_time" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "AuthConfig" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_fixed" TEXT DEFAULT NULL,
    "f_http" TEXT DEFAULT NULL,
    "f_sql" TEXT DEFAULT NULL,
    "f_redis" TEXT DEFAULT NULL,
    "f_encrypt" VARCHAR(50) DEFAULT NULL,
    "f_enable" BOOLEAN DEFAULT FALSE,
    "f_filter" TEXT DEFAULT NULL,
    "f_name" VARCHAR(255) NOT NULL,
    "f_create_time" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "AlarmTemplate" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_time" VARCHAR(50) DEFAULT NULL,
    "f_name" VARCHAR(255) NOT NULL,
    "f_desc" VARCHAR(500) DEFAULT NULL,
    "f_enable" BOOLEAN DEFAULT FALSE,
    "f_alert_template" VARCHAR(50) DEFAULT NULL,
    "f_recipients" TEXT DEFAULT NULL,
    "f_message_way" VARCHAR(50) DEFAULT NULL,
    "f_hook" TEXT DEFAULT NULL,
    "f_alarm_type" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "AlarmLog" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_time" VARCHAR(50) DEFAULT NULL,
    "f_alarm_type" VARCHAR(50) DEFAULT NULL,
    "f_content" TEXT DEFAULT NULL,
    "f_is_send" BOOLEAN DEFAULT FALSE
);
CREATE INDEX "idx_alarmlog_time" ON "AlarmLog"("f_time");
CREATE INDEX "idx_alarmlog_type" ON "AlarmLog"("f_alarm_type");

CREATE TABLE "PolicyModel" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_acl_model" TEXT DEFAULT NULL,
    "f_dsl_models" TEXT DEFAULT NULL,
    "f_sql_model" TEXT DEFAULT NULL,
    "f_http_model" TEXT DEFAULT NULL,
    "f_time" VARCHAR(50) DEFAULT NULL
);

CREATE TABLE "EndpointConfig" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_port" INTEGER NOT NULL,
    "f_metrics" BOOLEAN DEFAULT FALSE,
    "f_wiretap" BOOLEAN DEFAULT FALSE,
    "f_proxy" BOOLEAN DEFAULT FALSE,
    "f_enable_auth" BOOLEAN DEFAULT FALSE,
    "f_enable_acl" BOOLEAN DEFAULT FALSE,
    "f_enable_bridge" BOOLEAN DEFAULT FALSE,
    "f_message_max_size" INTEGER DEFAULT NULL,
    "f_max_session_size" INTEGER DEFAULT 0,
    "f_use_websocket" BOOLEAN DEFAULT FALSE,
    "f_max_connection_size" INTEGER DEFAULT 0,
    "f_exclusive_pool" BOOLEAN DEFAULT FALSE,
    "f_path" VARCHAR(255) DEFAULT NULL,
    "f_max_send_window_size" INTEGER DEFAULT 0,
    "f_max_receive_window_size" INTEGER DEFAULT 0,
    "f_acl_refresh_period" INTEGER DEFAULT 0,
    "f_session_persistence" BOOLEAN DEFAULT FALSE,
    "f_max_connection_per_second" INTEGER DEFAULT 0,
    "f_ssl_config" TEXT DEFAULT NULL,
    "f_server_options" TEXT DEFAULT NULL,
    "f_child_options" TEXT DEFAULT NULL,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_update_time" VARCHAR(50) DEFAULT NULL,
    "f_enabled" BOOLEAN DEFAULT TRUE,
    "f_is_default" BOOLEAN DEFAULT FALSE
);
CREATE INDEX "idx_endpoint_port" ON "EndpointConfig"("f_port");
CREATE INDEX "idx_endpoint_enabled" ON "EndpointConfig"("f_enabled");

CREATE TABLE "RuleDefinition" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_rule_name" VARCHAR(255) NOT NULL,
    "f_description" VARCHAR(500) DEFAULT NULL,
    "f_rule_data_type" VARCHAR(50) DEFAULT NULL,
    "f_enable" BOOLEAN DEFAULT FALSE,
    "f_async" BOOLEAN DEFAULT FALSE,
    "f_sql" TEXT DEFAULT NULL,
    "f_rule_actions" TEXT DEFAULT NULL,
    "f_cep_rule_bean" TEXT DEFAULT NULL
);

CREATE TABLE "ScriptInfo" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_match_topic" VARCHAR(500) DEFAULT NULL,
    "f_script" TEXT DEFAULT NULL,
    "f_script_type" VARCHAR(50) DEFAULT NULL,
    "f_description" VARCHAR(500) DEFAULT NULL,
    "f_enable" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "SourceDefinition" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_source" VARCHAR(50) DEFAULT NULL,
    "f_source_name" VARCHAR(255) NOT NULL,
    "f_source_attributes" TEXT DEFAULT NULL
);

CREATE TABLE "CommandData" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_command" VARCHAR(50) NOT NULL,
    "f_command_name" VARCHAR(255) NOT NULL,
    "f_properties" TEXT DEFAULT NULL,
    "f_mapping" TEXT DEFAULT NULL,
    "f_status" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "RetainMessage" (
    "id" VARCHAR(500) NOT NULL PRIMARY KEY,
    "f_qos" INTEGER DEFAULT 0,
    "f_retain" BOOLEAN DEFAULT FALSE,
    "f_time" VARCHAR(50) DEFAULT NULL,
    "f_body" BYTEA DEFAULT NULL
);
CREATE INDEX "idx_retainmsg_time" ON "RetainMessage"("f_time");

CREATE TABLE "DelayMessage" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_topic" VARCHAR(500) NOT NULL,
    "f_client_id" VARCHAR(255) DEFAULT NULL,
    "f_qos" INTEGER DEFAULT 0,
    "f_retain" BOOLEAN DEFAULT FALSE,
    "f_execute_node" VARCHAR(255) DEFAULT NULL,
    "f_body" BYTEA DEFAULT NULL,
    "f_delay_duration" BIGINT DEFAULT 0,
    "f_submit_timestamp" BIGINT DEFAULT 0
);
CREATE INDEX "idx_delaymsg_topic" ON "DelayMessage"("f_topic");
CREATE INDEX "idx_delaymsg_client" ON "DelayMessage"("f_client_id");
CREATE INDEX "idx_delaymsg_timestamp" ON "DelayMessage"("f_submit_timestamp");

CREATE TABLE "SessionMessage" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_topic" VARCHAR(500) NOT NULL,
    "f_qos" INTEGER DEFAULT 0,
    "f_retain" BOOLEAN DEFAULT FALSE,
    "f_client_id" VARCHAR(255) NOT NULL,
    "f_time" VARCHAR(50) DEFAULT NULL,
    "f_body" BYTEA DEFAULT NULL
);
CREATE INDEX "idx_sessionmsg_client" ON "SessionMessage"("f_client_id");
CREATE INDEX "idx_sessionmsg_time" ON "SessionMessage"("f_time");

CREATE TABLE "ProtocolExtensionInfo" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "f_protocol_type" VARCHAR(50) NOT NULL,
    "f_host" VARCHAR(255) DEFAULT NULL,
    "f_port" INTEGER DEFAULT 0,
    "f_enable" BOOLEAN DEFAULT FALSE,
    "f_create_time" VARCHAR(50) DEFAULT NULL,
    "f_properties" TEXT DEFAULT NULL,
    CONSTRAINT "uk_protocol_type" UNIQUE ("f_protocol_type")
);
```

**第二步：配置 FluxMQ 连接数据库**

```yaml
store:
  storeType: POSTGRESQL # MYSQL,LOCAL,MEMORY,POSTGRESQL
  datasource:
    url: jdbc:postgresql://127.0.0.1:5432/fluxmq
    username: postgres
    password: fluxmq
    schema: fluxmq
```

> **注意**：模式（schema）不指定时候，默认为 `public` 模式。

<div class="table-2">

| 参数名        | 描述         | 默认值                                             |
|------------|------------|-------------------------------------------------|
| storeType  | 存儲类型       | 默认LOCAL                                         |
| datasource | 选择MYSQL存储时 | 选填                                              |
| url        | 地址         | jdbc:postgresql://127.0.0.1:5432/fluxmq |
| username   | 用户名        | root                                            |
| password   | 密码         | 123456                                          |
| schema     | 模式         | public                                          |

</div>