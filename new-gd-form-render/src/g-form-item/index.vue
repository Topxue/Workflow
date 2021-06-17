<template>
  <div class="g-form-item">
    <div class="lable" :style="{width:'100px',textAlign:'center'}" v-if="!hiddenLable">
      <span v-if="required" class="require_icon">*</span>
      <span>{{label ||''}}</span>
    </div>
    <slot name="cond"></slot>
    <div class="content" :class="{'errContent':!ValidatorType}">
      <slot></slot>
      <el-collapse-transition>
        <div v-if="!ValidatorType" class="error">{{errmsg}}</div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
const uuidv4 = require('uuid')
import { mutations } from '../observable/validator'
export default {
  name: 'g-form-item',
  inject: ['gform'],
  inheritAttrs: false,
  data() {
    return {
      Validator: null, // 字段的验证实例
      ValidatorType: true, // 该字段的验证状态
      errmsg: '', // 该字段的验证错误信息
      validateKey: '' // 该字段的验证key
    }
  },
  props: {
    label: {
      type: String
    },
    prop: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    // 验证的规则
    decorator: {
      type: [Object, Array],
      default: () => []
    },
    hiddenLable: Boolean
  },
  // watch: {
  //   ruleFile() {
  //     if (this.Validator) {
  //       this.validate()
  //     }
  //   },
  //   '$store.state.formTyep'(newVal, oldVal) {
  //     if (newVal === 'valueDetail' && oldVal === 'valueEdit') {
  //       this.ValidatorType = true
  //     }
  //     this.ruleWrite()
  //   },
  //   ValidatorType(newVal) {
  //     this.$parent.info._ValidatorType = newVal
  //   },
  // },
  watch: {
    ruleFile() {
      if (this.Validator) {
        this.validateFile().catch(err => console.log(err))
      }
    }
  },
  computed: {
    // 需要检验的字段
    ruleFile() {
      // if (!this.decorator || Object.keys(this.decorator).length === 0) return ''
      // let ruleFile = this.$parent.value
      // if (this.decorator.fileName !== 'value')
      //   ruleFile = this.getRuleFile(this.decorator.fileName.split('.'))
      // return ruleFile
      return this.$parent[this.prop]
    }
    // 计算一下那些组件是单行的哪些组件是两行展示的
    // mamformitem() {
    //   // 单行展示的组件的名称集合
    //   let Arr = []
    // },
  },
  // 组件注销时 删除该字段的验证实例
  destroyed() {
    // if (this.Validator) {
    //   let parent = this.$parent
    //   while (parent.$options.componentName !== 'dform') {
    //     parent = parent.$parent
    //   }
    //   let index = parent.AsyncValidatorArr.findIndex(
    //     (item) => item.validateKey === this.validateKey
    //   )
    //   parent.AsyncValidatorArr.splice(index, 1)
    // }
    /**
     * 如果该组件必填 在该组件销毁时  删除校验实例
     */
    if (this.Validator) {
      mutations.removeValidata(this.Validator)
    }
  },
  mounted() {
    this.ruleWrite()
  },
  methods: {
    // 根据$parent 获取需要检验的字段
    getRuleFile(filearr) {
      let file = this.$parent
      filearr.forEach(item => {
        file = file[item]
      })
      return file
    },
    validateFile() {
      return new Promise((resolve, reject) => {
        this.Validator.validate({ value: this.$parent[this.prop] }, errs => {
          if (!errs) {
            this.ValidatorType = true
            this.errmsg = ''
            resolve(true)
          } else {
            this.ValidatorType = false
            this.errmsg = errs[0].message
            reject(false)
          }
        })
      })
    },
    // 校验规则的填入
    ruleWrite() {
      if (!this.decorator) return
      const { AsyncValidator, AsyncValidatorArr } = this.gform
      let key = uuidv4.v4()
      let descriptor = {
        value: this.decorator
      }
      this.Validator = new AsyncValidator(descriptor) // 实例化 验证插件
      mutations.addValidate({
        key,
        label: this.label,
        validateFile: this.validateFile
      })
    }
  }
}
</script>
<style lang="scss">
.g-form-item {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  position: relative;
  .lable {
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 35px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .content {
    flex: 1;
    position: relative;
  }
  .error {
    color: #f73e3e;
    font-size: 12px;
    position: absolute;
    bottom: -16px;
    line-height: 12px;
    height: 14px;
  }
  .require_icon {
    position: absolute;
    left: -5px;
    color: #f73e3e;
  }
  .errContent {
    .el-input__inner {
      border: 1px solid #f73e3e;
    }
    .el-textarea__inner {
      border: 1px solid #f73e3e;
    }
  }
}
</style>
