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