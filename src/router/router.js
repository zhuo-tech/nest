import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router'
import Store from '../store/'

Vue.use(VueRouter)
//创建路由
export const createRouter = () => new VueRouter({
  routes: [...PageRouter, ...ViewsRouter]
})

const Router = createRouter()
AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher
  AvueRouter.install(Router, Store)
}

export default Router
