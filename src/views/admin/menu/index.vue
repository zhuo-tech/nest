<template>
  <basic-container>
    <div class="avue-crud">
      <el-form :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
              v-model="queryParams.menuName"
              placeholder="请输入菜单名称"
              clearable
              size="small"
              @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>

          <el-button
              v-if="permissions.sys_menu_add"
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
          :data="menuList"
          row-key="_id"
          :tree-props="{children: 'children', hasChildren: 'hasChildrens'}">
        <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="180"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template slot-scope="scope">
            <i :class="scope.row.icon"/>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="60"></el-table-column>
        <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="menuType" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.menuType === '0'" type="success">左菜单</el-tag>
            <el-tag v-if="scope.row.menuType === '2'" type="success">顶菜单</el-tag>
            <el-tag v-if="scope.row.menuType === '1'" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="keepAlive" label="缓冲" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.keepAlive === '0'" type="info">关闭</el-tag>
            <el-tag v-if="scope.row.keepAlive === '1'" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visible" label="显示状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.visible === '1'" type="success">显示</el-tag>
            <el-tag v-if="scope.row.visible === '0'" type="info">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                v-if="permissions.sys_menu_add"
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="addOrUpdateHandle(false,scope.row._id)">新增
            </el-button>
            <el-button
                v-if="permissions.sys_menu_edit"
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(true,scope.row._id)">修改
            </el-button>
            <el-button
                v-if="permissions.sys_menu_del"
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
import {delObj, list} from '@/service/menu.service'
import TableForm from './menu-form'
import {mapGetters} from 'vuex'

export default {
  name: 'Menu',
  components: {TableForm},
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 查询参数
      queryParams: {
        parentId: undefined,
        menuName: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },
  methods: {
    addOrUpdateHandle(isEdit, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, id)
      })
    },
    getList() {
      this.loading = true
      list().then(response => {
        const {data} = response
        this.menuList = data
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
    }
  }
}
</script>
