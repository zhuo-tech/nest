<template>
  <el-color-picker
    v-model="themeVal"
    :predefine="predefineColors"
    size="mini"
    style="padding-top:18px;"
    class="theme-picker"
    popper-class="theme-picker-dropdown"/>
</template>

<script>
import color from '@/mixins/color'

export default {
  name: 'TopColor',
  mixins: [color()],
  data() {
    return {
      chalk: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    }
  }
}
</script>

<style>
.theme-picker .el-color-picker__trigger {
  vertical-align: middle;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
