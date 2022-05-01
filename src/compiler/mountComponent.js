import Watcher from "../watcher.js"
import Vue from "../index.js"
export default function mountComponent (vm) {
  // 负责 初识渲染和后续更新组件的一个方法
  const updateComponent = () => {
    vm._update(vm._render())
  }
  new Watcher(updateComponent)
}

Vue.prototype._render = function () {
  return this.$options.render.apply(this)
}
Vue.prototype._update = function (vnode) {
  // 获取旧的vnod
  const prevVNode = this._vnode
  this._vnode = vnode
  if (!prevVNode) {
    // 没有老的 证明是第一次渲染
    this.$el = this.__patch__(this.$el, vnode)
  } else {
    // 更新
    this.$el = this.__patch__(prevVNode, vnode)
  }
  console.log(vnode);

}

