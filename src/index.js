import mount from "./compiler/index.js"
import patch from "./compiler/patch.js"
import renderHelper from "./compiler/renderHelper.js"
import { set } from "./defineReactive.js"
import initComputed from "./initComputed.js"
import initData from "./initData.js"
export default function Vue (options) {
  this._init(options)

}

Vue.prototype._init = function (options) {
  // 拿到所有的配置项 挂在 Vue 实例上
  this.$options = options
  // 处理配置项
  initData(this)
  // 初始化 computed 
  initComputed(this)
  // 挂载生成vnnode
  renderHelper(this)

  this.__patch__ = patch
  if (this.$options.el) {
    this.$mount()
  }
}

Vue.prototype.$mount = function () {
  mount(this)
}
Vue.prototype.$set = set
