<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <avue-crud
          ref="crud"
          v-model="form"
          :option="tableOption"
          :data="list"
          :page.sync="page"
          :table-loading="listLoading"
          :before-open="handleOpenBefore"
          @on-load="getList"
          @search-change="searchChange"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-update="update"
          @row-save="create">
        <template slot="menuLeft">
          <el-button
              v-if="roleManager_btn_add"
              class="filter-item"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate">添加
          </el-button>
        </template>
        <template slot="dsScopeForm" slot-scope="{}">
          <div v-if="form.dsType === 1">
            <el-tree
                ref="scopeTree"
                :data="dsScopeData"
                :check-strictly="true"
                :props="defaultProps"
                :default-checked-keys="checkedDsScope"
                class="filter-tree"
                node-key="_id"
                highlight-current
                show-checkbox/>
          </div>
        </template>

        <template slot="menu" slot-scope="scope">
          <el-button
              v-if="roleManager_btn_edit"
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, scope.index)">编辑
          </el-button>
          <el-button
              v-if="roleManager_btn_del"
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row, scope.index)">删除
          </el-button>
          <el-button
              v-if="roleManager_btn_perm"
              type="text"
              size="small"
              icon="el-icon-plus"
              @click="handlePermission(scope.row, scope.index)">权限
          </el-button>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog :visible.sync="dialogPermissionVisible" :close-on-click-modal="false" title="分配权限">
      <div class="dialog-main-tree">
        <el-tree
            ref="menuTree"
            :data="treeData"
            :default-checked-keys="checkedKeys"
            :check-strictly="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="_id"
            highlight-current
            show-checkbox
            default-expand-all/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updatePermission(roleId)">更 新
        </el-button>
        <el-button type="default" size="small" @click="cancel()">取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, fetchMenuIdsByRoleId, permissionUpd, putObj} from '@/service/role.service.js'
import {tableOption} from '@/views/admin/role/index.js'
import {fetchTree} from '@/service/dept.service.js'
import {list} from '@/service/menu.service.js'
import {mapGetters} from 'vuex'

export default {
  name: 'TableRole',
  components: {},
  data() {
    return {
      searchForm: {},
      tableOption: tableOption,
      dsScopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: '_id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      menuIds: '',
      list: [],
      listLoading: true,
      form: {
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined,
        dsType: 0,
        dsScope: undefined
      },
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    }
  },
  computed: {
    ...mapGetters(['elements', 'permissions'])
  },
  created() {
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
  },
  methods: {
    handleRefreshChange() {
      this.getList(this.page)
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize,
        descs: ['create_time']
      }, params, this.searchForm)).then(response => {
        const {data, total} = response
        this.list = data
        this.page.total = total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
    handleCreate() {
      this.$refs.crud.rowAdd()
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      fetchTree().then(response => {
        const {data} = response
        this.dsScopeData = data
        if (this.form.dsScope) {
          this.checkedDsScope = (this.form.dsScope).split(',')
        } else {
          this.checkedDsScope = []
        }
      })
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cancel() {
      this.dialogPermissionVisible = false
    },
    handlePermission(row) {
      fetchMenuIdsByRoleId(row._id)
          .then(response => {
            const {data: keys} = response
            this.checkedKeys = keys
            return list()
          })
          .then(response => {
            const {data} = response
            this.treeData = data
            // 解析出所有的太监节点
            this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
            this.dialogPermissionVisible = true
            this.roleId = row._id
            this.roleCode = row.roleCode
          })
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          if (idArr && idArr.length !== 0) {
            temp.push(idArr.filter(_id => _id === item._id))
          }
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== '-1'
    },
    getNodeData(data, done) {
      done()
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delObj(row._id)).then(() => {
        this.getList(this.page)
        this.$notify.success('删除成功')
      })
    },
    create(row, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      addObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('创建成功')
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      putObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    },
    updatePermission(roleId) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.$notify.success('修改成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;

    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }

  .el-form-item__content {
    margin-left: 20% !important;
  }
}
</style>
