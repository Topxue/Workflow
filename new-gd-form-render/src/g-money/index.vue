<!--
 * @Author: caohao
 * @Date: 2020-11-10 15:50:32
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-10 21:06:57
 * @Description: 金额 转大小写
-->
<template>
  <div>
    <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
      <input
        type="text"
        :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
        :value="inpNum"
        class="gd-input"
        :class="{'gd-input-disable':dataInfo.options.disabled|| dataInfo.options.writeable===false}"
        @input="change"
        @change="change"
      />
      <div v-if="dataInfo.options.iscapital">
        <span style="color:#606266">大写：</span>
        <span style="color:#606266">{{number_chinese(inpNum)}}</span>
      </div>
    </g-form-item>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import flowchartMixin from '../mixins/flowchartMixin'
import { number_chinese } from '../../utils/index.js'
export default {
  name: 'GMoney',
  mixins: [valueMixin, flowchartMixin],
  data() {
    return {
      number_chinese
    }
  },
  computed: {
    inpNum() {
      return this.value
    }
  },
  methods: {
    change(event) {
      let val = event.target.value.trim()
      if (/^\d*\.{0,1}\d{0,2}$/.test(val)) {
        this.value = val
      } else {
        event.target.value = this.value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/style/variables.scss';
</style>