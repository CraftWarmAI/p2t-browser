**Getting Started**

运行以下命令安装依赖项并开始开发

```
yarn install
yarn dev
```

构建 Safari 浏览器扩展

-   App store 中下载 xcode

**Scripts**

-   `yarn dev` - 运行开发模式（chomre 测试环境）
-   `yarn prod` - 运行开发模式（chrome 线上环境）
-   `yarn dev:firefox` - 运行开发模式（firefox 测试环境）
-   `yarn prod:firefox` - 运行开发模式（firefox 线上环境）
-   `yarn build` - 一键构建 chrome、firefox 标准的生产环境的压缩扩展
-   `yarn build:dev` - 构建标准的生产环境的压缩扩展（chomre 测试环境）
-   `yarn build:prod` - 构建标准的生产环境的压缩扩展（chomre 线上环境）
-   `yarn build:firefox_dev` - 构建标准的生产环境的压缩扩展（firefox 测试环境）
-   `yarn build:firefox_prod` - 构建标准的生产环境的压缩扩展（firefox 线上环境）
-   `yarn create:safari_dev` - 转换为 Safari 的代码，自动打开 Xcode（测试环境）
-   `yarn create:safari_prod` - 转换为 Safari 的代码，自动打开 Xcode（生产环境）
-   `yarn test -u` - 运行 Jest 更新测试快照
-   `yarn lint` - 运行 EsLint
-   `yarn prettify` - 允许 Prettier
-   `yarn storybook` - 运行 Storybook 服务器

打包 Safari 扩展 & 发布到 App Store

-   Product - Archive
-   Window - Organizer - Distribute App
