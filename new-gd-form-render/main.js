/*
 * @Author: caohao
 * @Date: 2020-09-27 16:43:17
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-10 14:51:19
 * @Description:
 */
import ProcessFormRender from './src/process-from-render/index'
import processNumber from './src/process-number/index'
import processSelect from './src/process-select'
import gFormItem from './src/g-form-item/index'
import gForm from './src/g-form/index'
import gInput from './src/g-input/index'
import gTextarea from './src/g-textarea/index'
import gCheckbox from './src/g-checkbox/index'
import gInputNumber from './src/g-inputNumber/index'
import gRadio from './src/g-radio/index'
import gRate from './src/g-rate/index'
import gSelect from './src/g-select/index'
import gSwitch from './src/g-switch/index'
import gTime from './src/g-time/index'
import gArea from './src/g-area/index'
import gMoney from './src/g-money/index'
import gDateRange from './src/g-date-range'
import gImgupload from './src/g-imgupload'
import gFileupload from './src/g-fileupload'
import gKitLeave from './src/g-kit-leave'
import gKitOvertime from './src/g-kit-overtime'
import gKitReplenish from './src/g-kit-replenish'
import gDept from './src/g-dept'
import gDesctext from './src/g-desctext'
import gBreadcrumb from './src/g-breadcrumb'
import gBreadcrumbItem from './src/g-breadcrumb/breadcrumb-item'
import gChildrenTable from './src/g-children-table'
import gReadonlyText from './src/g-readonly-text'

const components = [
  ProcessFormRender,
  processNumber,
  processSelect,
  gFormItem,
  gForm,
  gInput,
  gTextarea,
  gCheckbox,
  gInputNumber,
  gRadio,
  gRate,
  gSelect,
  gSwitch,
  gTime,
  gArea,
  gMoney,
  gDateRange,
  gImgupload,
  gFileupload,
  gKitLeave,
  gKitOvertime,
  gKitReplenish,
  gDept,
  gDesctext,
  gBreadcrumbItem,
  gBreadcrumb,
  gChildrenTable,
  gReadonlyText
]
const install = Vue => {
  components.forEach((item, index) => {
    if (Object.prototype.toString.call(item) === '[object Function]') {
      Vue.component(item.options.name, item)
    } else {
      Vue.component(item.name, item)
    }

  })
}
export default {
  ProcessFormRender,
  processSelect,
  gFormItem,
  gForm,
  install,
  gCheckbox,
  gInputNumber,
  gRadio,
  gRate,
  gSelect,
  gSwitch,
  gTime,
  gArea,
  gMoney,
  gDateRange,
  gImgupload,
  gFileupload,
  gKitLeave,
  gKitOvertime,
  gKitReplenish,
  gDept,
  gDesctext,
  gBreadcrumbItem,
  gBreadcrumb,
  gChildrenTable,
  gReadonlyText
}
