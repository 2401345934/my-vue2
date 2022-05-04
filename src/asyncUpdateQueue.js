// 存放全局的 wacher
const queue = []
// 是否正在被刷新
let flushing = false
// 表示 callbakc 数组中 是否已经存在一个渲染的wacher
let waiting = false
// 当前浏览器任务队列已经存在 刷新 callbacks 数组的函数
let pending = false
// 存放刷新 队列的函数
const callbacks = []
export default function queueWacher (watcher) {
  // 防止重复
  if (!queue.includes(watcher)) {
    if (!flushing) {
      // 没有被刷新入队
      queue.push(watcher)
    } else {
      // 正在被刷新
      let flag = false
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].uid < waiting.uid) {
          queue.splice(i + 1, 1, wacher)
          flag = true
          break;
        }

      }
      if (!flag) {
        queue.unshift(wacher)
      }
    }
  }


  if (!waiting) {
    // 保证只有一个刷新的 wacher 的函数
    waiting = true
    nextTick(flushSchedulerQueue)
  }

}

/**
 * @description:负责刷新 wacher 队列
 * @param {*}
 * @return {*}
 * @author: alan
 */
function flushSchedulerQueue () {
  // 正在刷新 wacher
  flushing = true
  // 把wacher 排序 从小到大 保证每个后面的wacher 是有序的
  queue.sort((a, b) => a.uid - b.uid)
  // 遍历执行
  while (queue.length) {
    // 执行第一个
    const wacher = queue.shift()
    // 简易版不做 太多处理
    wacher.run()
  }
  // 执行完毕 wacher 是kong
  flushing = false
  waiting = false

}

/**
 * @description:负责刷新 wacher 队列
 * @param {*}
 * @return {*}
 * @author: alan
 */
function nextTick (cb) {
  callbacks.push(cb)
  // 浏览器中没有刷新 callbacks 数组的函数
  if (!pending) {
    pending = true
    // 将刷新 callbacks 数组的函数放到浏览器中的异步队列中
    Promise.resolve().then(flushCallbacks)

  }
}

/**
 * @description: 负责刷新 callback 数组
 * @param {*}
 * @return {*}
 * @author: alan
 */
function flushCallbacks () {
  pending = false
  while (callbacks.length) {
    // 拿出头部
    const cb = callbacks.shift()
    // 执行 简易版不做 try catch 处理  try catch 主要防止用户的使用不合理
    cb()
  }

}