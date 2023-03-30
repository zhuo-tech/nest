<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        size="small"
        auto-complete="off"
        placeholder="请输入用户名"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-yonghuming"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :type="passwordType"
        size="small"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin"
      >
        <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword"/>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Userlogin',
  components: {},
  data() {
    return {
      socialForm: {
        code: '',
        state: ''
      },
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      checked: false,
      code: {
        src: undefined,
        len: 4
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^([a-z\u4e00-\u9fa5\d]*?)$/, message: '请输入小写字母', trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'website'])
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.loginByUsername()
    },
    loginByUsername() {
      this.$store.dispatch('LoginByUsername', Object.assign({}, this.loginForm)).then(() => {
        this.$router.push({ path: this.tagWel.value })
      })
    }
  }
}
</script>

<style>
</style>
