/**
 * 条件范围表达式 
 * 'number', 'money', 'inputNumber', 'daterange'
 */
export const condition = [
  {
    label: '小于',
    value: 'lt'
  },
  {
    label: '大于',
    value: 'gt'
  },
  {
    label: '小于等于',
    value: 'le'
  },
  {
    label: '等于',
    value: 'eq'
  },
  {
    label: '大于等于',
    value: 'ge'
  }
]

export const conditionSelect = [
  {
    label: '完全等于',
    value: 'eq'
  },
  {
    label: '包含任意',
    value: 'ge'
  }
]

/**
 * 当前组件类型
 */

export const NUMBER_COMPONENT_TYPE = ['number', 'money', 'inputNumber', 'daterange']