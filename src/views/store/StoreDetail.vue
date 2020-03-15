<template>
  <div class="book-detail">
    <detail-title @back="back"
                  :showShelf="true"
                  ref="title"></detail-title>
    <scroll class="content-wrapper"
            :top="42"
            :bottom="52"
            @onScroll="onScroll"
            ref="scroll">
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"></book-info>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="read(item)">
              <div class="book-detail-content-navigation-text"
                   :class="{'is-sub': item.deep> 1}"
                   :style="itemStyle(item)"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <!-- 根据是否在书架列表中的计算属性，来决定展示的文字和图标 -->
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
import DetailTitle from '../../components/detail/DetaiTitle'
import BookInfo from '../../components/detail/BookInfo'
import Scroll from '../../components/common/Scroll'
import Toast from '../../components/common/Toast'
import { detail } from '../../api/store'
import { px2rem, realPx } from '../../utils/utils'
import { getLocalForage } from '../../utils/localForage'
// 这里使用了两个混入一个用于获取图书列表，一个用于控制翻转卡片页面
// 最新： 使用一个混入即可，翻转卡片的方法，在storeShelfMixin里面也注册了，所以可以省略为一个混入
import { storeShelfMixin } from '../../utils/mixin'
import { getBookShelf, saveBookShelf } from '../../utils/localStorage'
import { removeFromBookShelf, addToShelf } from '../../utils/store'
import Epub from 'epubjs'

global.ePub = Epub

export default {
  mixins: [storeShelfMixin],
  components: {
    DetailTitle,
    Scroll,
    BookInfo,
    Toast
  },
  computed: {
    desc() {
      if (this.description) {
        return this.description.substring(0, 100)
      } else {
        return ''
      }
    },
    flatNavigation() {
      if (this.navigation) {
        return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
      } else {
        return []
      }
    },
    lang() {
      return this.metadata ? this.metadata.language : '-'
    },
    isbn() {
      return this.metadata ? this.metadata.identifier : '-'
    },
    publisher() {
      return this.metadata ? this.metadata.publisher : '-'
    },
    title() {
      return this.metadata ? this.metadata.title : ''
    },
    author() {
      return this.metadata ? this.metadata.creator : ''
    },
    // 判断是否处于书架,设为计算属性是因为在多个地方调用该方法，计算属性能提高代码效率
    inBookShelf() {
      // 如果如果当前有图书存在，且图书列表中有内容
      if (this.bookItem && this.shelfList) {
        // 那么对图书列表进行扁平化(扁平化是为了同时取出分组中所有的图书)
        // 扁平化之后，挑选类型为1的元素（即保证都是图书）保存到变量中
        const flatShelf = (function flatten(arr) {
          return [].concat(...arr.map(v => v.itemList ? [v, ...flatten(v.itemList)] : v))
        })(this.shelfList).filter(item => item.type === 1)
        // 将数组变量中的图书与当前图书名称相等的图书再次过滤出来并保存在book中
        const book = flatShelf.filter(item => item.fileName === this.bookItem.fileName)
        // 如果book存在，并且长度大于0，则证明本身在书架中以存在，返回true,反之证明不存在返回false
        return book && book.length > 0
      } else {
        return false
      }
    }
  },
  data() {
    return {
      bookItem: null,
      book: null,
      metadata: null,
      trialRead: null,
      cover: null,
      navigation: null,
      displayed: false,
      audio: null,
      randomLocation: null,
      description: null,
      toastText: '',
      trialText: null,
      categoryText: null,
      opf: null
    }
  },
  methods: {
    addOrRemoveShelf() {
      // 如果图书处于书架
      if (this.inBookShelf) {
        // 删除书架的内容(store.js中的方法)，用返回得数组更新vuex
        this.setShelfList(removeFromBookShelf(this.bookItem)).then(() => {
          // 更新完毕后保存到本地存储
          saveBookShelf(this.shelfList)
        })
      } else {
        // 添加到书架(store.js中的方法)
        addToShelf(this.bookItem)
        // 通过本地存储中的数据，更新vuex
        this.setShelfList(getBookShelf())
      }
    },
    showToast(text) {
      // 将得到的错误信息赋给toastText，该变量之后会通过props传入消息框组件
      this.toastText = text
      // 调用展示消息框方法
      this.$refs.toast.show()
    },
    readBook() {
      this.$router.push({
        path: `/ebook/${this.bookItem.categoryText}|${this.fileName}`
      })
    },
    // （trialListening)试听 跳转到听书页
    trialListening() {
      // 获取IndexDB中的电子书，之后执行回调
      getLocalForage(this.bookItem.fileName, (err, blob) => {
        // 如果无报错，且二进制数据存在
        if (!err && blob && blob instanceof Blob) {
          // 则离线解析，进行路由跳转，并传递书名
          this.$router.push({
            path: '/store/speaking',
            query: {
              fileName: this.bookItem.fileName
            }
          })
        } else {
          // 反之则在线解析，进行路由跳转，并传递书名
          this.$router.push({
            path: '/store/speaking',
            query: {
              fileName: this.bookItem.fileName,
              opf: this.opf
            }
          })
        }
      })
    },
    read(item) {
      this.$router.push({
        path: `/ebook/${this.bookItem.categoryText}|${this.fileName}`
      })
    },
    itemStyle(item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
      }
    },
    doFlatNavigation(content, deep = 1) {
      const arr = []
      content.forEach(item => {
        item.deep = deep
        arr.push(item)
        if (item.subitems && item.subitems.length > 0) {
          arr.push(this.doFlatNavigation(item.subitems, deep + 1))
        }
      })
      return arr
    },
    downloadBook() {
      const opf = `${process.env.VUE_APP_EPUB_URL}/${this.bookItem.categoryText}/${this.bookItem.fileName}/OEBPS/package.opf`
      this.parseBook(opf)
    },
    parseBook(url) {
      this.book = new Epub(url)
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata
      })
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav
        if (this.navigation.toc && this.navigation.toc.length > 1) {
          const candisplay = this.display(this.navigation.toc[1].href)
          if (candisplay) {
            candisplay.then(section => {
              if (this.$refs.scroll) {
                this.$refs.scroll.refresh()
              }
              this.displayed = true
              const reg = new RegExp('<.+?>', 'g')
              const text = section.output.replace(reg, '').replace(/\s\s/g, '')
              this.description = text
            })
          }
        }
      })
    },
    init() {
      this.fileName = this.$route.query.fileName
      this.categoryText = this.$route.query.category
      if (this.fileName) {
        detail({
          fileName: this.fileName
        }).then(response => {
          if (response.status === 200 && response.data.error_code === 0 && response.data.data) {
            const data = response.data.data
            this.bookItem = data
            this.cover = this.bookItem.cover
            let rootFile = data.rootFile
            // 判断rootFile第一位是否是斜杠
            if (rootFile.startsWith('/')) {
              // 如果是则去掉该斜杠
              rootFile = rootFile.substring(1, rootFile.length)
            }
            // 这里传入的是电子资源中OEBPS文件夹下，后缀为opf的文件地址
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${this.fileName}/${rootFile}`
            // 传入地址，解析电子书，传入opf地址与传入正本电子书地址的区别是，传入该地址不会下载整本电子书
            this.parseBook(this.opf)
          } else {
            // 如果未能成功接收数据则调用showToast展示错误信息
            this.showToast(response.data.msg)
          }
        })
      }
    },
    back() {
      this.setFlipCardVisible(false)
      this.$router.back()
    },
    display(location) {
      if (this.$refs.preview) {
        if (!this.rendition) {
          this.rendition = this.book.renderTo('preview', {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: window.innerHeight,
            method: 'default'
          })
        }
        if (!location) {
          return this.rendition.display()
        } else {
          return this.rendition.display(location)
        }
      }
    },
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow()
      } else {
        this.$refs.title.hideShadow()
      }
    }
  },
  mounted() {
    this.init()
    // 通过打印shelfList可以发现，如果没有加载过书架相关页面的或者进入过书架但在其余页面又进行了刷新操作，
    // 那么就不能正确获取到shelfList的值（这时获取到的是一般为空数组），原因是shelfList默认就是空数组，他在书架相关页面中
    // 会通过请求方法对，对vuex中的shelfList进行赋值，从而更新shelfList，而在其他页面中首次加载不会赋值，所以在添加图书时，
    // 就可能会出现一本书会添加多次的情况（比如添加一次后，刷新详情页，数组为空，于是又可以添加）
    // console.log(this.shelfList) // []
    // 所以通过在mounted中判断如果为空，则调用混入中的方法，获取shelfList
    if (!this.shelfList || this.shelfList.length === 0) {
      this.getShelfList()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.book-detail {
width: 100%;
background: white;
.content-wrapper {
  width: 100%;
  .book-detail-content-wrapper {
    width: 100%;
    border-bottom: px2rem(1) solid #eee;
    box-sizing: border-box;
    .book-detail-content-title {
      font-size: px2rem(20);
      font-weight: bold;
      padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
      box-sizing: border-box;
    }
    .book-detail-content-list-wrapper {
      padding: px2rem(10) px2rem(15);
      box-sizing: border-box;
      .loading-text-wrapper {
        width: 100%;
        .loading-text {
          font-size: px2rem(14);
          color: #666;
        }
      }
      .book-detail-content-row {
        display: flex;
        box-sizing: border-box;
        margin-bottom: px2rem(10);
        .book-detail-content-label {
          flex: 0 0 px2rem(70);
          font-size: px2rem(14);
          color: #666;
        }
        .book-detail-content-text {
          flex: 1;
          font-size: px2rem(14);
          color: #333;
        }
      }
      #preview {
      }
      .book-detail-content-item-wrapper {
        .book-detail-content-item {
          padding: px2rem(15) 0;
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: #666;
          border-bottom: px2rem(1) solid #eee;
          &:last-child {
            border-bottom: none;
          }
          .book-detail-content-navigation-text {
            width: 100%;
            @include ellipsis;
            &.is-sub {
              color: #666;
            }
          }
        }
      }
    }
  }
  .audio-wrapper {
    width: 100%;
    padding: px2rem(15);
    box-sizing: border-box;
    #audio {
      width: 100%;
    }
  }
}
.bottom-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(52);
  box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);
  .bottom-btn {
    flex: 1;
    color: $color-blue;
    font-weight: bold;
    font-size: px2rem(14);
    @include center;
    &:active {
      color: $color-blue-transparent;
    }
    .icon-check {
      margin-right: px2rem(5);
    }
  }
  &.hide-shadow {
    box-shadow: none;
  }
}
}
</style>
