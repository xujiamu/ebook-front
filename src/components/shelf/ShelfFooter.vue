<template>
  <!--书架底部菜单， 通过isEditMode控制编辑模式下显示-->
  <div class="shelf-footer" v-show="isEditMode">
    <!--进行循环展示所有tab-->
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)">
      <!--通过动态class改变有图书选中时的透明度-->
      <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
        <!--所有的图标，包括四种大类的图标，以及前两种点击之后改变的图标-->
        <!--根据index决定显示的图标-->
        <!-- 第一栏根据index以及是否私密决定显示的图标-->
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <!-- 第二栏根据index以及是否下载决定显示的图标-->
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <!--不同图标下显示的文本，通过label方法选取，并且对第四栏移除书架设置专门的样式-->
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import { saveBookShelf, removeLocalStorage } from '../../utils/localStorage'
import { download } from '../../api/store'
import { removeLocalForage } from '../../utils/localForage'

export default {
  mixins: [storeShelfMixin],
  computed: {
    isSelected() {
      // 当有图书被选中，则返回true
      return this.shelfSelected && this.shelfSelected.length > 0
    },
    // 底部标签的数据
    tabs() {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    // 变量用于判断是否是私密状态
    isPrivate() {
      // 如果没有选中的图书则不是
      if (!this.isSelected) {
        return false
      } else {
        // 如果所有选中图书的private属性都是真，则处于私密状态
        return this.shelfSelected.every(item => item.private)
      }
    },
    // 变量用于判断是否是下载状态
    isDownload() {
      // 如果没有选中的图书则不是
      if (!this.isSelected) {
        return false
      } else {
        // 如果所有选中图书的cache属性都是真，则处于下载状态
        return this.shelfSelected.every(item => item.cache)
      }
    }
  },
  data() {
    return {
      // 弹窗变量
      popupMenu: null
    }
  },
  methods: {
    // 因为图书下载是异步操作，为了保证在下载完毕后更新cache所以使用 async await
    async downloadSelectedBook() {
      // 遍历所有选中的图书
      for (let i = 0; i < this.shelfSelected.length; i++) {
        // 调用下载方法downloadBook，传入每本书的数据对象
        await this.downloadBook(this.shelfSelected[i])
        //   下载完毕后将所有图书的cache更新为true
        this.shelfSelected[i].cache = true
      }
    },
    downloadBook(book) {
      // 重置向toast组件传递的值
      let text = ''
      // 保存toast组件
      const toast = this.toast({
        text
      })
      // 调用toast组件中的continueShow方法,展示消息框
      toast.continueShow()
      // 将网络请求结果通过promise包装
      return new Promise((resolve, reject) => {
        // 调用download网络请求方法，作用是下载图书
        // 第一个参数传入book方法，第二个参数成功后的回调,第三个参数失败回调，第四个进度条回调
        download(book, book => {
          // 这里需要调用createApi的remove方法，彻底删除toast对应DOM,因为在图书下载完毕后，
          // 会使用simpleToast，创建新的消息框，如果只调用toast组件中的hide方法,隐藏消息框
          // 那么就DOM就不会删除，新的消息框就无法正确显示
          toast.remove()
          // 将得到的数据resolve出去
          resolve(book)
        }, reject, progressEvent => {
          // 这里得到的progressEvent是一个会不断变化的进度条数据对象，这里我们会用到两个属性
          // 一个loaded属性保存目前下载的数字进度值(number类型)，一个total属性保存文件总的数字值(number类型)
          // 所以progress就可以得到下载进度
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          // 从国际化中取出相应文本，根据进度对文本进行修改，并保存
          text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          // 调用toast组件中的continueShow方法，传入新的text更新消息框
          toast.updateText(text)
        })
      })
    },
    removeSelectedBook() {
      // 通过promise.all当所有的图书都删除完毕后
      Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
        .then(books => {
          // 将所有的图书对象的cache都设为false
          books.map(book => {
            book.cache = false
          })
          // 保存最新的图书列表
          saveBookShelf(this.shelfList)
          // 展示消息框
          this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
        })
    },
    // 删除一本图书
    removeBook(book) {
      return new Promise((resolve, reject) => {
        // 删除本地存储中的数据
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        // 数据indexDB中的数据
        removeLocalForage(`${book.fileName}`)
        // 将图书对象返回
        resolve(book)
      })
    },
    hidePopup() {
      // 调用弹窗组件的hide方法
      this.popupMenu.hide()
    },
    onComplete() {
      // 隐藏弹窗
      this.hidePopup()
      // 退出编辑模式
      this.setIsEditMode(false)
      // 将书架内容保存到本地存储中，注: 对于setPrivate方法，虽然更新的是选中图书,
      // 但是由于选中图书保存的是对象的引用，
      // 所以图书列表中指定图书的isPrivate状态也会改变，所以可以用本地存储保存
      saveBookShelf(this.shelfList)
    },
    setPrivate() {
      let isPrivate
      // 如果是私密状态，将isPrivate变量设为false ，如果不是则将变量设为true
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      // 之后将新的状态变量isPrivate写入 所有的选中图书
      this.shelfSelected.forEach(book => {
        book.private = isPrivate
      })
      // 调用公共方法
      this.onComplete()
      // 最后根据新设置的是否是私密阅读,弹出不同的弹窗
      if (isPrivate) {
        // 将文本传入全局混入设置的弹窗方法中
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    // 因为图书下载是异步操作，为了确保保存新图书列表与弹出消息框的操作在下载之后
    // 可以将方法用async await进行改造，从而确保代码的执行顺序
    async setDownload() {
      // 调用公共方法
      this.onComplete()
      // 如果原先处于下载状态
      if (this.isDownload) {
        // 删除所有选中图书
        this.removeSelectedBook()
      } else {
        // 返之则下载选中图书
        await this.downloadSelectedBook()
        // 保存新的图书列表
        saveBookShelf(this.shelfList)
        // 弹出消息框
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    removeSelected() {
      // 遍历所有选中图书
      this.shelfSelected.forEach(selected => {
        const list = this.shelfList.filter(book => {
          // 将分组中选中图书从图书列表中移除
          if (book.itemList) {
            // 分组更新
            book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
          }
          // 将选中图书从图书列表中移除，
          return book !== selected
        })
        // 并将图书列表的变化保存到vuex
        this.setShelfList(list)
      })
      // 将选中图书重置，保存到vuex
      this.setShelfSelected([])
      // 调用公共方法
      this.onComplete()
    },
    showPrivate() {
      // 将展示的弹窗组件保存在变量中
      this.popupMenu = this.popup({
        // 通过判段是否是私密阅读，赋值相应的title
        title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
        btn: [
          {
            // 通过判段是否是私密阅读，赋值相应按钮text
            text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
            click: () => {
              // 触发点击事件时设置私密
              this.setPrivate()
            }
          },
          {
            // 取消设置
            text: this.$t('shelf.cancel'),
            click: () => {
              // 触发点击事件时隐藏弹窗
              this.hidePopup()
            }
          }
        ]
      }).show() // 展示弹窗
    },
    showDownload() {
      // 将展示的弹窗组件保存在变量中
      this.popupMenu = this.popup({
        // 通过判段是否是下载，赋值相应的title
        title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
        btn: [
          {
            // 通过判段是否是下载，赋值相应按钮text
            text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
            click: () => {
              // 触发点击事件时设置下载
              this.setDownload()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              // 触发点击事件时隐藏弹窗
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    showRemove() {
      // 创建变量title
      let title
      // 在选中一本书时展示书名，多本书时展示固定文字，将值赋予title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      // 将展示的弹窗组件保存在变量中
      this.popupMenu = this.popup({
        // 将title变量赋予title属性
        title: title,
        btn: [
          {
            text: this.$t('shelf.removeBook'),
            type: 'danger',
            click: () => {
              // 触发点击事件时移除选中
              this.removeSelected()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              // 触发点击事件时隐藏弹窗
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    onTabClick(item) {
      // 如果没有图书被选中直接return
      if (!this.isSelected) {
        return
      }
      // 如果被选中则会根据index判断点击的按钮时哪一个
      switch (item.index) {
        case 1:
          // 展示私密阅读
          this.showPrivate()
          break
        case 2:
          // 展示下载页
          this.showDownload()
          break
        case 3:
          // 展示对话框
          this.dialog().show()
          break
        case 4:
          // 展示删除页
          this.showRemove()
          break
        default:
          break
      }
    },
    label(item) {
      switch (item.index) {
        // 私密栏，及下载栏会根据变量，显示不同的label，而后两栏直接显示即可
        case 1:
          return this.isPrivate ? item.label2 : item.label
        case 2:
          return this.isDownload ? item.label2 : item.label
        default:
          return item.label
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-footer {
  /* 不会受外层列表的影响，所以是fixed定位*/
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  /* 对内使用flex布局 */
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      opacity: .5;
      /* 让子元素垂直居中 */
      @include columnCenter;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
        &.remove-text {
          color: $color-pink;
        }
      }
      .icon-shelf {
        color: $color-pink;
      }
    }
  }
}
</style>
