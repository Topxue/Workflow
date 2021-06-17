<!--
 * @Author: caohao
 * @Date: 2021-06-10 14:50:16
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-10 16:24:32
 * @Description: 只读文字的组件
-->
<template>
  <g-form-item v-bind="$attrs" :label="dataInfo.name">
    <div class="g-readonly-text">{{value}}</div>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-readonly-text',
  mixins: [valueMixin]
}
</script>
<style lang="scss" scoped>
.g-readonly-text {
  width: 100%;
  white-space: pre-line;
  text-align: center;
  padding: 10px 0;
  color: #606266;
}
</style>
