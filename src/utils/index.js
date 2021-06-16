import helper from './Helper'
import { TARGET_SELECT } from '../config'

/**
 *
 * @param {*} arr
 * @returns String
 */
export const arrToStr = (arr) => {
  if (arr) {
    return arr
      .map(item => {
        return item.userName || item.label || item.labelNames
      })
      .toString()
  }
}

/**
 * @param {*} str
 * @param {*} obj
 * @returns String
 */
export const dealStr = (str, obj) => {
  let arr = []
  let list = str.split(',')
  for (let elem in obj) {
    list.map(item => {
      if (item == elem) {
        arr.push(obj[elem].value)
      }
    })
  }
  return arr.join('或')
}

/**
 * @desc Copy 人员
 * @param {*} nodeConfig
 * @returns String
 */
export const copyerStr = (nodeConfig) => {
  const actionerRules = helper.getActionerRules(nodeConfig)
  if (actionerRules.approvals?.length != 0) {
    return arrToStr(actionerRules.approvals)
  } else {
    if (actionerRules.type === TARGET_SELECT) {
      return '发起人自选'
    }
  }
}

/**
 * @desc 是否为套件
 * @param {*} item
 * @returns {Boolean}
 */
export const isKit = (item) => {
  return item.type.split('-')[0] === 'kit'
}

/***
 * @desc 异步处理 Sleep延迟调用
 * @param time
 * @returns {Promise<unknown>}
 */
export const sleep = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}
