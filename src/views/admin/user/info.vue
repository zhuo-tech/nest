<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <template>
        <el-row>
          <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
          >
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="头像">
                  <el-upload
                      :headers="headers"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      class="avatar-uploader"
                      action="/func/sys-file-upload"
                  >
                    <img v-if="ruleForm.avatar" id="avatar" :src="avatarUrl" class="avatar" alt="头像"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username" type="text" disabled/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="验证码登录使用"/>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="ruleForm.nickname" placeholder="昵称"/>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="姓名"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email" placeholder="邮箱"/>
                </el-form-item>
                <el-form-item label="原密码" prop="password">
                  <el-input v-model="ruleForm.password" type="password" auto-complete="off"/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="ruleForm.newPassword" type="password" auto-complete="off"/>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="ruleForm.confirmPassword" type="password" auto-complete="off"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm()">提交</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </template>
    </basic-container>
  </div>
</template>

<script>
import {handleImg} from '@/util'
import {mapState} from 'vuex'
import store from '@/store'
import {isValidateNoneMobile} from '@/util/validate'
import {editInfo} from '@/service/sys.user.service.js'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isValidateNoneMobile(value)[0]) {
        callback(new Error(isValidateNoneMobile(value)[1]))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (this.ruleForm.password !== '') {
        if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      avatarUrl: '',
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token
      },
      ruleForm: {
        username: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        avatar: '',
        phone: '',
        nickname: '',
        name: '',
        email: ''
      },
      rules: {
        phone: [{required: false, validator: validatePhone, trigger: 'blur'}],
        password: [
          {
            required: true,
            min: 6,
            message: '原密码不少于6位',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: false,
            min: 6,
            message: '新密码不少于6位',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {required: false, validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    this.resetForm()
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        }
        editInfo(this.ruleForm).then(() => {
          this.$notify.success('修改成功')
          // 修改后注销当前token,重新登录
          this.$store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
      })
    },
    resetForm() {
      this.ruleForm.password = undefined
      this.ruleForm.newPassword = undefined
      this.ruleForm.confirmPassword = undefined
      this.ruleForm.username = this.userInfo.username
      this.ruleForm.phone = this.userInfo.phone
      this.ruleForm.avatar = this.userInfo.avatar
      this.ruleForm.nickname = this.userInfo.nickname
      this.ruleForm.name = this.userInfo.name
      this.ruleForm.email = this.userInfo.email
      handleImg('/oss/' + this.userInfo.avatar, 'avatar')
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
      this.ruleForm.avatar = res.data.fileName
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/info.scss";
</style>
