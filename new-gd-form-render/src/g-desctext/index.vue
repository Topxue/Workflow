<!--
 * @Author: caohao
 * @Date: 2021-04-29 17:19:50
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-18 10:47:54
 * @Description: 说明文字
-->
<template>
  <g-form-item :label="dataInfo.name" v-if="!dataInfo.options.onlyShowInLaunchPage||($attrs.formType == 'start'&&dataInfo.options.onlyShowInLaunchPage)">
    <div class="g-desctext">{{dataInfo.options.defaultValue}}</div>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-desctext',
  mixins: [valueMixin]
}
</script>
<style lang="scss" scoped>
.g-desctext {
  white-space: pre-line;
}
</style>
