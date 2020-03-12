import localForage from 'localforage'
// 封装存储方法 参数分别为,数据的键key，数据的值data,
// 存储成功执行的回调函数cb,存储失败执行回调函数cb2
export function setLocalForage(key, data, cb, cb2) {
  // 调用localForage中的setItem Api传入key，value,支持promise,
  // 所以可以使用then,catch，根据存值的成功与否执行对应回调
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
// 封装读取方法 参数分别为,数据的键key，要执行的回调cb
export function getLocalForage(key, cb) {
  // 调用localForage中的getItem Api读取key，回调函数中会返回错误信息和数据，将其作为cb的参数
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}
// 封装删除方法 参数分别为,数据的键key，删除成功执行的回调函数cb,删除失败执行回调函数cb2
export function removeLocalForage(key, cb, cb2) {
  // 调用localForage中的removeItem Api传入key支持promise
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
// 封装清空数据库方法 清除成功执行的回调函数cb,清除失败执行回调函数cb2
export function clearLocalForage(cb, cb2) {
  // 调用localForage中的clear Api
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
// 封装计算数据库key长度的方法 成功则执行的回调函数cb
export function lengthLocalForage(cb) {
  // 调用localForage中的length Api，成功返回值为长度numberOfKeys
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
    }).catch(function(err) {
    if (err) {}
    // console.log(err)
  })
}
// 封装遍历数据库的方法
export function iteratorLocalForage() {
  // 调用localForage中的iterate Api
  localForage.iterate(function(value, key, iterationNumber) {
    // 打印每一个key，value
    // console.log([key, value])
  }).then(function() {
    // 遍历结束后无错误打印该行
    // console.log('Iteration has completed')
  }).catch(function(err) {
    // 遍历过程中有错，打印该行
    if (err) {}
    // console.log(err)
  })
}
// 判断是否support(支持) indexDB数据库，如果不支持，则返回false
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
