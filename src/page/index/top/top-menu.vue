<template>
  <div class="top-menu">
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        text-color="#333">
      <template v-for="(item,index) in items">
        <el-menu-item
            :key="index"
            :index="item.parentId+''"
            @click.native="openMenu(item)">
          <template slot="title">
            <i :class="item.icon"/>
            <span>{{ item.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'TopMenu',
  inject: ['Index'],
  data() {
    return {
      activeIndex: '0',
      items: []
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'menu'])
  },
  created() {
    // 显示顶部菜单
    this.getTopMenu()
    // 用户权限加载
    this.getUserInfo()
  },
  methods: {
    getTopMenu() {
      this.$store.dispatch('GetTopMenu').then(res => {
        this.items = res
      })
    },
    openMenu(item) {
      this.Index.openMenu(item)
      // 清空原有的tag,避免刷新 404
      this.$store.commit('DEL_ALL_TAG')
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })
    },
    getUserInfo() {
      // 更新sessionStore 权限信息
      this.$store.dispatch('GetUserInfo')
    }
  }
}
</script>
