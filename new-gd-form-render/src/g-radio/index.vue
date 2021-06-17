<!--
 * @Author: caohao
 * @Date: 2020-09-28 14:19:58
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-09 11:00:08
 * @Description: 
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <!-- <el-input-number v-model="value" controls-position="right" :min="dataInfo.options.min" :max="dataInfo.options.max" :step="dataInfo.options.step"></el-input-number> -->
    <el-radio-group v-model="value" :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false">
      <el-radio v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
    </el-radio-group>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import flowchartMixin from '../mixins/flowchartMixin'
export default {
  name: 'GRadio',
  mixins: [valueMixin, flowchartMixin],
  data() {
    return {
      options: []
    }
  },
  mounted() {
    this.getOpts()
  },
  methods: {
    getOpts() {
      // 单选框组 静态数据
      if (!this.dataInfo.options.remote) {
        this.options = this.dataInfo.options.options
      }
    }
  }
}
</script>