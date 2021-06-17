<!--
 * @Author: caohao
 * @Date: 2020-09-27 17:19:12
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-17 15:15:37
 * @Description: 
-->
<template>
  <div class="g-form">
    <slot></slot>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator'
import { store } from '../observable/validator'
export default {
  name: 'g-form',
  componentName: 'gform',
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },
  provide() {
    return {
      gform: this
    }
  },
  computed: {
    AsyncValidatorArr() {
      return store.AsyncValidatorArr
    }
  },
  data() {
    return {
      AsyncValidator: AsyncValidator
    }
  },
  methods: {
    validate(callback) {
      Promise.all(this.AsyncValidatorArr.map(item => item.validateFile()))
        .then(res => {
          callback(res)
        })
        .catch(err => {
          if (err instanceof Array) {
            console.log('表单校验未通过，请检查表单')
          } else {
            console.log(err)
          }
        })
    }
  }
}
</script>