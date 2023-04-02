# 微草轻课
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
    ├    ├── auth.js -- 授权登录
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

- [x] 素材管理
    1.  [x] 图片
    2.  [x] 视频
    3.  [x] 音频
- [x] 题库管理
    1.  [x] 单选题
    2.  [x] 多选题
    3.  [x] 判断题
    4.  [x] 简答题
    5.  [x] 选择题
    6.  [x] 填空题
- [x] 作品制作
    1. [x] 答题
    2. [x] 书签
    3. [x] 插画
    4. [x] 文本
    5. [x] 热区
    6. [x] 链接
    7. [ ] 投票
    8. [ ] 问卷
    9. [ ] 反馈
    10. [ ] 笔记
- [x] 专辑售卖
- [x] 支付中心
    1. [x] 支付渠道（微信支付）
    2. [x] 支付订单
    3. [x] 交易流水
    4. [x] 支付通知
- [x] 学员管理
- [x] 系统管理
    1. [x] 用户管理
    2. [x] 角色管理
    3. [x] 权限管理
- [ ] 微信公众平台

# 预览
![image](https://user-images.githubusercontent.com/11770232/177938839-2224f47e-d461-4636-8f82-c74aa15a3dc6.png)
![image](https://user-images.githubusercontent.com/11770232/177939129-3f2836da-8c56-456f-bf43-126f8c6dd302.png)
![image](https://user-images.githubusercontent.com/11770232/177939258-b9ba0133-0df3-4279-9404-6c47408faf97.png)
![image](https://user-images.githubusercontent.com/11770232/177938743-9eaef5b6-c2a1-4c96-bc65-04b8aa2322aa.png)
