/*
 * @Author: caohao
 * @Date: 2021-03-18 11:08:34
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-20 13:54:48
 * @Description: 观察者模式mixins  计算属性/ 组件通宵
 */
import { Subject } from '../../utils/observer'
import { store, mutations } from '../observable/subject'
export default {
  computed: {
    subjects() {
      return store.subjects
    }
  },
  created() {
    // 当前组件为目标者的逻辑
    if (this.dataInfo.options.subject) {

      mutations.addSubject(this.dataInfo.model, new Subject())
    }
    // 当前组件为观察者的逻辑
    if (this.dataInfo.options.isObserve) {

      let updateServe = this.updatedServer()
      this.dataInfo.options.subjectKeys.forEach(item => {
        this.subjects[item].addObsever(new updateServe())
      })

    }
  },
  watch: {
    'dataInfo.value'(val) {
      // 当前组件为目标者的逻辑 
      if (this.dataInfo.options.subject) {
        this.subjects[this.dataInfo.model].notify(val)
      }
    }
  },
  methods: {
    updatedServer() {
      let that = this
      return function () {
        this.update = function (context) {
          that.dataInfo.options.type = 'datetimerange'
        }
      }
    }
  }

}