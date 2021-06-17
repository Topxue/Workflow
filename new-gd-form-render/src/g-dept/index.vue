<!--
 * @Author: caohao
 * @Date: 2021-03-23 14:50:03
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-18 11:26:32
 * @Description: 
-->
<template>
  <div class="g-user" v-if="show">
    <g-form-item :decorator="dataInfo.rules" prop="checkDept" :label="dataInfo.name" :required="dataInfo.options.required">
      <el-input readonly placeholder="请选择" @focus="checkUser" v-model="label" :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false">
        <i slot="suffix" class="el-input__icon el-icon-user"></i>
      </el-input>
    </g-form-item>
    <g-help
      @on-confirm="handleconfirm"
      v-model="checkDept"
      v-bind="$attrs"
      :isSelf="dataInfo.options.isSelf"
      type="dept"
      title="选择部门"
      :multiple="dataInfo.options.multiple"
      :dialogVisible.sync="dialogVisible"
      v-if="dialogVisible"
      v-on="$listeners"
    ></g-help>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import flowchartMixin from '../mixins/flowchartMixin'
export default {
  name: 'g-dept',
  mixins: [valueMixin, flowchartMixin],
  components: {},
  data() {
    return {
      dialogVisible: false,
      checkDept: [],
      show: true
    }
  },
  watch: {
    checkDept: {
      handler(val) {
        this.value = val
      },
      deep: true
    },
    'dataInfo.value': {
      handler(newVal) {
        this.checkDept = newVal
      },
      deep: true
    }
  },
  computed: {
    label() {
      return this.checkDept.map(item => item.label).join(',') || ''
    }
  },
  mounted() {
    if (this.dataInfo.value && this.dataInfo.value.length > 0) {
      this.checkDept = this.dataInfo.value
    }
  },
  methods: {
    checkUser() {
      this.dialogVisible = true
    },
    handleconfirm() {
      // alert(111)
    }
  }
}
</script>
