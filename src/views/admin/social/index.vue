<template>
  <div class="execution">
    <basic-container>
      <avue-crud
          ref="crud"
          :page.sync="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption"
          :permission="permissionList"
          :before-open="beforeOpen"
          @on-load="getList"
          @refresh-change="refreshChange"
          @search-change="searchChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel"/>
    </basic-container>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, putObj} from '@/service/social.service.js'
import {tableOption} from '@/views/admin/social/index.js'
import {mapGetters} from 'vuex'

export default {
  name: 'SysSocialDetails',
  data() {
    return {
      searchForm: {},
      tableData: [],
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
        addBtn: this.vaildData(this.permissions.sys_social_details_add, false),
        delBtn: this.vaildData(this.permissions.sys_social_details_del, false),
        editBtn: this.vaildData(this.permissions.sys_social_details_edit, false)
      }
    }
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        const {data, total} = response
        this.tableData = data
        this.page.total = total
        this.tableLoading = false
      })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row._id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.id)
      }).then(() => {
        _this.$message.success('删除成功')
        this.refreshChange()
      }).catch(function () {
      })
    },
    handleUpdate: function (row, index, done) {
      if (row.appSecret && row.appSecret.indexOf('*') >= 0) {
        row.appSecret = undefined
      }
      if (row.appId && row.appId.indexOf('*') >= 0) {
        row.appId = undefined
      }
      putObj(row).then(() => {
        this.$message.success('修改成功')
        this.refreshChange()
        done()
      })
    },
    handleSave: function (row, done, loading) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row))
        this.$message.success('添加成功')
        this.refreshChange()
        done()
      }).catch(() => {
        loading()
      })
    },
    refreshChange() {
      this.getList(this.page)
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
    beforeOpen(show, type) {
      window.boxType = type
      show()
    }
  }
}
</script>

