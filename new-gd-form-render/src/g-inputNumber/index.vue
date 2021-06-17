<!--
 * @Author: caohao
 * @Date: 2020-09-28 14:19:58
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-10 15:41:36
 * @Description: 
-->
<template>
  <g-form-item v-bind="$attrs" :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <el-input-number
      v-model.number="value"
      controls-position="right"
      :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
      :min="dataInfo.options.min||-Infinity"
      :max="dataInfo.options.max||Infinity"
      :step="dataInfo.options.step||1"
    ></el-input-number>
    <span style="color:#606266;margin-left:10px" v-if="dataInfo.options.unit">{{dataInfo.options.unit}}</span>
  </g-form-item>
</template>
<script>
import flowchartMixin from '../mixins/flowchartMixin'
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-inputNumber',
  mixins: [valueMixin, flowchartMixin],
  created() {
    // this.dataInfo.rules = {
    //   pattern: new RegExp(/(^[1-9]([0-9]+)?(.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9].[0-9]([0-9])?$)/),
    //   message: '数字输入框格式不匹配'
    // }
    this.value = this.dataInfo.value || 0
  }
}
</script>