/**
 * @description:生成指定的的虚拟dom
 * @param {*} tag 标签名
 * @param {*} attr 属性对象
 * @param {*} children 子节点
 * @param {*} context 上下文
 * @param {*} text 文本节点 ast
 * @return {*}
 * @author: alan
 */
export default function vNode (tag, attr, children, context = null, text = null) {
  return {
    tag,
    attr,
    children,
    context,
    text,
    // 当前节点的父节点 真实 的dom
    parent: null,
    // 当前节点的真实节点
    elm: null,
  }
}