<template>
  <div class="login-container">
    <div class="login-weaper animated bounceInDown">
      <div class="login-logo">
        <img src="/img/logo.png" alt=""/>
      </div>
      <p class="login-tip">{{ website.title }}</p>
      <div class="login-border">
        <div class="login-main">
          <userLogin/>
        </div>
      </div>
    </div>
    <div class="login-copyright">
      {{ website.copyright }}
    </div>
    <top-color v-show="false"/>
  </div>
</template>
<script>
import userLogin from './userlogin'
import { mapGetters } from 'vuex'
import topColor from '@/page/index/top/top-color'

export default {
  name: 'Login',
  components: {
    userLogin,
    topColor
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['website', 'tagWel'])
  },
  watch: {},
  created() {

  },
  methods: {}
}
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
