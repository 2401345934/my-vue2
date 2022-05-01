
import compileToFunction from "./compileToFunction.js"
import mountComponent from "./mountComponent.js"
/**
 * @description:  编译器
 * @param {*} vm
 * @return {*}
 * @author: alan
 */
export default function mount (vm) {

  if (!vm.$options.render) {
    let { el, template = '' } = vm.$options
    if (template) {  // 存在 template
      // 如果有 template 就直接用写的
      template = template
    } else if (el) { // 挂载
      // 拿到挂载节点的所有元素
      vm.$el = document.querySelector(el)
      template = vm.$el.outerHTML
    }

    // 生成渲染函数
    const render = compileToFunction(template)
    // 将渲染函数挂载到 $options
    vm.$options.render = render
  }

  mountComponent(vm)
}