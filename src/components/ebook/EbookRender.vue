<template>
  <div id="read"></div>
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

export default {
  mixins: [ebookMixin],
  methods: {
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
        this.rendition.prev()
        this.hideTittleAndMenu()
        this.refreshLocation()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next()
        this.hideTittleAndMenu()
        this.refreshLocation()
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTittleAndMenu() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    initEpub(url) {
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) *
          (getFontSize(this.fileName) / 16))
      }).then(locations => {
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted () {
    this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
      this.initEpub(`${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`)
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../assets/styles/global";
</style>
