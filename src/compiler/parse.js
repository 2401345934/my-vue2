import { isUnaryTag } from "../utils.js"
export default function parse (template) {
  // 最终返回到 ast
  let root = null
  // 备份模版
  let html = template
  // 栈
  const stack = []
  // 便利 html 字符串
  while (html.trim()) {
    // 处理异常  注释标签
    if (html.indexOf('<!--') === 0) {
      // 找到 注释标签的结束位置 -->
      const endIndex = html.indexOf('-->')
      html = html.slice(endIndex + 3)
      continue
    }
    const startIdx = html.indexOf('<')
    // 正常标签
    if (startIdx === 0) {
      // 结束标签
      if (html.indexOf('</') === 0) {
        parseEnd()
      } else {
        // 开始标签
        parseStartTag()
      }
      // 标签之前有文本
    } else if (startIdx > 0) {
      const nextStartIdx = html.indexOf('<')
      if (stack.length) {
        processChars(html.slice(0, nextStartIdx))
        // 文本节点 移除
      }
      html = html.slice(nextStartIdx)
    } else {
      // 不处理
    }
  }

  return root

  // 匹配开始标签 <div id='app' >.... </div>
  function parseStartTag () {
    // <div title="11"></div>
    // 匹配开始标签的结束位置 <div title="11"
    const endIndex = html.indexOf('>')
    // 截取开始标签的内的所有内容 div title="11"
    const content = html.slice(1, endIndex)
    // 更新html 将content 从html 上截掉
    html = html.slice(endIndex + 1)
    // 标签   属性
    let tagName = '', attrStr = ''
    // 拿到第一个空格 的索引 div title="11"
    const fitstSpaceInd = content.indexOf(" ")
    // 不存在空格 就是没有属性
    if (fitstSpaceInd === -1) {
      // 直接赋值标签 div
      tagName = content
    } else {
      // 存在  赋值 属性和标签
      //  div
      tagName = content.slice(0, fitstSpaceInd)
      //  title="11"
      attrStr = content.slice(fitstSpaceInd + 1)
    }
    // 如果存在 属性 按照 空格分组
    const attrs = attrStr ? attrStr.split(' ') : []
    // 进一步处理属性 返回一个map
    const attrMap = parseAttrs(attrs)
    // 生成ast
    const elementAst = generateAST(tagName, attrMap)
    if (!root) {
      root = elementAst
    }
    // 将 ast 对象 push 到栈中 当遇到他的结束标签 pop 出栈
    stack.push(elementAst)
    // 处理自闭和标签
    if (isUnaryTag(tagName)) {
      processElement()
    }
  }

  // 匹配开始结束
  function parseEnd () {
    // 将闭合标签 从html 字符串中移除
    html = html.slice(html.indexOf('>') + 1)
    // 进一步处理站定元素
    processElement()
  }

  // 处理标签的属性
  function processElement () {
    // 弹出栈顶元素
    const currentElement = stack.pop()
    currentElement.attr = {}
    // 进一把处 AST中的 rawAttr
    const { rawAttr } = currentElement
    const propertyArr = Object.keys(rawAttr)
    if (propertyArr.includes('v-model')) {
      // 处理v-model 指令
      processVModel(currentElement)
    } else if (propertyArr.find(item => item.match(/v-bind:(.*)/))) {
      // 处理v-bind 指令
      processVBind(currentElement, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`])
    } else if (propertyArr.find(item => item.match(/v-on:(.*)/))) {
      // 处理v-on 指令
      processVOn(currentElement, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`])
    }
    // 属性处理完成 让其和父节点产生关系
    if (stack.length) {
      stack.at(-1).children.push(currentElement)
      currentElement.parent = stack.at(-1)
    }

  }

  // 处理 v-model 指令 将结果放到 current.attr
  function processVModel (current) {

    const { attr, tag, rawAttr } = current
    const { type, 'v-model': vModelValue } = rawAttr
    if (tag === 'input') {
      if (/text/.test(type)) {
        attr.vModel = { tag, type: 'text', value: vModelValue }
      } else if (/checkbox/.test(type)) {
        attr.vModel = { tag, type: 'checkbox', value: vModelValue }
      }
    } else if (tag === 'textarea') {
      attr.vModel = { tag, value: vModelValue }
    } else if (tag === 'select') {
      attr.vModel = { tag, value: vModelValue }
    }
  }
  // 处理 v-bind 指令 将结果放到 current.attr
  function processVBind (current, key, value) {
    const attr = current.attr
    attr.vBind = {
      [key]: value
    }
  }
  // 处理 v-on 指令 将结果放到 current.attr
  function processVOn (current, key, value) {
    const attr = current.attr
    attr.vOn = {
      [key]: value
    }
  }


  // 处理文本
  function processChars (text) {
    if (!text.trim()) return
    const textAST = {
      type: 3,
      text
    }
    // 处理文本是表达式  {{text}}
    if (text.match(/{{(.*)}}/)) {
      textAST.expression = RegExp.$1.trim()
    }
    stack.at(-1).children.push(textAST)
  }


  // ast
  function generateAST (tag, attrMap) {
    return {
      // 标签类型
      type: 1,
      // 标签名称
      tag,
      // 原始属性
      rawAttr: attrMap,
      // 子节点
      children: []
    }
  }

  // parseAttrs 解析attrs 返回map格式 []
  function parseAttrs (attrs) {
    const attrMap = {}
    for (let attr of attrs) {
      // = 截取 id=1 title=2 src=3
      const [attrName, attrValue] = attr.split('=')
      attrMap[attrName] = attrValue.replace(/\"/g, '')
    }

    return attrMap

  }
}