/*
 * @Author: caohao
 * @Date: 2020-11-10 15:53:47
 * @LastEditors: caohao
 * @LastEditTime: 2020-11-10 16:10:15
 * @Description:
 */
/**
 * 金额转大写
 * @param {string\number} str
 */
export function number_chinese(str) {
  var num = parseFloat(str)
  var strOutput = '',
    strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  num += '00'
  var intPos = num.indexOf('.')
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (var i = 0; i < num.length; i++) {
    strOutput +=
      '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strOutput
    .replace(/零角零分$/, '整')
    .replace(/零[仟佰拾]/g, '零')
    .replace(/零{2,}/g, '零')
    .replace(/零([亿|万])/g, '$1')
    .replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿')
    .replace(/^元/, '零元')
}
/**
 * @desc 获取时间戳
 * @param {string} date
 * @returns {timestamp:Number (ms)}
 */
export const getTimeStamp = (date) => {
  return Date.parse(new Date(date))
}

/**
 * @desc 获取天/小时
 * @param {Number} timeStamp
 * @param {String} durationUnit
 * @returns {Number}
 */
export const formatDuration = (timeStamp, durationUnit) => {
  const days = +(~~(timeStamp / (1000 * 60 * 60 * 24) * 100) / 100).toFixed(1)
  const hours = parseInt(Math.floor(timeStamp / (1000 * 60 * 60)))

  return durationUnit === 'day' ? days : hours
}
