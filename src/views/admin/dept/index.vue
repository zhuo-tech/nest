<template>
  <basic-container>
    <div class="avue-crud">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
              v-model="queryParams.deptName"
              placeholder="请输入部门名称"
              clearable
              size="small"
              @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button
              v-if="permissions.sys_dept_add"
              icon="el-icon-plus"
              type="primary"
              @click="addOrUpdateHandle(false)">
            添加
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
          v-loading="loading"
          border
          :data="deptList"
          row-key="_id"
          default-expand-all
          :tree-props="{children: 'children'}">
        <el-table-column prop="name" label="部门名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sortOrder" label="排序" align="center"></el-table-column>
        <el-table-column :formatter="formatDate" prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button
                v-if="permissions.sys_dept_add"
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="addOrUpdateHandle(false,scope.row._id)">新增
            </el-button>
            <el-button
                v-if="permissions.sys_dept_edit"
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(true,scope.row._id)">修改
            </el-button>
            <el-button
                v-if="permissions.sys_dept_del"
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></table-form>
    </div>
  </basic-container>
</template>

<script>
import {delObj, fetchTree} from '@/service/sys.dept.service'
import TableForm from './dept-form'
import {mapGetters} from 'vuex'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default {
  name: 'Dept',
  components: {TableForm},
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      //表格树数据
      deptList: [],
      // 查询参数
      queryParams: {
        deptName: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permissions', 'website'])
  },
  created() {
    this.getList()
  },
  methods: {
    refreshChange() {
      this.getList(this.page)
    },
    addOrUpdateHandle(isEdit, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, id)
      })
    },
    getList() {
      this.loading = true
      fetchTree(this.queryParams).then(response => {
        this.deptList = response.data
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        const {code, msg} = delObj(row._id)
        if (code !== 0) {
          this.$message.error(msg)
        }
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
    },
    formatDate(row, column, cellValue) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
