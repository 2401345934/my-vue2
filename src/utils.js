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
 * @description: 判断组件标签是不是平台保留标签
 * @param {*} tagName
 * @return {*}
 * @author: alan
 */
export function isReserveTag (tagName) {
  return ["div", "p", "img", "video", "h1", "h2", "h3", "h4", "h5", "h6", "br", "a", "input", "select", 'button', 'template', 'span', 'option'].includes(tagName)
}

