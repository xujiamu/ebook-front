import { getLocalStorage, getBookShelf, saveBookShelf } from './localStorage'

export function removeFromBookShelf(book) {
  // 得到本地存储中的所有图书，将其与当前book进行比较，相同图书被过滤掉
  return getBookShelf().filter(item => {
    if (item.itemList) {
      // 如果是分组则递归分组
      item.itemList = item.itemList.filter(subItem => {
        return subItem.fileName !== book.fileName
      })
    }
    return item.fileName !== book.fileName
  })
}

export function addToShelf (book) {
  // 得到本地存储中的图书列表
  let shelfList = getBookShelf()
  // 删除列表最后的 加
  shelfList = removeAddFromShelf(shelfList)
  // 将传入的图书对象 类型设为1
  book.type = 1
  // 将其放到列表的最后
  shelfList.push(book)
  // 重新计算列表id
  shelfList = computeId(shelfList)
  // 把 加 添加回来
  shelfList = appendAddToShelf(shelfList)
  // 保存图书列表到本地存储
  saveBookShelf(shelfList)
}

export function flatBookList(bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}

export function findBook(fileName) {
  const bookList = getLocalStorage('shelf')
  return flatBookList(bookList).find(item => item.fileName === fileName)
}

// 翻转卡配置数据
export const flipCardList = [
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/gift-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/gift-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 100,
    rotateDegree: 0
  },
  {
    r: 74,
    g: 171,
    _g: 171,
    b: 255,
    imgLeft: 'url(' + require('@/assets/images/compass-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/compass-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 99,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 198,
    _g: 198,
    b: 102,
    imgLeft: 'url(' + require('@/assets/images/star-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/star-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 98,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/heart-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/heart-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 97,
    rotateDegree: 0
  },
  {
    r: 59,
    g: 201,
    _g: 201,
    b: 22,
    imgLeft: 'url(' + require('@/assets/images/crown-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/crown-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 96,
    rotateDegree: 0
  }
]
// 图书类别与数字的映射
export const categoryList = {
  'ComputerScience': 1,
  'SocialSciences': 2,
  'Economics': 3,
  'Education': 4,
  'Engineering': 5,
  'Environment': 6,
  'Geography': 7,
  'History': 8,
  'Laws': 9,
  'LifeSciences': 10,
  'Literature': 11,
  'Biomedicine': 12,
  'BusinessandManagement': 13,
  'EarthSciences': 14,
  'MaterialsScience': 15,
  'Mathematics': 16,
  'MedicineAndPublicHealth': 17,
  'Philosophy': 18,
  'Physics': 19,
  'PoliticalScienceAndInternationalRelations': 20,
  'Psychology': 21,
  'Statistics': 22
}

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ComputerScience'
    case 2:
      return 'SocialSciences'
    case 3:
      return 'Economics'
    case 4:
      return 'Education'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Psychology'
    case 22:
      return 'Statistics'
  }
}

export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.computerScience')
    case 2:
      return vue.$t('category.socialSciences')
    case 3:
      return vue.$t('category.economics')
    case 4:
      return vue.$t('category.education')
    case 5:
      return vue.$t('category.engineering')
    case 6:
      return vue.$t('category.environment')
    case 7:
      return vue.$t('category.geography')
    case 8:
      return vue.$t('category.history')
    case 9:
      return vue.$t('category.laws')
    case 10:
      return vue.$t('category.lifeSciences')
    case 11:
      return vue.$t('category.literature')
    case 12:
      return vue.$t('category.biomedicine')
    case 13:
      return vue.$t('category.businessandManagement')
    case 14:
      return vue.$t('category.earthSciences')
    case 15:
      return vue.$t('category.materialsScience')
    case 16:
      return vue.$t('category.mathematics')
    case 17:
      return vue.$t('category.medicineAndPublicHealth')
    case 18:
      return vue.$t('category.philosophy')
    case 19:
      return vue.$t('category.physics')
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return vue.$t('category.psychology')
    case 22:
      return vue.$t('category.statistics')
  }
}
// 对列表的id进行更新
export function computeId(list) {
  return list.map((book, index) => {
  //  id从1开始计算 等于3时ID永远为-1
    if (book.type !== 3) {
      book.id = index + 1
      // 对于分组，同样需要更新id
      if (book.itemList) {
        // 递归调用computeId方法
        book.itemList = computeId(book.itemList)
      }
    }
    return book
  })
}
// 添加add数据(类型为3的数据，对应书架中显示的添加图书一栏)
export function appendAddToShelf(list) {
  list.push({
    id: -1,
    type: 3
  })
  return list
}
// 删除add数据
export function removeAddFromShelf(list) {
  return list.filter(item => item.type !== 3)
}
// 跳转到书城首页,需要传入vue实例
export function gotoStoreHome(vue) {
  // 使用vueRouter push方法进行路由跳转
  vue.$router.push({
    path: '/store/home'
  })
}

// 跳转到详情页
export function gotoBookDetail(vue, book) {
  vue.$router.push({
    path: '/store/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}
