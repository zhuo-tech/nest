/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import { validatenull } from '@/util/validate'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  const meta = to.meta || {}
  if (store.getters.access_token) {
    if (store.getters.isLock && to.path !== '/lock') {
      next({ path: '/lock' })
    } else if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const value = to.query.src || to.fullPath
      const label = to.query.name || to.name

      // 针对外链跳转
      if (value.includes('http') || value.includes('https')) {
        window.open(value, '_blank')
        return
      }

      if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
        store.commit('ADD_TAG', {
          label: label,
          value: value,
          params: to.params,
          query: to.query,
          group: router.$avueRouter.group || []
        })
      }
      next()
    }
  } else {
    if (meta.isAuth === false) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  let title = store.getters.tag.label
  if (!store.getters.access_token) title = undefined
  router.$avueRouter.setTitle(title)
})
