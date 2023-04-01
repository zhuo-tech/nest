<template>
  <div
      v-if="showTag"
      class="avue-tags"
      @click="contextmenuFlag=false">
    <!-- tag盒子 -->
    <div
        v-if="contextmenuFlag"
        :style="{left:contentmenuX+'px',top:contentmenuY+'px'}"
        class="avue-tags__contentmenu">
      <div
          class="item"
          @click="closeOthersTags">关闭其他
      </div>
      <div
          class="item"
          @click="closeAllTags">关闭全部
      </div>
    </div>
    <div
        :class="{'avue-tags__box--close':!website.isFirstPage}"
        class="avue-tags__box">
      <el-tabs
          v-model="active"
          :closable="tagLen!==1"
          type="card"
          @contextmenu.native="handleContextmenu"
          @tab-click="openTag"
          @edit="menuTag">
        <el-tab-pane
            v-for="item in tagList"
            :key="item.value"
            :label="item.label"
            :name="item.value"/>

      </el-tabs>
      <el-dropdown class="avue-tags__menu">
        <el-button
            type="primary"
            size="mini">
          更多
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="closeAllTags">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'Tags',
  data() {
    return {
      active: '',
      contentmenuX: '',
      contentmenuY: '',
      contextmenuFlag: false
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'tagList', 'tag', 'website']),
    ...mapState({
      showTag: state => state.common.showTag
    }),
    tagLen() {
      return this.tagList.length || 0
    }
  },
  watch: {
    tag() {
      this.setActive()
    },
    contextmenuFlag() {
      window.addEventListener('mousedown', this.watchContextmenu)
    }
  },
  mounted() {
    this.setActive()
  },
  methods: {
    watchContextmenu() {
      if (!this.$el.contains(event.target) || event.button !== 0) {
        this.contextmenuFlag = false
      }

      window.removeEventListener('mousedown', this.watchContextmenu)
    },
    handleContextmenu(event) {
      let target = event.target
      // 解决 https://github.com/d2-projects/d2-admin/issues/54
      let flag = false
      if (target.className.indexOf('el-tabs__item') > -1) flag = true
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    // 激活当前选项
    setActive() {
      this.active = this.tag.value
    },
    menuTag(value, action) {
      if (action === 'remove') {
        const {tag, key} = this.findTag(value)
        this.$store.commit('DEL_TAG', tag)
        if (tag.value === this.tag.value) {
          const tagToOpen = this.tagList[key === 0 ? key : key - 1] // 如果关闭本标签让前推一个
          this.openTag(tagToOpen)
        }
      }
    },
    openTag(item) {
      let tag
      if (item.name) {
        tag = this.findTag(item.name).tag
      } else {
        tag = item
      }
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: tag.label,
          src: tag.value
        }),
        query: tag.query
      }).catch(() => {
      })
    },
    closeOthersTags() {
      this.contextmenuFlag = false
      this.$store.commit('DEL_TAG_OTHER')
    },
    findTag(value) {
      let tag, key
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item
          key = index
        }
      })
      return {tag: tag, key: key}
    },
    closeAllTags() {
      this.contextmenuFlag = false
      this.$store.commit('DEL_ALL_TAG')
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })
    }
  }
}
</script>

