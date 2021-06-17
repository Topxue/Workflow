<!--
 * @Author: your name
 * @Date: 2020-09-07 15:59:06
 * @LastEditTime: 2020-10-27 17:53:25
 * @LastEditors: caohao
 * @Description: In User Settings Edit
 * @FilePath: \cloud-oa\gd-form-render\src\g-textarea\index.vue
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <el-rate
      v-model="value"
      :allow-half="dataInfo.options.allowHalf"
      :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
      v-if="dataInfo.options.hidden"
      :max="dataInfo.options.max"
    ></el-rate>
  </g-form-item>
</template>

<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'GRate',
  mixins: [valueMixin],
}
</script>
