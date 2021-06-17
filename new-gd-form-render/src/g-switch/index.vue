
<!--
 * @Author: your name
 * @Date: 2020-09-07 15:59:06
 * @LastEditTime: 2020-10-27 17:53:44
 * @LastEditors: caohao
 * @Description: In User Settings Edit
 * @FilePath: \cloud-oa\gd-form-render\src\g-textarea\index.vue
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <el-switch v-model="value" :required="dataInfo.options.required" :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"></el-switch>
  </g-form-item>
</template>

<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'GSwitch',
  mixins: [valueMixin],
}
</script>
