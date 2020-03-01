import Mock from 'mockjs'
// 引入数据文件
// 首页
import home from './bookHome'
// 书架
import shelf from './bookShelf'
// 图书列表
import list from './bookList'
// 用于查询图书
import flatList from './bookFlatList'
// 参数为：url地址(可以使用正则)， 请求类型， 数据模板
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flap-list/, 'get', flatList)
