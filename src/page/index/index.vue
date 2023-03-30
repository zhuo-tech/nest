<template>
  <div
    :class="{'avue--collapse':isCollapse}"
    class="avue-contail">
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top/>
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-main">
        <!-- 顶部标签卡 -->
        <tags/>
        <!-- 主体视图层 -->
        <div
          id="avue-view"
          style="height:100%;overflow-y:auto;overflow-x:hidden;">
          <keep-alive>
            <router-view
              v-if="$route.meta.keepAlive"
              class="avue-view"/>
          </keep-alive>
          <router-view
            v-if="!$route.meta.keepAlive"
            class="avue-view"/>
        </div>
      </div>
    </div>
    <div
      class="avue-shade"
      @click="showCollapse"/>
    <global-web-socket v-if="website.websocket" uri="/act/ws/info"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
import { calcScreen } from '@/util'


export default {
  name: 'Index',
  provide() {
    return {
      Index: this
    }
  },
  components: {
    top,
    tags,
    sidebar
  },
  data() {
    return {}
  },
  computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website']),
  created() {
  },
  destroyed() {
  },
  mounted() {
    this.initWindow()
  },
  methods: {
    showCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    openMenu(item = {}) {
      this.$store.dispatch('GetMenu', { type: true, id: item._id }).then(data => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true)
        }
      })
    },
    // 屏幕检测
    initWindow() {
      this.$store.commit('SET_SCREEN', calcScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', calcScreen())
        }, 0)
      }
    }
  }
}
</script>
