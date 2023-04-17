# Laf快速开发平台
基于laf开发的`快速开发平台`

# 技术选型
-  [laf](https://github.com/labring/laf) 是云开发平台，提供云函数、云数据库、云存储等开箱即用的应用资源。让开发者快速释放创意。`ChatGPT` 自动写函数，秒级上线，世界上只有两种 `serverless`，30 秒上线的 和 30 秒劝退的！
- `Vue2` `elementui` `avue`

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
	├    ├──     └── region -- 区域管理
	├    ├──     └── user -- 账号管理
    ├    ├── App.vue -- vue
    ├    ├── cache.js -- 缓存
    ├    ├── cloud.js -- Laf云开发集成
    ├    ├── error.js -- 错误状态码
    ├    ├── main.js -- 入口
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

- [x] 系统管理
  1. [x] 参数管理
  2. [x] 字典管理
  3. [x] 文件管理
  4. [x] 日志管理
  5. [x] 区域管理
 
- [ ] 任务调度

- [ ] 开发管理
  1. [ ] 数据源
  2. [ ] 元数据
  3. [ ] 低代码
  
- [ ] 统一授权
  1. [ ] 社交授权
  2. [ ] 短信授权
  3. [ ] 密码授权 
  4. [ ] 设备授权
  
# 预览
`登录`
![image](https://user-images.githubusercontent.com/11770232/230906126-7e9c0e8c-e5e8-47f1-ac5e-ef35a5e49e50.png)
`首页`
![image](https://user-images.githubusercontent.com/11770232/230906248-dcf59a4c-0f67-466b-b088-ee9cef38024e.png)
`权限管理`
![image](https://user-images.githubusercontent.com/11770232/230906357-be0293e0-e12b-4d48-9a7f-1ce5db4288a7.png)
![image](https://user-images.githubusercontent.com/11770232/230906407-b8791942-18bc-4894-b648-468c4e4f90a3.png)
![image](https://user-images.githubusercontent.com/11770232/230906438-9f50f67b-f020-485d-856c-acc7a9dbfc6d.png)
`组织机构`
![image](https://user-images.githubusercontent.com/11770232/230906491-74232d2e-476a-45d7-a46e-9f3849264aa2.png)
![image](https://user-images.githubusercontent.com/11770232/230906542-d1021f48-c991-4d68-8053-3e7506d88dbf.png)
`系统管理`
![image](https://user-images.githubusercontent.com/11770232/230906627-3f76440d-099b-49cd-bf42-d035100e0816.png)
![image](https://user-images.githubusercontent.com/11770232/230906770-4acda25e-f2c0-4cbf-a660-c492a0fa0eef.png)
![image](https://user-images.githubusercontent.com/11770232/230906802-132e9a4a-bb43-44ab-a35c-f4a9173b7555.png)
![image](https://user-images.githubusercontent.com/11770232/230906845-f01bb23c-87fb-47d3-b7be-982b35e10936.png)
`个人中心`
![image](https://user-images.githubusercontent.com/11770232/230907202-59da9ace-0f47-4644-ab40-9950147d1ee8.png)


## 🚀 Quick Start
- 初始化
  > 说明:
  > - 替换自己的应用
  > - [laf-assistant](https://forum.laf.run/d/67) 同步云函数
  > - 执行初始化数据函数 `init-collection-data`
  > - 配置访问策略 [访问策略](https://doc.laf.run/guide/db/policy.html)
  
- 安装依赖
  ``` js
  npm i
  ```
- 启动
  ``` js 
  npm run dev
  ```
- 常见问题
	> 1. 404 [未配置访问策略](https://doc.laf.run/guide/db/policy.html)
	> 2. 403 [集合未开发访问权限](https://doc.laf.run/guide/db/policy.html)
  

