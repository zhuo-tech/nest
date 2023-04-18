import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import zhLocale from './lang/zh'
import './permission' // 权限
import './error' // 日志
import './cache' //页面缓冲
import router from './router/router'
import store from './store'
import {downBlobFile, loadStyle} from './util'
import {validatenull} from './util/validate'
import {base64Encrypt} from './util/encryption'
import * as urls from '@/config/env'
import {iconfontUrl} from '@/config/env'
import * as filters from './filters' // 全局filter
// 表单设计
import AvueFormDesign from '@sscfaith/avue-form-design'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import basicContainer from './components/basic-container/main'
// 字典数据组件
import DictResolver from '@/components/DictResolver'
// 字典标签组件
import DictTag from '@/components/DictTag'

// 挂载常用全局方法，import 引入
Vue.prototype.validatenull = validatenull
Vue.prototype.downBlobFile = downBlobFile
Vue.prototype.base64Encrypt = base64Encrypt

DictResolver.install()

// 插件 json 展示
Vue.use(router)

window.axios = axios
Vue.use(VueAxios, axios)

Vue.use(AvueFormDesign)

Vue.use(ElementUI, {
    size: 'small',
    menuType: 'text'
})
// eslint-disable-next-line
Vue.use(AVUE, {
    locale: zhLocale,
    size: 'small',
    menuType: 'text'
})
// 注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('DictTag', DictTag)
// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontUrl.forEach(ele => {
    loadStyle(ele)
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
