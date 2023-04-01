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
          :upload-after="uploadAfter"
          @on-load="getList"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-del="rowDel"
      >
        <template slot="menu" slot-scope="scope">
          <el-button
              type="text"
              size="small"
              icon="el-icon-download"
              @click="handleDownloadFile(scope.row)"
          >下载
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {delObj, fetchList} from '@/service/file.js'
import {tableOption} from '@/views/admin/file/index.js'
import {mapGetters} from 'vuex'
import {OSS_ENDPOINT} from "@/cloud";

export default {
  name: 'SysFile',
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_file_add, true),
        delBtn: this.vaildData(this.permissions.sys_file_del, true),
        editBtn: this.vaildData(this.permissions.sys_file_edit, false)
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
      )
          .then(response => {
            const {data, total} = response
            this.tableData = data
            this.page.total = total
            this.tableLoading = false
          })
          .catch(() => {
            this.tableLoading = false
          })
    },
    rowDel: function (row, index) {
      const _this = this
      this.$confirm('是否确认删除ID为' + row._id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(function () {
            return delObj(row._id)
          })
          .then(data => {
            _this.$message.success('删除成功')
            this.getList(this.page)
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
    },
    handleDownloadFile: function (row) {
      // 生成一个a元素
      let a = document.createElement('a')
      // 将a的download属性设置为我们想要下载的图片名称
      a.download = row.original
      // 将生成的URL设置为a.href属性
      a.href =
          OSS_ENDPOINT + "/" + row.fileName +
          '?response-content-type=application%2Foctet-stream'
      document.body.appendChild(a)
      // 触发a的单击事件
      a.click()
      document.body.removeChild(a)
    },
    uploadAfter(res, done, loading) {
      if (!this.validatenull(res.fileName)) {
        this.$message.success('上传成功')
        this.getList(this.page)
      }
      done()
    }
  }
}
</script>
