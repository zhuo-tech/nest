<template>
  <div class="execution">
    <basic-container>
      <avue-crud
          ref="crud"
          :page.sync="page"
          :data="tableData"
          :permission="permissionList"
          :table-loading="tableLoading"
          :option="tableOption"
          @on-load="getList"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="handleDel">
        <template slot="menuLeft">
          <el-button
              v-if="permissions.sys_post_add"
              class="filter-item"
              type="primary"
              icon="el-icon-edit"
              @click="$refs.crud.rowAdd()">添加
          </el-button>
          <el-button
              v-if="permissions.sys_post_export"
              class="filter-item"
              plain
              type="primary"
              size="small"
              icon="el-icon-upload"
              @click="$refs.excelUpload.show()"
          >导入
          </el-button>
          <el-button
              v-if="permissions.sys_post_export"
              class="filter-item"
              plain
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="exportExcel">导出
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, putObj} from '@/service/post.service.js'
import {tableOption} from '@/views/admin/post/index.js'
import {mapGetters} from 'vuex'

export default {
  name: 'post',
  components: {},
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
        addBtn: this.vaildData(this.permissions.sys_post_add, false),
        delBtn: this.vaildData(this.permissions.sys_post_del, false),
        editBtn: this.vaildData(this.permissions.sys_post_edit, false)
      }
    }
  },
  methods: {
    handleRefreshChange() {
      this.getList(this.page)
    },
    // 列表查询
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
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 删除
    handleDel: function (row, index) {
      this.$confirm('是否确认删除' + row.postName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row._id)
      }).then(data => {
        this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    // 更新
    handleUpdate: function (row, index, done, loading) {
      putObj(row).then(data => {
        this.$message.success('修改成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading()
      })
    },
    // 保存
    handleSave: function (row, done, loading) {
      addObj(row).then(data => {
        this.$message.success('添加成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading()
      })
    },
    // 每页条数改变事件
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    // 当前页发生改变事件
    currentChange(current) {
      this.page.currentPage = current
    },
    // 查询事件
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    // 刷新事件
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>
