<template>
  <avue-crud
      :data="list"
      :option="option"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange">
    <template slot="menuLeft">
      <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          @click="clear">清空本地日志
      </el-button>
    </template>
    <template
        slot="type"
        slot-scope="scope">
      <el-tag
          type="danger"
          size="small">{{ scope.label }}
      </el-tag>
    </template>
    <template
        slot="expand"
        slot-scope="props">
      <pre class="code">
        {{ props.row.stack }}
      </pre>
    </template>
  </avue-crud>
</template>

<script>
import {mapGetters} from 'vuex'
import option from '@/const/logs/index'

export default {
  name: 'ErrLogs',
  data() {
    return {
      // 默认不分页，若记录数超过，则分页
      onePageMaxSize: 10,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      option: option,
      list: []
    }
  },
  computed: {
    ...mapGetters(['logsList', 'logsLen'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getList()
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.getList()
    },
    getList() {
      const total = this.logsLen
      if (total <= this.onePageMaxSize) {
        this.list = this.logsList
      } else {
        const currentPage = this.page.currentPage
        const pageSize = this.page.pageSize
        this.list = this.logsList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        this.page.total = total
      }
    },
    clear() {
      this.$confirm('确定清空本地日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.page.currentPage = 1
        this.page.total = 0
        this.$store.commit('CLEAR_LOGS')
        this.$parent.$parent.box = false
        this.$message.success('清空成功!')
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  font-size: 12px;
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 0 1em;
}
</style>
