
/*
 * @Author: caohao
 * @Date: 2020-09-28 10:54:29
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-18 10:45:54
 * @Description:
 */
export default {
  data() {
    return {
      auther: {
        see: true,
        write: false,
        must: false
      },
      value: ''
    }
  },
  watch: {
    value(newVal) {
      this.dataInfo.value = newVal
    }
  },
  props: {
    dataInfo: {
      type: Object,
      default: () => { }
    },
  },
  created() {
    if (this.dataInfo.rules && Object.prototype.toString.call(this.dataInfo.rules) === "[object Array]") {
      this.dataInfo.rules = this.dataInfo.rules.map(item => {
        if (item.pattern) {
          return {
            ...item,
            pattern: eval(item.pattern)
          }
        }
        return item
      })
    }
  },
  mounted() {
    // if (this.dataInfo.type === 'checkbox') {
    //   debugger
    // }
    if (this.dataInfo.value) {
      this.value = this.dataInfo.value
    }
    if (this.dataInfo.options.defaultValue && !this.dataInfo.value && this.dataInfo.options.defaultValue.length > 0) {
      this.value = this.dataInfo.options.defaultValue
    }
  }
}
