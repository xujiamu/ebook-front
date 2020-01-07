import Storage from 'web-storage-cache'

const localStorage = new Storage()
// 增加数据
export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}
// 查询数据
export function getLocalStorage(key) {
  return localStorage.get(key)
}
// 删除数据
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}
// 删除所有数据
export function clearLocalStorage() {
  return localStorage.clear()
}
// setBookObject函数用于保存不同电子书的所有配置 filename代表不同的电子书
export function setBookObject(failName, key, value) {
  let book = getLocalStorage(`${failName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${failName}-info`, book)
}
// getBookObject函数用于取出对应电子书的所有配置
export function getBookObject(failName, key) {
  let book = getLocalStorage(`${failName}-info`)
  if (!book) {
    return null
  } else {
    return book[key]
  }
}
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}
export function saveFontFamily(fileName, font) {
  setBookObject(fileName, 'fontFamily', font)
}

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

export function getLocale() {
  return getBookObject('locale')
}
export function saveLocale(locale) {
  setBookObject('locale', 'locale', locale)
}

export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
export function saveTheme(fileName, theme) {
  return setBookObject(fileName, 'theme', theme)
}

export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
export function saveLocation (fileName, location) {
  return setBookObject(fileName, 'location', location)
}

export function getReadTime(fileName) {
  return getBookObject(fileName, 'readTime')
}
export function saveReadTime (fileName, readTime) {
  return setBookObject(fileName, 'readTime', readTime)
}
