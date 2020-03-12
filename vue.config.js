// app参数可以理解为一个封装好的ajax url 请求地址，data模拟的数据
/*
function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')
*/
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    /*
    // 在服务内部的所有其他中间件之前，提供执行自定义中间件的功能。
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
    */
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    }
  }
}
