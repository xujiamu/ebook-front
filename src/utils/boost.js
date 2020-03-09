// Without Duplicate 非重复
/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // 因为对象保存在数组中的是内存地址，这里每次传入的参数，如果之前传递过，那么地址也是相同的，就不等于-1，就不会push
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}
