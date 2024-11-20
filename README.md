# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm install
```

### 本地开发环境

将docusaurus.config.js文件中的 includeCurrentVersion: false 注释掉，修改docs下面的内容，浏览器中查看next版本下面的内容。如先执行npm run start，再修改则会报错，重启即可。
```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.




### 添加新的页面

在对应目录下面增加mardown文档，然后在sidebars.js下面进行修改添加。

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.build操作可以识别出一些npm run start 不会显现的问题，鉴于github actions速度较慢，建议推送前进行该操作验证。

### 发布新版本
```
$ npm run docusaurus docs:version 1.1.0
```
注意记得将docusaurus.config.js文件中的 includeCurrentVersion: false 注释删除。

### Deployment

将main分支推送到github即可触发actions进行编译部署。

### 注意事项

1. 文档中如有 `{xxx}` 这样的情况，会被框架认为需要从其他地方提取变量而报错，需写为 `\{xxx\}`
2. 照片路径根路径为 @site/static/ 