<template>
  <transition name="fade">
    <!-- 通过滚动判断阴影的显示隐藏 -->
    <div class="shelf-title" :class="{'hide-shadow': isHideShadow}" v-show="shelfTitleVisible">
      <!--正中间的标题-->
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <!--主标签下方的文本，编辑模式时显示，通过选中的图书数量确定具体内容-->
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <!--清除缓存按钮-->
      <div class="shelf-title-btn-wrapper  shelf-title-left" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <!--编辑按钮，文本根据点击之后isEditMode的值进行动态判断 空分组情况下，返回按钮显示，编辑按钮不显示，显示修改分组-->
      <div class="shelf-title-btn-wrapper  shelf-title-right" v-if="showEdit">
      <span class="shelf-title-btn-text"
            @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <!--分组返回按钮与上方的清除缓存按钮，以及修改分组按钮，都通过v-if判断计算属性来决定是否显示 -->
      <!--注：从而做到在分组中显示返回，分组修改模式下，显示修改分组按钮,书架页显示清除缓存-->
      <div class="shelf-title-btn-wrapper  shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <!--修改分组按钮，根据动态class附加的左右padding,来决定左右的显示-->
      <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
           v-if="showChangeGroup">
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage'

export default {
  mixins: [storeShelfMixin],
  props: {
    // 标题文本内容
    title: String
  },
  watch: {
    // 判断vuex中保存的滚动距离是否大于0
    offsetY (v) {
      // 大于0显示，反之隐藏
      if (v > 0) {
        this.isHideShadow = false
      } else {
        this.isHideShadow = true
      }
    }
  },
  data() {
    return {
      // 默认隐藏阴影
      isHideShadow: true
    }
  },
  computed: {
    // 是空分组返回真，添加距离右侧的padding
    changeGroupRight() {
      return this.emptyCategory
    },
    // 不是空分组返回真，添加距离左侧的padding
    changeGroupLeft() {
      return !this.emptyCategory
    },
    // 判断是否是空分组，是空返回true
    emptyCategory() {
      // 如果vuex中的shelfCategory不存在，或者存在但itemList不存在，或者itemList的长度为0,满足任意一个条件，都会认为是空的
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    showEdit() {
      // 编辑按钮在书架一直显示或者在分组中不为空时显示
      return this.currentType === 1 || !this.emptyCategory
    },
    showClear() {
      return this.currentType === 1
    },
    showBack() {
      // 根据vuex中保存的变量判断是分组内，且不是编辑模式，则显示
      return this.currentType === 2 && !this.isEditMode
    },
    showChangeGroup() {
      // 根据vuex中保存的变量判断是分组内，且是编辑模式或者空分组，则显示
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    selectedText() {
      // 获取选中图书的数量
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      // 数量小于等于0时取默认值，数量为1时单数形式，1及以上为复数形式
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1
        ? this.$t('shelf.haveSelectedBook').replace('$1',
          selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1',
          selectedNumber))
    },
    // 返回取消按钮对象
    popupCancelBtn() {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        // 隐藏弹窗
        this.hidePopup()
      })
    }
  },
  methods: {
    onComplete() {
      // 隐藏弹窗
      this.hidePopup()
      // 删除分组
      // 括号内的过滤通过对比id将除当前分组外的所有元素全部保存下来，之后通过setShelfList方法重新设置
      this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
        // 更新完毕后，保存到本地存储
        saveBookShelf(this.shelfList)
        // 路由后退到前一页，也就是书架页
        this.$router.go(-1)
        // 退出编辑模式
        this.setIsEditMode(false)
      })
    },
    // 删除分组方法
    deleteGroup() {
      // 如果当前分组不为空
      if (!this.emptyCategory) {
        // 将分组中的图书列表全部设置为选中图书
        this.setShelfSelected(this.shelfCategory.itemList)
        // 调用mixin中的移出分组方法，并传入回调
        this.moveOutOfGroup(this.onComplete)
      } else {
        // 如果为空，直接执行公用的方法
        this.onComplete()
      }
    },
    // 改变分组名
    changeGroupName() {
      // 隐藏弹窗
      this.hidePopup()
      // 展示对话框,并传入参数，使打开时直接接入新建分组页面，并且输入框中默认输入当前分组名
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    // 删除分组
    showDeleteGroup() {
      // 隐藏弹窗,因为这里有0.2s的动画，所以新弹窗的展示必须也使用定时器延后，否则会出现
      // 新弹窗先展示，但又在这条语句执行完毕后,消失
      this.hidePopup()
      setTimeout(() => {
        // 展示新弹窗
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'), () => {
              // 删除分组方法
              this.deleteGroup()
            }, 'danger'),
            // 取消
            this.popupCancelBtn
          ]
        }).show()
      }, 200)
    },
    // 方法用于隐藏弹窗菜单
    hidePopup() {
      // 调用保存的弹窗，将其隐藏
      this.popupMenu.hide()
    },
    // 方法用于提供弹窗按钮对象
    createPopupBtn(text, onClick, type = 'normal') {
      return {
        text,
        type,
        click: onClick
      }
    },
    changeGroup() {
      // 创建弹窗，并将弹窗保存在变量当中
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          // 这里将取消按钮封装成计算属性，在其余地方再次调用时，就不会再次执行其中的方法，而是直接返回对象，提高了效率
          this.popupCancelBtn
        ]
      }).show()
    },
    back() {
      this.$router.go(-1)
      // 退出编辑模式
      this.setIsEditMode(false)
    },
    onEditClick() {
      // 如果未处于编辑模式
      if (!this.isEditMode) {
        // 清空选中列表
        this.setShelfSelected([])
        // 将书架列表中的每本书的选中属性设为false
        this.shelfList.forEach(item => {
          item.selected = false
          // 如果书架列表中有包含itemList属性的条目(分组)
          if (item.itemList) {
            // 遍历分组下的itemList(图书)，将分组下每一本书都设置为false
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      // 切换编辑模式
      this.setIsEditMode(!this.isEditMode)
    },
    clearCache() {
      // 清空 本地存储 indexDB 图书列表，选中列表
      clearLocalStorage()
      clearLocalForage()
      this.setShelfList([])
      this.setShelfSelected([])
      // 重新获取默认书架列表
      this.getShelfList()
      // 显示消息框
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-title {
  position: relative;
  z-index: 130;
  width: 100%;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    /*因为按钮没有指定宽度，所以宽度将由文字宽度决定*/
    height: 100%;
    /*保证了元素水平垂直居中*/
    @include center;
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    .icon-back {
      font-size: px2rem(20);
      color: #666;
    }
    &.shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>
