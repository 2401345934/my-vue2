import queueWacher from "./asyncUpdateQueue.js"
import { popTarget, pushTarget } from "./dep.js"

// wacher顺序
let uid = 0
/**
 * @param {*} cb 回调函数，负责更新 DOM 的回调函数
 */
export default function Watcher (cb, options = {}, vm = null) {
  this.uid = uid++
  // 备份 cb 函数
  this._cb = cb
  this.options = options
  !options.lazy && this.get()
  this.vm = vm
  // 计算属性实现 缓存
  this.dirty = true
  // 纪录 cb 执行结果
  this.value = null
}

Watcher.prototype.get = function () {
  // 赋值 Dep.target
  pushTarget(this)
  // 执行 cb 函数，cb 函数中会发生 vm.xx 的属性读取，进行依赖收集
  this.value = this._cb.apply(this.vm)
  // 依赖收集完成，Dep.target 重新赋值为 null，防止重复收集
  popTarget()
}

/**
 * 响应式数据更新时，dep 通知 watcher 执行 update 方法，
 * 让 update 方法执行 this._cb 函数更新 DOM
 */
Watcher.prototype.update = function () {
  if (this.options.lazy) {
    this.dirty = true
  } else {
    queueWacher(this)
  }
}

Watcher.prototype.evalute = function () {
  // 触发计算
  this.get()
  this.dirty = false
}



Watcher.prototype.run = function () {
  this.get()
}