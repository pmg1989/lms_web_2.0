# LMS_WEB_2.0

[![React Native](https://img.shields.io/badge/react-^15.4.1-brightgreen.svg?style=flat-square)](https://github.com/facebook/react)
[![Ant Design](https://img.shields.io/badge/ant--design-^2.8.2-yellowgreen.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![dva](https://img.shields.io/badge/dva-^1.1.0-orange.svg?style=flat-square)](https://github.com/dvajs/dva)

## 特性

- 基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)，[Mock](https://github.com/nuysoft/Mock) 企业级后台管理系统最佳实践
- 基于Antd UI 设计语言，提供后台管理系统常见使用场景
- 浅度响应式设计
- webpack打包处理路由时，实现Javascript模块化按需动态dynamic加载
- 已实现基本完善的权限管理功能
- 完善的后端分页与前端分页功能
- 封装好可扩展的上传控件与音视频控件
- 用[roadhog](https://github.com/sorrycc/roadhog)本地调试和构建，其中Mock功能实现脱离后端独立开发。

## 开发及构建

### 目录结构

```bash
├── /dist/           # 项目输出目录
├── /src/            # 项目源码目录
│ ├── /public/       # 公共文件，编译时copy至dist目录
│ ├── /components/   # UI组件及UI相关方法
│ │ ├── index.js     # 全局 export default 入口
│ ├── /constants/    # constant 常量配置
│ │ ├── options.js   # 权限常量配置入口
│ ├── /routes/       # dva容器组件
│ │ └── App/index.js          # 容器入口
│ │ └── account/Role/index.js # 权限管理页面入口
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ ├── /mock/         # 数据mock
│ ├── /utils/        # 工具函数
│ │ ├── menu.js      # 菜单及权限配置
│ │ ├── config.js    # 项目常规配置
│ │ ├── request.js   # 异步请求函数
│ │ └── theme.js     # 项目需要在js中使用到样式变量
│ ├── router.js       # 路由配置
│ ├── index.js       # 入口文件
│ └── entry.dev.ejs  # 开发环境下html入口文件  
│ └── entry.ejs      # 发布环境下html入口文件     
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .roadhogrc.js    # roadhog配置
└── webpack.config.js# webpack相关配置
```

### 快速开始

克隆项目文件:

```
git clone git@git.coding.net:newband-dev/lms_web_2.0.git
```

cd lms_web_2.0 进入目录安装依赖:

```
npm install 或者 yarn 或者 yarn install
```

开发：

```bash
git checkout develop
npm run build:dll #第一次npm run dev时需运行此命令，使开发时编译更快
npm run dev

打开 http://localhost:8000
```


staging环境构建发布：

```bash
本地环境
git checkout build-staging
git merge develop
yarn run build-staging
git acm 'fix some bugs' or (git add . && git commit -m 'fix some bugs')
git push
git checkout develop 切换回开发模式继续后续的开发

登录staging服务器
cd /var/www/html/lms_mobile
git checkout build-staging
git pull
```

release环境构建发布：
```bash
本地环境
git checkout build-release
git merge develop
yarn run build-release
git acm 'fix some bugs' or (git add . && git commit -m 'fix some bugs')
git push
git checkout develop 切换回开发模式继续后续的开发

登录production服务器
cd /var/www/html/lms_web_2.0
git checkout build-release
git pull
```

release环境本地开启调试：
```bash
git checkout develop
npm run start

打开 http://localhost:8000
```

代码检测：

```bash
git项目提交时，会自动run precommit 进而执行 npm run lint，执行esLint代码检测
```

### 注意事项

- buid-staing、build-release两个分支目前只作为发布分支在本地发布时使用，切莫在此分之下直接开发，而应该切换至develop分支下进行开发
- 切莫将buid-staing与build-release两个分支合并至master 或 develop 分支上，合并会导致主分支添加不必要的发布信息log
- 在开发任务完成后，发布时才切换至buid-staing、build-release相应分支进行发布部署
- 本地发布完成并push后，登录相关环境服务器，cd至目标地址，直接 git pull 即可完成发布部署
- buid-staing、build-release两个分支作为本地发布分支，是一种本地发布服务器拉取发布的一种流程，后期也可以升级服务器的nodeJS环境，直接将发布流程移动至服务器发布部署
