<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
      :title="!form._id ? '新增': '修改'"
      :visible.sync="visible"
      append-to-body>
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col>
          <el-form-item label="上级部门">
            <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级部门"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称"/>
      </el-form-item>
      <el-form-item label="排序" prop="sortOrder">
        <el-input-number v-model="form.sortOrder" controls-position="right" :min="0"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addObj, fetchTree, getObj, putObj} from '@/service/sys.dept.service.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'DeptForm',
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 部门树选项
      deptOptions: [],
      // 是否显示弹出层
      visible: false,
      form: {
        name: undefined,
        sortOrder: 999
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '部门名称不能为空', trigger: 'blur'}
        ],
        sortOrder: [
          {required: true, message: '部门顺序不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init(isEdit, id) {
      if (id !== null) {
        this.form.parentId = id
      }
      this.visible = true
      this.getTreeselect()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (isEdit) {
          getObj(id).then(response => {
            this.form = response.data
          })
        } else {
          this.form.deptId = undefined
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.parentId === undefined) {
            this.form.parentId = "0"
          }
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
    /** 查询部门下拉树结构 */
    getTreeselect() {
      fetchTree().then(response => {
        this.deptOptions = []
        const dept = {_id: "0", name: '根部门', children: response.data}
        this.deptOptions.push(dept)
      })
    },
    /** 转换部门数据结构 */
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
