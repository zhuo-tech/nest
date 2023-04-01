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
          :before-open="beforeOpen"
          @on-load="getList"
          @row-update="handleUpdate"
          @row-save="handleSave"
          @search-change="searchChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-del="rowDel">
        <template slot="menu" slot-scope="scope">
          <el-button
              v-if="permissions.sys_dict_add"
              type="text"
              size="small"
              icon="el-icon-menu"
              @click="handleItem(scope.row,scope.index)">字典项
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
        :visible.sync="dialogFormVisible"
        title="字典项管理"
        width="90%"
        @close="dictItemVisible">
      <avue-crud
          ref="crudItem"
          v-model="form"
          :data="tableDictItemData"
          :permission="permissionList"
          :before-open="handleBeforeOpen"
          :option="tableDictItemOption"
          @row-update="handleItemUpdate"
          @row-save="handleItemSave"
          @row-del="rowItemDel"></avue-crud>
    </el-dialog>
  </div>
</template>

<script>
import {addItemObj, addObj, delItemObj, delObj, fetchItemList, fetchList, putItemObj, putObj} from '@/service/dict.js'
import {tableDictItemOption, tableOption} from '@/views/admin/dict/index.js'
import {mapGetters} from 'vuex'

export default {
  name: 'Dict',
  data() {
    return {
      searchForm: {},
      form: {
        dictType: undefined,
        dictId: undefined
      },
      dictType: undefined,
      dictId: undefined,
      dialogFormVisible: false,
      tableData: [],
      tableDictItemData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      tableDictItemOption: tableDictItemOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_dict_add, false),
        delBtn: this.vaildData(this.permissions.sys_dict_del, false),
        editBtn: this.vaildData(this.permissions.sys_dict_edit, false)
      }
    }
  },
  methods: {
    //======字典表格相关=====
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
    rowDel: function (row) {
      console.log(row)
      this.$confirm('是否确认删除数据类型为"' + row.dictType + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row)
      }).then(() => {
        this.getList(this.page)
        this.$message.success('删除成功')
      }).catch(function () {
      })
    },
    handleUpdate: function (row, index, done) {
      putObj(row).then(() => {
        this.$message.success('修改成功')
        this.getList(this.page)
        done()
      })
    },
    handleSave: function (row, done) {
      addObj(row).then(() => {
        this.$message.success('添加成功')
        this.getList(this.page)
        done()
      })
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    beforeOpen(show, type) {
      window.boxType = type
      show()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },

    /***
     * 字典项表格相关
     */
    dictItemVisible: function () {
      this.dialogFormVisible = false
    },
    handleItem: function (row) {
      this.dictId = row._id
      this.dictType = row.dictType
      this.getDictItemList()
    },
    getDictItemList() {
      this.dialogFormVisible = true
      fetchItemList({dictId: this.dictId}).then(response => {
        const {data} = response
        this.tableDictItemData = data
      })
    },
    handleBeforeOpen(done) {
      this.form.dictType = this.dictType
      this.form.dictId = this.dictId
      done()
    },
    handleItemSave: function (row, done) {
      addItemObj(row).then(() => {
        this.$message.success('添加成功')
        this.getDictItemList()
        done()
      })
    },
    handleItemUpdate: function (row, index, done) {
      putItemObj(row).then(() => {
        this.$message.success('修改成功')
        this.getDictItemList()
        done()
      })
    },
    rowItemDel: function (row) {
      this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delItemObj(row.dictId, row._id, row.dictType)
      }).then(() => {
        this.getDictItemList()
        this.$message.success('删除成功')
      }).catch(function () {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

