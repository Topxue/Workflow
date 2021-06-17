/*
 * @Author: caohao
 * @Date: 2021-03-17 14:50:40
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-17 14:50:55
 * @Description: 观察者
 */
import Vue from 'vue'

export const store = Vue.observable({
  subjects: {}
})

export const mutations = {
  addSubject(key, sub) {
    store.subjects[key] = sub
  },
}
