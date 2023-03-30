import { getStore, setStore } from '@/util/store'
import { isURL, validatenull } from '@/util/validate'
import { getUserInfo, loginByUsername, logout } from '@/func'
import { deepClone } from '@/util'
import website from '@/const/website'
import { getMenu, getTopMenu } from '@/service/menu'

function addPath(ele, first) {
  const menu = website.menu
  const propsConfig = menu.props
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon]
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild) ele[propsDefault.children] = []
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child)
    })
  }
}

const user = {
  state: {
    userInfo: getStore({
      name: 'userInfo'
    }) || {},
    permissions: getStore({
      name: 'permissions'
    }) || [],
    roles: [],
    menu: getStore({
      name: 'menu'
    }) || [],
    menuAll: [],
    access_token: getStore({
      name: 'access_token'
    }) || '',
    refresh_token: getStore({
      name: 'refresh_token'
    }) || ''
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('CLEAR_LOCK')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data || {}
          commit('SET_USER_INFO', data.user)
          commit('SET_ROLES', data.roles || [])
          commit('SET_PERMISSIONS', data.permissions || [])
          resolve(data)
        }).catch(() => {
          reject()
        })
      })
    },
    // 获取系统菜单
    GetMenu({ commit }, obj) {
      // 记录用户点击顶部信息，保证刷新的时候不丢失
      commit('LIKE_TOP_MENUID', obj)
      return new Promise(resolve => {
        getMenu(obj._id).then((res) => {
          const data = res.data
          const menu = deepClone(data)
          menu.forEach(ele => {
            addPath(ele)
          })
          const type = obj.type
          commit('SET_MENU', { type, menu })
          resolve(menu)
        })
      })
    },
    //顶部菜单
    GetTopMenu() {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data || []
          resolve(data)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_MENU', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          commit('DEL_ALL_TAG')
          commit('CLEAR_LOCK')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: userInfo,
        type: 'session'
      })
    },
    SET_MENU: (state, params = {}) => {
      const { menu, type } = params
      if (type !== false) state.menu = menu
      setStore({
        name: 'menu',
        content: menu,
        type: 'session'
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }

      state.permissions = list
      setStore({
        name: 'permissions',
        content: list,
        type: 'session'
      })
    }
  }

}
export default user
