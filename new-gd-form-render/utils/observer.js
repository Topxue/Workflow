/*
 * @Author: caohao
 * @Date: 2021-03-17 14:53:25
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-17 14:53:33
 * @Description:
 */
class ObserverList {
  observerList = []
  add(obj) {
    return this.observerList.push(obj)
  }
  count() {
    return this.observerList.length
  }
  get(index) {
    if (index > -1 && index < this.observerList.length) {
      return this.observerList[index]
    }
  }
  indexOf(obj, startIndex) {
    var i = startIndex || 0
    while (i < this.observerList.length) {
      if (this.observerList[i] === obj) {
        return i
      }
      i++
    }
    return -1
  }
  removeAt(index) {
    this.observerList.splice(index, 1)
  }
}
class Subject {
  constructor() {
    this.observers = new ObserverList()
  }
  addObsever(observer) {
    this.observers.add(observer)
  }
  removeObsever(observer) {
    this.observers.removeAt(this.observers.indexOf(observer, 0))
  }
  notify(context) {
    var observerCount = this.observers.count()
    for (var i = 0; i < observerCount; i++) {
      this.observers.get(i).update(context)
    }
  }
}
export { Subject }