<!--
 * @Author: your name
 * @Date: 2020-09-07 14:47:34
 * @LastEditTime: 2020-10-27 17:52:51
 * @LastEditors: caohao
 * @Description: In User Settings Edit
 * @FilePath: \cloud-oa\gd-form-render\src\g-input\index.vue
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <el-input
      v-model="value"
      :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
      :placeholder="dataInfo.options.placeholder"
      :maxlength="dataInfo.options.maxlength"
      :clearable="dataInfo.options.clearable"
    ></el-input>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'GInput',
  mixins: [valueMixin],
}
</script>

