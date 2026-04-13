# 演示视频（WebM）

本目录由仓库内脚本录制，也可将同名文件上传到 OBS/CDN 后把文档中的地址改为公网 URL。

## 生成

```bash
cd fluxmq-doc
npm install playwright --no-save
npx playwright install chromium
node scripts/record-demo-videos.mjs
```

默认使用 `http://demo.fluxmq.com` 与账号 `fluxmq` / `fluxmq`，可通过环境变量 `FLUXMQ_DEMO_URL`、`FLUXMQ_DEMO_USER`、`FLUXMQ_DEMO_PASS` 覆盖。

## 文件说明

| 文件 | 内容概要 |
|------|----------|
| `overview.webm` | 控制台总览 / 仪表盘 |
| `rule-engine-datasource.webm` | 规则引擎 — 数据源 |
| `instruct.webm` | 指令消费列表 |

构建后访问路径为：`/video/<文件名>`（见 [产品演示视频](/product/demos)）。
