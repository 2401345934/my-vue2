import generate from "./generate.js"
import parse from "./parse.js"


// 生产渲染函数
export default function compileToFunction (template) {
  //  模版编译 ast
  const ast = parse(template)

  // 从ast 生成渲染函数
  const render = generate(ast)
  return render
}