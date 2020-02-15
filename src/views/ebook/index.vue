<template>
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-render></ebook-render>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
  </div>
</template>

<script>
import EbookRender from '../../components/ebook/EbookRender'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookMark'
import ebookMixin from '../../utils/mixin'
import { getReadTime, saveReadTime } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  components: {
    EbookRender,
    EbookTitle,
    EbookMenu,
    EbookBookmark
  },
  watch: {
    offsetY(v) {
      if (this.bookAvailable && !this.menuVisible) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move(v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
