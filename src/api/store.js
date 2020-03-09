import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function home() {
  return axios({
    methods: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}
export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function shelf () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function download (book, onSuccess, onError, onProgress) {
  // 如果未传入onProgress回调，则将第三个参数作为onProgress的值
  if (!onProgress) {
    onProgress = onError
    // 将原有onError至为null
    onError = null
  }
  // 因为下载电子书请求具有通用配置，所以创建axios实例
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    // 电子书响应类型是二进制对象
    responseType: 'blob',
    timeout: 180 * 1000,
    // 该属性能够监听下载时的进度条
    onDownloadProgress: progressEvent => {
      // 如果onProgress回调存在，则执行回调，并将监听到的事件传入
      if (onProgress) onProgress(progressEvent)
    }
    // 使用book对象中的categoryText 和 fileName加上.epub后缀进行拼接，即可得到指定图书的url
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      // 将数据传入Blob中，新建一个blob实例
      const blob = new Blob([res.data])
      // 保存到indexDB中
      setLocalForage(book.fileName, blob, book => {
        // 保存成功则将电子书（blod数据）传入成功回调
        if (onSuccess) onSuccess(book)
      }, err => {
        // 保存失败则将失败信息传入失败回调
        if (onError) onError(err)
      })
    }).catch(err => {
      console.log(err)
      // 如果数据请求失败，捕获异常，并执行回调
      if (onError) onError(err)
    })
}
