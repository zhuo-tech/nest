import {getStore, removeStore, setStore} from '@/util/store'
import website from '@/const/website'

const common = {

    state: {
        isCollapse: false,
        isFullScreen: false,
        isShade: false,
        screen: -1,
        isLock: getStore({name: 'isLock'}) || false,
        showTag: getStore({name: 'showTag'}),
        showDebug: getStore({name: 'showDebug'}),
        showCollapse: getStore({name: 'showCollapse'}),
        showSearch: getStore({name: 'showSearch'}),
        showLock: getStore({name: 'showLock'}),
        showFullScreen: getStore({name: 'showFullScreen'}),
        showTheme: getStore({name: 'showTheme'}),
        showColor: getStore({name: 'showColor'}),
        showMenu: getStore({name: 'showMenu'}),
        theme: getStore({name: 'theme'}) || '#409EFF',
        themeName: getStore({name: 'themeName'}) || 'theme-white',
        lockPasswd: getStore({name: 'lockPasswd'}) || '',
        website: website,
        likeTopMenuId: undefined
    },
    actions: {},
    mutations: {
        SET_SHADE: (state, active) => {
            state.isShade = active
        },
        SET_COLLAPSE: (state) => {
            state.isCollapse = !state.isCollapse
        },
        SET_FULLSCREEN: (state) => {
            state.isFullScreen = !state.isFullScreen
        },
        SET_SHOW_COLLAPSE: (state, active) => {
            state.showCollapse = active
            setStore({
                name: 'showCollapse',
                content: state.showCollapse
            })
        },
        SET_SHOW_TAG: (state, active) => {
            state.showTag = active
            setStore({
                name: 'showTag',
                content: state.showTag
            })
        },
        SET_SHOW_MENU: (state, active) => {
            state.showMenu = active
            setStore({
                name: 'showMenu',
                content: state.showMenu
            })
        },
        SET_SHOW_LOCK: (state, active) => {
            state.showLock = active
            setStore({
                name: 'showLock',
                content: state.showLock
            })
        },
        SET_SHOW_SEARCH: (state, active) => {
            state.showSearch = active
            setStore({
                name: 'showSearch',
                content: state.showSearch
            })
        },
        SET_SHOW_FULL_SCREEN: (state, active) => {
            state.showFullScreen = active
            setStore({
                name: 'showFullScreen',
                content: state.showFullScreen
            })
        },
        SET_SHOW_DEBUG: (state, active) => {
            state.showDebug = active
            setStore({
                name: 'showDebug',
                content: state.showDebug
            })
        },
        SET_SHOW_THEME: (state, active) => {
            state.showTheme = active
            setStore({
                name: 'showTheme',
                content: state.showTheme
            })
        },
        SET_SHOW_COLOR: (state, active) => {
            state.showColor = active
            setStore({
                name: 'showColor',
                content: state.showColor
            })
        },
        SET_LOCK: (state) => {
            state.isLock = true
            setStore({
                name: 'isLock',
                content: state.isLock,
                type: 'session'
            })
        },
        SET_SCREEN: (state, screen) => {
            state.screen = screen
        },
        SET_THEME: (state, color) => {
            state.theme = color
            setStore({
                name: 'theme',
                content: state.theme
            })
        },
        SET_THEME_NAME: (state, themeName) => {
            state.themeName = themeName
            setStore({
                name: 'themeName',
                content: state.themeName
            })
        },
        SET_LOCK_PASSWD: (state, lockPasswd) => {
            state.lockPasswd = lockPasswd
            setStore({
                name: 'lockPasswd',
                content: state.lockPasswd,
                type: 'session'
            })
        },
        CLEAR_LOCK: (state) => {
            state.isLock = false
            state.lockPasswd = ''
            removeStore({
                name: 'lockPasswd'
            })
            removeStore({
                name: 'isLock',
                type: 'session'
            })
        },
        LIKE_TOP_MENUID: (state, obj) => {
            if (obj.id === undefined) {
                obj.id = getStore({name: 'LIKE_TOP_MENUID'})
            }

            state.likeTopMenuId = obj.id
            setStore({
                name: 'LIKE_TOP_MENUID',
                content: state.likeTopMenuId,
                type: 'session'
            })
        },
        REMOVE_LIKE_TOP_MENUID: (state) => {
            state.likeTopMenuId = undefined
            removeStore({
                name: 'LIKE_TOP_MENUID',
                type: 'session'
            })
        }
    }
}
export default common
