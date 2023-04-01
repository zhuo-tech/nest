<template>
  <div class="execution">
    <basic-container>
      <avue-crud
          ref="crud"
          :page.sync="page"
          :data="tableData"
          :permission="permissionList"
          :table-loading="tableLoading"
          :before-open="beforeOpen"
          :option="tableOption"
          @on-load="getList"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @row-del="rowDel">
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, putObj} from '@/service/param.js'
import {tableOption} from '@/views/admin/param/index.js'
import {mapGetters} from 'vuex'

export default {
  name: 'SysParam',
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
        addBtn: this.vaildData(this.permissions.sys_param_add, false),
        delBtn: this.vaildData(this.permissions.sys_param_del, false),
        editBtn: this.vaildData(this.permissions.sys_param_edit, false)
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
      this.$confirm('是否确认删除ID为' + row.publicName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row._id)
      }).then(data => {
        this.getList(this.page)
        this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    beforeOpen(show, type) {
      window.boxType = type
      show()
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done, loading) {
      putObj(row).then(res => {
        const {code, msg} = res
        if (code === 0) {
          this.$message.success('修改成功')
          done()
          this.getList(this.page)
        } else {
          this.$message.error(msg)
          done()
        }
      }).catch(() => {
        loading()
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done, loading) {
      addObj(row).then(data => {
        this.$message.success('添加成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading()
      })
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.getList(this.page)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    }
  }
}
</script>
