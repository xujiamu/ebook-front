<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseStart"
         @mousemove="onMouseMove"
         @mouseup.left="onMouseEnd">
    </div>
  </div>
</template>

<script>
import ebookMixin from '../../utils/mixin'
import Epub from 'epubjs'
import { saveFontSize,
  getFontSize,
  saveFontFamily,
  getFontFamily,
  getTheme,
  saveTheme,
  getLocation } from '../../utils/localStorage'
import { flatten } from '../../utils/book'
import { getLocalForage } from '../../utils/localForage'

export default {
  mixins: [ebookMixin],
  methods: {
    onMouseStart(e) {
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 100) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMaskClick(e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) return
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    move(e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd(e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    // 初始化主题
    initTheme() {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
        this.rendition.themes.select(defaultTheme)
      })
    },
    // 初始化字号
    initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (fontSize) {
        this.setDefaultFontSize(fontSize)
        this.rendition.themes.fontSize(fontSize)
      } else {
        this.rendition.themes.fontSize(this.defaultFontSize)
        saveFontSize(this.fileName, this.defaultFontSize)
      }
    },
    // 初始化字体
    initFontFamily () {
      let font = getFontFamily(this.fileName)
      if (font) {
        this.setDefaultFontFamily(font)
        if (font === 'Default') font = 'Times New Roman'
        this.rendition.themes.font(font)
      } else {
        this.rendition.themes.font('Times New Roman')
        saveFontFamily(this.fileName, this.defaultFontFamily)
      }
    },
    // 初始化渲染
    initRendition() {
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        method: 'default'
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontSize()
        this.initFontFamily()
        this.initGlobalStyle()
      })
      this.rendition.hooks.content.register(contents => {
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
      })
    },
    // 初始化手势
    initGesture() {
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        if (time < 500 && offsetX > 40) {
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault()
        event.stopPropagation()
      })
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    parseBook() {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find(item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub(url) {
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture()
      this.parseBook()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        this.navigation.forEach(nav => {
          nav.pagelist = []
        })
        locations.forEach(item => {
          const loc = item.match(/\[(.*)\]!/)[1]
          this.navigation.forEach(nav => {
            if (nav.href) {
              const href = nav.href.match(/^(.*)\.html$/)
              if (href) {
                if (href[1] === loc) {
                  nav.pagelist.push(item)
                }
              }
            }
          })
          let currentPage = 1
          this.navigation.forEach((nav, index) => {
            if (index === 0) {
              nav.page = 1
            } else {
              nav.page = currentPage
            }
            currentPage += nav.pagelist.length
          })
        })
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted () {
    // 获取路由中的filterName值
    const books = this.$route.params.fileName.split('|')
    // 获取书名，第0个元素是分类名
    const fileName = books[1]
    // 根据书名向indexDB中查找
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        // 如果数据库存在指定图书数据，则在保存fileName变量后，初始化电子书
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        // 不存在则在线下载
        this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
          this.initEpub(`${process.env.VUE_APP_EPUB_URL}/${this.fileName}.epub`)
        })
      }
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../assets/styles/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow:hidden;
  .ebook-reader-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 150;
    top: 0;
    left: 0;
    background: transparent;
  }
}
</style>
