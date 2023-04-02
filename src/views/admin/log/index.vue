<template>
  <div class="log">
    <basic-container>
      <avue-crud
          ref="crud"
          :page.sync="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption"
          :permission="permissionList"
          @on-load="getList"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
      >
        <template slot="menuLeft">
          <el-button
              v-if="permissions.sys_log_del"
              class="filter-item"
              plain
              type="primary"
              size="small"
              icon="el-icon-remove"
              @click="handleDelLogs"
          >清空
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {delObjs, fetchList} from '@/service/log.js'
import {tableOption} from '@/views/admin/log/index.js'
import {mapGetters} from 'vuex'

export default {
  name: 'Log',
  data() {
    return {
      tableData: [],
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.sys_log_del, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(
          Object.assign(
              {
                current: page.currentPage,
                size: page.pageSize
              },
              params,
              this.searchForm
          )
      ).then(response => {
        const {data, total} = response
        this.tableData = data
        this.page.total = total
        this.tableLoading = false
      })
    },
    handleDelLogs() {
      delObjs().then(() => {
        this.$notify.success('清空成功')
        this.$refs.crud.toggleSelection()
        this.refreshChange()
      })
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    refreshChange() {
      this.getList(this.page)
    },
    exportExcel() {
      this.downBlobFile('/admin/log/export', this.searchForm, 'log.xlsx')
    }
  }
}
</script>
