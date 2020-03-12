import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToShelf, removeAddFromShelf, computeId } from './store'
import { shelf } from '../api/store'

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    // 展示电子书详情页面
    showBookDetail(book) {
      // 路由跳转  this代表vue实例
      gotoBookDetail(this, book)
    },
    // 获取书架列表数据
    getShelfList() {
      // 如果本地存储中存在数据使用本地存储，反之则调用接口获取默认数据
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            // 调用添加add数据方法
            shelfList = appendAddToShelf(response.data.bookList)
            // 保存到本地存储
            saveBookShelf(shelfList)
            // 将其保存到vuex, 这里使用return是为了方便getCategoryList使用，return的是一个promise对象
            return this.setShelfList(shelfList)
          }
        })
      } else {
        // 将其保存到vuex, 这里使用return是为了方便getCategoryList使用，return的是一个promise对象
        return this.setShelfList(shelfList)
      }
    },
    // 获取分组列表数据
    getCategoryList(title) {
      // 因为之后的操作是基于 ShelfList的数据处理的，所以这里需要在then中写之后的代码
      this.getShelfList().then(() => {
        // 进行过滤，取出对应名称的分组数据，第一个全等确保了分组，第二个全等确保了名称
        // 注意： 因为最终结果返回的类型是数组，这里我们只需要指定的数据对象，所以再取[0]
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        // 进行保存
        this.setShelfCategory(categoryList)
      })
    },
    async moveOutOfGroup (f) {
      // 保存图书列表
      this.setShelfList(
        // 遍历图书列表
        this.shelfList.map(book => {
          // 如果是分组
          if (book.type === 2 && book.itemList) {
            // 则将该分组中所有未被选中的内容提取出来重新赋值
            book.itemList = book.itemList.filter(subBook => !subBook.selected)
          }
          // 返回新的book元素
          return book
        })).then(() => {
        /*
        //  删除书架中 加 元素，并返回更改后的列表
        let list = removeAddFromShelf(this.shelfList)
        // 将选中的图书与列表合并，得到新列表
        list = [].concat(list, ...this.shelfSelected)
        // 在新列表最后增加 加 元素，并更新赋值
        list = appendAddToShelf(list)
        // 更新id
        list = computeId(list)
        console.log(list)
        // 保存到vuex
        this.setShelfList(list).then(() => {
          console.log(this.shelfList)
          // 保存数据列表到本地存储
          saveBookShelf(this.shelfList)
          // 关闭修改模式
          this.setIsEditMode(false)
          // 弹出消息框
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          // 如果回调存在，则调用
          if (f) f()
        })
        */
        const list = computeId(appendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flipCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlipCardVisible'
    ]),
    // 展示电子书详情页面
    showBookDetail(book) {
      // 路由跳转  this代表vue实例
      gotoBookDetail(this, book)
    }
  }
}

const mixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation.start && currentLocation.start.index) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    display(target, callBack) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (callBack) callBack()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (callBack) callBack()
        })
      }
    },
    hideTitleAndMenu() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}

export default mixin
