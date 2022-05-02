import vNode from "./vnode.js"
/**
 * @description:
 * @param {*} target vue 实例
 * @return {*}
 * @author: alan
 */
export default function renderHelper (target) {
  target._c = createElement
  target._v = createTextNode
  target._t = renderSlot

}

/**
 * @description: 指定标签创建文本节点 虚拟doem
 * @param {*} tag
 * @param {*} attr
 * @param {*} children
 * @return {*}
 * @author: alan
 */
function createElement (tag, attr, children) {
  return vNode(tag, attr, children, this)
}
/**
 * @description: 创建文本节点 虚拟doem
 * @param {*} textAst
 * @return {*}
 * @author: alan
 */
function createTextNode (textAst) {
  return vNode(null, null, null, this, textAst)

}

/**
 * @description: 生成插槽的 vnode  解析插槽
 * @param {*} attr
 * @param {*} children
 * @return {*}
 * @author: alan
 */
function renderSlot (attr, children) {
  const parentAttr = this._parentVnode.attr
  let vnode = null

  if (parentAttr.scopedSlots) {
    // 有插槽信息
    const slotName = attr.name
    const slotInfo = parentAttr.scopedSlots[slotName]
    this[slotInfo.scopeSlot] = this[Object.keys(attr.vBind)[0]]
    vnode = genVNode(slotInfo.children, this)
  } else {
    // 无插槽信息
    vnode = genVNode(children, this)
  }
  if (children.length === 1) return vnode[0]
  return createElement.call(this, 'div', {}, vnode)

}
/**
 * 将一批 ast 节点(数组)转换成 vnode 数组
 * @param {Array<Ast>} childs 节点数组
 * @param {*} vm 组件实例
 * @returns vnode 数组
 */
function genVNode (childs, vm) {
  const vnode = []
  for (let i = 0, len = childs.length; i < len; i++) {
    const { tag, attr, children, text } = childs[i]
    if (text) { // 文本节点
      if (typeof text === 'string') { // text 为字符串
        // 构造文本节点的 AST 对象
        const textAst = {
          type: 3,
          text,
        }
        if (text.match(/{{(.*)}}/)) {
          // 说明是表达式
          textAst.expression = RegExp.$1.trim()
        }
        vnode.push(createTextNode.call(vm, textAst))
      } else { // text 为文本节点的 ast 对象
        vnode.push(createTextNode.call(vm, text))
      }
    } else { // 元素节点
      vnode.push(createElement.call(vm, tag, attr, genVNode(children, vm)))
    }
  }
  return vnode
}

