/**
 * @description:  从 ast 对象生成渲染函数 解析完成开始渲染
 * @param {*} el
 * @return {*}
 * @author: alan
 */
export default function generate (el) {
  const renderStr = getElement(el)
  // 通过new funcitn 字符串转换成可执行函数  通过 whit 给渲染函数 拓展作用域连
  return new Function(`with(this){ return ${renderStr}}`)
}

/**
 * @description: _c
 * @param {*} el
 * @return {*}
 * @author: alan
 */
function getElement (el) {
  const { tag, rawAttr, attr } = el
  const attrs = { ...rawAttr, ...attr }
  const children = genChildren(el)

  return `_c('${tag}',${JSON.stringify(attrs)},[${children}])`

}

/**
 * @description: 处理 ast 子节点
 * @param {*} el
 * @return {*}
 * @author: alan
 */
function genChildren (el) {
  const result = [], { children } = el;
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (child.type === 3) {
      // 文本节点
      result.push(`_v(${JSON.stringify(child)})`)
    } else if (child.type === 1) {
      // 元素节点
      result.push(getElement(child))
    }
  }
  return result
}
