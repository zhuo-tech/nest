# Laf快速开发平台
基于laf开发的`快速开发平台`创作平台

# 技术选型
## [lafyun](https://www.lafyun.com)
`Life is short, you need laf :) 像写博客一样写函数，随手上线`
`Vue 2`

# 模块说明
    nest
    ├── env -- 环境配置
    ├── public   -- 资源目录
    ├── src -- 源代码
    ├    ├── components -- 组建
    ├    ├── config  -- 静态资源
    ├    ├── const -- 常量
    ├    ├── filters -- 过滤器
    ├    ├── lang -- 多语言
    ├    ├── mixins -- 通用 CRUD 管理页面
    ├    ├── pages -- 页面布局&数据逻辑处理
	├    ├──   └── index --布局
	├    ├──   └── lock -- 锁屏
    ├    ├──   └── login -- 登录	
    ├    ├──   └── logs -- 日志
    ├    ├── router -- 路由
    ├    ├── service -- 业务处理
    ├    ├── store -- store
    ├    ├── styles -- 样式
    ├    ├── util -- 工具包
    ├    ├── views -- 工具包
	├    ├──   └── admin --权限&组织机构&系统管理页面
	├    ├──     └── dept -- 组织管理
	├    ├──     └── dict -- 字典管理
	├    ├──     └── file -- 文件管理
	├    ├──     └── log -- 日志管理
	├    ├──     └── menu -- 资源权限
	├    ├──     └── param -- 系统参数
	├    ├──     └── post -- 岗位管理
	├    ├──     └── role -- 角色管理
	├    ├──     └── social -- 社交管理
	├    ├──     └── user -- 账号管理
    ├    ├── App.vue -- vue
    ├    ├── cache.js -- 缓存
    ├    ├── cloud.js -- Laf云开发集成
    ├    ├── error.js -- 错误状态码
    ├    ├── main.ts -- 入口
    ├    ├── permission.js - 权限
    ├── .gitignore  -- 忽略配置
    ├── babel.config.js
    ├── jsconfig.json
    ├── package.json
    ├── vue.config.js


# 功能
- [x] 登录授权
- [x] 权限管理
    1. [x] 用户管理
    2. [x] 角色管理
    3. [x] 菜单管理
- [x] 组织管理
   1. [x] 部门管理
   2. [x] 岗位管理

- [x] 素材中心
  1. [x] 素材分类
  2. [] 素材管理
  
# 预览
