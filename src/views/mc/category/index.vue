<template>
  <basic-container>
    <div class="avue-crud">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
              v-model="queryParams.categoryNme"
              placeholder="请输入分类名称"
              clearable
              size="small"
              @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
          <el-button
              v-if="permissions.mc_category_add"
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
          :data="categoryList"
          row-key="_id"
          default-expand-all
          :tree-props="{children: 'children'}">
        <el-table-column prop="name" label="分类名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sortOrder" label="排序" align="center"></el-table-column>
        <el-table-column :formatter="formatDate" prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button
                v-if="permissions.mc_category_add"
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="addOrUpdateHandle(false,scope.row._id)">新增
            </el-button>
            <el-button
                v-if="permissions.mc_category_edit"
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(true,scope.row._id)">修改
            </el-button>
            <el-button
                v-if="permissions.mc_category_del"
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
import {delObj, fetchTree} from '@/service/mc.category.service.js'
import TableForm from './category-form'
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
      categoryList: [],
      // 查询参数
      queryParams: {
        categoryNme: ''
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
        this.categoryList = response.data
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row._id)
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
