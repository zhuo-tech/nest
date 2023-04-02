<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog
      :title="!form._id ? '新增': '修改'"
      :visible.sync="visible"
      append-to-body>
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col>
          <el-form-item label="上级分类">
            <treeselect
                v-model="form.parentId"
                :options="categoryOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级分类"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称"/>
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
import {addObj, fetchTree, getObj, putObj} from '@/service/mc.category.service.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'McCategoryForm',
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 分类树选项
      categoryOptions: [],
      // 是否显示弹出层
      visible: false,
      form: {
        name: undefined,
        sortOrder: 999
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: '分类名称不能为空', trigger: 'blur'}
        ],
        sortOrder: [
          {required: true, message: '分类顺序不能为空', trigger: 'blur'}
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
          this.form.categoryId = undefined
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
    /** 查询素材分类下拉树结构 */
    getTreeselect() {
      fetchTree().then(response => {
        this.categoryOptions = []
        const category = {_id: "0", name: '根分类', children: response.data}
        this.categoryOptions.push(category)
      })
    },
    /** 转换素材分类数据结构 */
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
