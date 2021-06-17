/*
 * @Author: caohao
 * @Date: 2021-03-17 14:49:28
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-17 14:49:40
 * @Description: 自定义表单组件的校验响应式对象
 */

import Vue from 'vue'

export const store = Vue.observable({
  AsyncValidatorArr: []
})

export const mutations = {
  addValidate(validator) {
    store.AsyncValidatorArr.push(validator)
  },
  removeValidata(validatorKey) {
    let index = store.AsyncValidatorArr.findIndex(item => item.validateKey === validatorKey)
    store.AsyncValidatorArr.splice(index, 1)
  }
}
