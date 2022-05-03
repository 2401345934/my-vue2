import Watcher from "./watcher.js"

/**
 * @description: 初始化 computed
 * @param {*} vm
 * @return {*}
 * @author: alan
 */
export default function initComputed (vm) {
  // 获取配置项
  const computed = vm.$options.computed
  // 记录 watcher
  const watcher = vm._wathcer = Object.create(null)
  // 遍历computed
  for (let k in computed) {
    watcher[k] = new Watcher(computed[k], { lazy: true }, vm)
    // 将 computed属性代理 key 到 vue 实例
    defineComputed(vm, k)
  }

}

/**
 * @description: 把计算属性代理到 vue 实例上面  结合 watcher 实现 computed
 * @param {*} vm
 * @param {*} key
 * @return {*}
 * @author: alan
 */
function defineComputed (vm, key) {
  const desciptor = {
    get: function () {
      const watcher = vm._wathcer[key]
      if (watcher.dirty) {
        // 说明没有执行过
        watcher.evalute()
      }
      return watcher.value
    },
    set: function () {
      // 不实现
    }
  }

  Object.defineProperty(vm, key, desciptor)
}