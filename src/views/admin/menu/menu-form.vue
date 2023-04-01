<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
      :title="!form._id ? '新增': '修改'"
      :visible.sync="visible"
      append-to-body>
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType" size="small">
              <el-radio-button label="0">左菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
              <el-radio-button label="2">顶菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单">
            <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.menuType !== '1'" label="图标" prop="icon">
        <avue-input-icon v-model="form.icon" :icon-list="iconList"></avue-input-icon>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item v-if="form.menuType !== '1'" label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="请输入路由地址"/>
      </el-form-item>
      <el-form-item v-if="form.menuType === '1'" label="权限标识" prop="permission">
        <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType !== '1'" label="路由缓冲" prop="keepAlive">
            <el-radio-group v-model="form.keepAlive">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="form.menuType !== '1'" label="显示状态" prop="visible">
            <el-radio-group v-model="form.visible">
              <el-radio-button label="1">显示</el-radio-button>
              <el-radio-button label="0">隐藏</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addObj, getObj, list, putObj} from '@/service/menu.js'
import Treeselect from '@riophae/vue-treeselect'
import iconList from '@/const/iconList'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单树选项
      menuOptions: [],
      // 是否显示弹出层
      visible: false,
      // 图标
      iconList: iconList,
      form: {
        _id: undefined,
        label: undefined,
        name: undefined,
        path: undefined,
        icon: undefined,
        permission: undefined,
        menuType: '0',
        keepAlive: '0',
        visible: '1',
        sortOrder: 999
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '菜单名称不能为空', trigger: 'blur'}
        ],
        sortOrder: [
          {required: true, message: '菜单顺序不能为空', trigger: 'blur'}
        ],
        path: [
          {required: true, message: '路由地址不能为空', trigger: 'blur'}
        ],
        keepAlive: [
          {required: true, message: '路由缓冲不能为空', trigger: 'blur'}
        ],
        permission: [
          {required: true, message: '权限标识不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init(isEdit, id) {
      if (id != null) {
        this.form.parentId = id
      }
      this.visible = true
      this.getTreeselect()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (isEdit) {
          getObj(id).then(response => {
            if (response.ok) {
              this.form = response.data
            }
          })
        } else {
          this.form._id = undefined
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.parentId === undefined) {
            this.form.parentId = "-1"
          }
          this.form.label = this.form.name
          if (this.form._id) {
            putObj(this.form).then(data => {
              this.$message.success('修改成功')
              this.visible = false
              this.$emit('refreshDataList')
            })
          } else {
            addObj(this.form).then(data => {
              this.$message.success('添加成功')
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        }
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      list().then(response => {
        this.menuOptions = []
        const menu = {_id: "-1", name: '根菜单', children: []}
        const {data} = response
        menu.children = data
        this.menuOptions.push(menu)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node._id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>
