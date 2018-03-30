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
git clone git@github.com:pmg1989/react_teacher_2.0.git
```

cd react_teacher_2.0 进入目录安装依赖:

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

代码检测：

```bash
git项目提交时，会自动run precommit 进而执行 npm run lint，执行esLint代码检测
```
