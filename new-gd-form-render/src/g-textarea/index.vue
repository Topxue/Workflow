<!--
 * @Author: your name
 * @Date: 2020-09-07 15:59:06
 * @LastEditTime: 2020-10-27 17:53:51
 * @LastEditors: caohao
 * @Description: In User Settings Edit
 * @FilePath: \cloud-oa\gd-form-render\src\g-textarea\index.vue
-->
<template>
  <g-form-item :decorator="dataInfo.rules" :label="dataInfo.name" prop="value" :required="dataInfo.options.required">
    <el-input
      v-model="value"
      type="textarea"
      :placeholder="dataInfo.options.placeholder"
      :maxlength="dataInfo.options.maxlength"
      :clearable="dataInfo.options.clearable"
      :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
    ></el-input>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'GTextarea',
  mixins: [valueMixin],
}
</script>
