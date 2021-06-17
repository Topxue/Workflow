<!--
 * @Author: your name
 * @Date: 2020-09-07 15:59:06
 * @LastEditTime: 2020-12-07 15:11:58
 * @LastEditors: caohao
 * @Description: In User Settings Edit
 * @FilePath: \cloud-oa\gd-form-render\src\g-textarea\index.vue
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <el-time-picker
      :is-range="dataInfo.options.isRange"
      v-model="value"
      range-separator="至"
      :readonly="dataInfo.options.readonly"
      ::disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
      :editable="dataInfo.options.editable"
      :start-placeholder="dataInfo.options.startPlaceholder"
      :end-placeholder="dataInfo.options.endPlaceholder"
      :format="dataInfo.options.format"
      :value-format="dataInfo.options.valueFormat"
      placeholder="选择时间范围"
    ></el-time-picker>
  </g-form-item>
</template>

<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'GTime',
  mixins: [valueMixin],
}
</script>
