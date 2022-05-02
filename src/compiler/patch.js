import { isReserveTag } from "../utils.js"
import Vue from "../index.js"

/**
 * 初始渲染和后续更新的入口
 * @param {VNode} oldVnode 老的 VNode
 * @param {VNode} vnode 新的 VNode
 * @returns VNode 的真实 DOM 节点
 */
export default function patch (oldVnode, vnode) {
  if (oldVnode && !vnode) {
    // 老节点存在，新节点不存在，则销毁组件
    return
  }
  if (!oldVnode) { // oldVnode 不存在，说明是子组件首次渲染
    createElm(vnode)
  } else {
    if (oldVnode.nodeType) { // 真实节点，则表示首次渲染根组件
      // 父节点，即 body
      const parent = oldVnode.parentNode
      // 参考节点，即老的 vnode 的下一个节点 —— script，新节点要插在 script 的前面
      const referNode = oldVnode.nextSibling
      // 创建元素
      createElm(vnode, parent, referNode)
      // 移除老的 vnode
      parent.removeChild(oldVnode)
    } else {
      console.log('update')
    }
  }
  return vnode.elm
}


/**
 * 创建元素
 * @param {*} vnode VNode
 * @param {*} parent VNode 的父节点，真实节点
 * @returns
 */
function createElm (vnode, parent, referNode) {
  // 记录节点的父节点
  vnode.parent = parent
  // 创建自定义组件，如果是非组件，则会继续后面的流程
  if (createComponent(vnode)) return

  const { attr, children, text } = vnode
  if (text) { // 文本节点
    // 创建文本节点，并插入到父节点内
    vnode.elm = createTextNode(vnode)
  } else { // 元素节点
    // 创建元素，在 vnode 上记录对应的 dom 节点
    vnode.elm = document.createElement(vnode.tag)
    // 给元素设置属性
    setAttribute(attr, vnode)
    // 递归创建子节点
    for (let i = 0, len = children.length; i < len; i++) {
      createElm(children[i], vnode.elm)
    }
  }
  // 如果存在 parent，则将创建的节点插入到父节点内
  if (parent) {
    const elm = vnode.elm
    if (referNode) {
      parent.insertBefore(elm, referNode)
    } else {
      parent.appendChild(elm)
    }
  }
}


/**
 * 创建自定义组件
 * @param {*} vnode
 */
function createComponent (vnode) {
  if (vnode.tag && !isReserveTag(vnode.tag)) { // 非保留节点，则说明是组件
    // 获取组件配置信息
    const { tag, context: { $options: { components } } } = vnode
    if (components) {
      const compOptions = components[tag]
      const compIns = new Vue(compOptions)
      // 将父组件的 VNode 放到子组件的实例上
      compIns._parentVnode = vnode
      // 挂载子组件
      compIns.$mount()
      // 记录子组件 vnode 的父节点信息
      compIns._vnode.parent = vnode.parent
      // 将子组件添加到父节点内
      vnode.parent.appendChild(compIns._vnode.elm)
      return true
    }
  }
}


/**
 * @description: 给节点设置属性
 * @param {*} attr
 * @param {*} vnode
 * @return {*}
 * @author: alan
 */
function setAttribute (attr, vnode) {
  // "{"id":"app"}"
  for (let name in attr) {
    if (name === 'vModel') {
      setVModel(vnode.tag, attr.vModel.value, vnode)
    } else if (name === 'vBind') {
      setVBind(vnode)
    } else if (name === 'vOn') {
      setVOn(vnode)
    } else {
      vnode.elm.setAttribute(name, attr[name])
    }
  }
}

/**
 * @description:  v-model
 * @param {*}
 * @return {*}
 * @author: alan
 */
function setVModel (tag, value, vnode) {
  const { elm, context: vm } = vnode
  if (tag === 'select') {
    /**
     * @description: 一开始 options 没有创建 走异步处理 让其子节点渲染出来 在设置
     * @param {*}
     * @return {*}
     * @author: alan
     */
    Promise.resolve().then(() => {
      // 下拉框
      elm.value = vm[value]
      elm.addEventListener("change", function () {
        vm[value] = elm.value
      })
    })
  } else if (tag === 'input' && vnode.elm.type === 'text') {
    // 输入框
    elm.value = vm[value]
    elm.addEventListener("input", function () {
      vm[value] = elm.value
    })
  } else if (tag === 'input' && vnode.elm.type === 'checkbox') {
    // 多选款
    elm.checked = vm[value]
    elm.addEventListener("change", function () {
      vm[value] = elm.checked
    })

  }
}
/**
 * @description: v-bind
 * @param {*}
 * @return {*}
 * @author: alan
 */
function setVBind (vnode) {
  const { attr: { vBind }, elm, context: vm } = vnode
  for (let attrName in vBind) {
    elm.setAttribute(attrName, vm[vBind[attrName]])
    elm.removeAttribute(`v-bind:${attrName}`)
  }
}
/**
 * @description: v-on
 * @param {*}
 * @return {*}
 * @author: alan
 */
function setVOn (vnode) {
  const { attr: { vOn }, elm, context: vm } = vnode
  for (let eventName in vOn) {
    elm.addEventListener(eventName, function (...rest) {
      vm.$options.methods[vOn[eventName]].apply(vm, rest)
    })
  }
}


/**
 * 创建文本节点
 * @param {*} textVNode 文本节点的 VNode
 */
function createTextNode (textVNode) {
  let { text } = textVNode, textNode = null
  if (text.expression) {
    // 存在表达式，这个表达式的值是一个响应式数据
    const value = textVNode.context[text.expression]
    textNode = document.createTextNode(typeof value === 'object' ? JSON.stringify(value) : String(value))
  } else {
    // 纯文本
    textNode = document.createTextNode(text.text)
  }
  return textNode
}

