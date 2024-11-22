// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '前言',
      link: {
        type: 'generated-index',
      },
      items: [
        'product/introduction',
        'product/core'
      ],
    },
    {
      type: 'category',
      label: '安装部署',
      link: {
        type: 'generated-index',
      },
      items: [
        'install/optimize',
        'install/Linux',
        'install/Windows',
        'install/MacOS',
        'install/Linux-aarch64',
        'install/MacOS-aarch64',
        'install/docker',
        'install/docker-compose',
        'install/kubernetes'
      ],
    },
    {
      type: 'category',
      label: '配置指南',
      link: {
        type: 'generated-index',
      },
      items: [
        'config/read',
        'config/mqtt',
        'config/pool',
        'config/cluster',
        'config/http',
        'config/eventbus',
        'config/store',
        'config/shareSubscribe',
        'config/retry',
        'config/application',
        'config/license',
      ]
    },
    {
      type: 'category',
      label: '功能',
      link: {
        type: 'generated-index',
      },
      items: [
        'function/dashboard',
        'function/ps',
        'function/share',
        'function/session',
        'function/delay',
        {
          type: 'category',
          label: '认证鉴权',
          link: {
            type: 'generated-index',
          },
          items: [
            'auth/before',
            'auth/db',
            'auth/redis',
            'auth/rest',
            'auth/fixed',
          ]
        },
        {
          type: 'category',
          label: 'acl功能',
          link: {
            type: 'generated-index',
          },
          items: [
            'acl/before',
            'acl/sql',
            'acl/config',
            'acl/http',
          ]
        },
        'function/link',
        'function/topic',
        {
          type: 'category',
          label: '指令消费',
          link: {
            type: 'generated-index',
          },
          items: [
            'command/KAFKA',
            'command/ROCKETMQ',
            'command/RABBITMQ',
            'command/PULSAR',
            'command/NACOS',
          ]
        },
        'function/proxysub',
        'function/script',
      ]
    },
    {
      type: 'category',
      label: '规则引擎',
      link: {
        type: 'generated-index',
      },
      items: [
        {
          type: 'category',
          label: '事件类型',
          link: {
            type: 'generated-index',
          },
          items: [
            'gzyq/event/read',
            'gzyq/event/connect',
            'gzyq/event/close',
            'gzyq/event/sub',
            'gzyq/event/unsub',
            'gzyq/event/publish',
            'gzyq/event/ack',
            'gzyq/event/ping',
            'gzyq/event/offline',
            'gzyq/event/drop',
            'gzyq/event/delivered',
          ]
        },
        {
          type: 'category',
          label: '规则配置',
          link: {
            type: 'generated-index',
          },
          items: [
            'gzyq/rule/INTRODUCE',
            'gzyq/rule/STARTED',
            'gzyq/rule/GRAMMAR',
            'gzyq/rule/FUNCTION',
          ]
        },
        {
          type: 'category',
          label: '动作类型',
          link: {
            type: 'generated-index',
          },
          items: [
            'gzyq/action/SAVE_KAFKA',
            'gzyq/action/SAVE_MYSQL',
            'gzyq/action/SAVE_REDIS',
            {
              type: 'category',
              label: '离线消息存储',
              link: {
                type: 'generated-index',
              },
              items: [
                'gzyq/action/OFFLINE',
                'gzyq/action/OFFLINE_REDIS',
                'gzyq/action/OFFLINE_MYSQL',
              ]
            },
          ]
        },
        {
          type: 'category',
          label: '数据源配置',
          link: {
            type: 'generated-index',
          },
          items: [
            'gzyq/source/BEFORE',
            'gzyq/source/MYSQL',
            'gzyq/source/ORACLE',
            'gzyq/source/POSTGRESQL',
            'gzyq/source/SQLSERVER',
            'gzyq/source/TDENGINE',
            'gzyq/source/CLICKHOUSE',
            'gzyq/source/WEBHOOK',
            'gzyq/source/KAFKA',
            'gzyq/source/LOG',
            'gzyq/source/MQTT',
            'gzyq/source/RABBITMQ',
            'gzyq/source/REDIS',
            'gzyq/source/ROCKETMQ',
          ]
        },
      ]
    },
    {
      type: 'category',
      label: '多协议',
      link: {
        type: 'generated-index',
      },
      items: [
        'protocol/coap',
        'protocol/32960',
        'protocol/v2c',
        'protocol/ocpp',
        'protocol/websocket',
        'protocol/i1',
      ]
    },
    {
      type: 'category',
      label: '工具',
      link: {
        type: 'generated-index',
      },
      items: [
        'tools/ssl',
        'tools/haproxy',
      ]
    },
    {
      type: 'category',
      label: 'API',
      link: {
        type: 'generated-index',
      },
      items: [
        'api/Publish',
        'api/Check',
        'api/kick',
      ]
    },
    {
      type: 'category',
      label: '性能压测',
      link: {
        type: 'generated-index',
      },
      items: [
        'test/Conn',
        'test/Broad',
        'test/Bridge',
        'test/ConnConcurrent',
        'test/MoreTopic',
        'test/SingleTopic',
        'test/ShareTopic',
        'test/Wildcard',
      ]
    },
    {
      type: 'category',
      label: '可观测',
      link: {
        type: 'generated-index',
      },
      items: [
        'view/api',
        'view/metrics',
      ]
    },
    'vs',
    'mqtt',
    'FAQ',
    'License',
  ],
};

export default sidebars;
