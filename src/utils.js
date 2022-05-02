/**
 * @description:判断是不是自闭合标签
 * @param {*} tagName
 * @return {*}
 * @author: alan
 */
export function isUnaryTag (tagName) {
  return ['input', 'img'].includes(tagName)
}




/**
 * 是否为平台保留节点
 */
export function isReserveTag (tagName) {
  const reserveTag = ['div', 'h3', 'span', 'input', 'select', 'option', 'p', 'button', 'template']
  return reserveTag.includes(tagName)
}
