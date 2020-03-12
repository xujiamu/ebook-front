<template>
  <ebook-dialog :title="title" ref="dialog">
    <!-- dialog-list-wrapper dialog-new-group-wrapper 根据是否是新键分组状态，显示其中一个得内容
    替换原Dialog组件中的空插槽-->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <!--点击列表时对状态进行切换,在书架中列表显示所有分组和新建分组，
      在分组中，多显示一个移出分组-->
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           >
        <div class="dialog-list-item-text">{{item.title}}</div>
        <!-- 对应分组后面的对勾显示，将当前分组的id与每个item的id进行对比如果相等
        就显示对勾（这里的item就是一个个分组），如果在书架页，不是分组，则不显示-->
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
    <!--新建分组状态-->
    <div class="dialog-new-group-wrapper" v-else>
      <!--输入框上方的小标题-->
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <!--输入框-->
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <!--对输入框内容进行监听-->
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
          <!--当输入框有内容时，该clear按钮显示，点击清空输入框-->
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <!--替换原Dialog组件中有默认值得插槽-->
    <div slot="btn" class="group-dialog-btn-wrapper">
      <!--取消按钮-->
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <!-- 这里会根据是否是新键分组状态，决定是否显示确认按钮-->
      <!--在新建分组状态下，如果输入框内容为空，则添加is-empty灰色样式，并且触发点击事件时直接返回-->
      <!--如果输入框中有内容，则会根据内容新建一个分组-->
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t('shelf.confirm')}}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
import EbookDialog from '../common/Dialog'
import { storeShelfMixin } from '../../utils/mixin'
import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
import { saveBookShelf } from '../../utils/localStorage'

export default {
  name: 'group-dialog',
  mixins: [storeShelfMixin],
  components: {
    EbookDialog
  },
  props: {
    // 控制是否显示新建分组，默认显示列表，传入true时显示新建
    showNewGroup: {
      type: Boolean,
      default: false
    },
    // 显示默认分组名
    groupName: String
  },
  computed: {
    isInGroup() {
      return this.currentType === 2
    },
    defaultCategory() {
      return [
        {
          // 新建分组
          title: this.$t('shelf.newGroup'),
          edit: 1
        },
        {
          // 移出分组
          title: this.$t('shelf.groupOut'),
          edit: 2
        }
      ]
    },
    category() {
      // 返回图书列表中type为2的元素(图书为分组对象)组成的数组
      return this.shelfList.filter(item => item.type === 2)
    },
    // 对话框列表
    categoryList() {
      // 由默认的新建移出列表及及分组对象组成的数组，最终经过过滤后返回数组
      return [...this.defaultCategory, ...this.category].filter(item => {
        // 因为是并联关系，所以满足任意条件即可，当在书架页面该列表符合条件2和3,
        // 当在分组页面 1,2，3 都符合，所以分组页面也会显示移出分组
        return (item.edit === 2 && this.isInGroup) || item.edit !== 2 || !item.edit
      })
    },
    // 根据是否处于新建分组状态传递合适的title值
    title() {
      return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
    }
  },
  data() {
    return {
      ifNewGroup: false,
      newGroupName: ''
    }
  },
  methods: {
    show() {
      // 将传入的值，赋予是否显示新建分组的变量
      this.ifNewGroup = this.showNewGroup
      // 将传入的值,赋予新分组名
      this.newGroupName = this.groupName
      // 展示弹窗
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
      // 对话框有整体有0.2秒的动画，如果这里不对新建分组的显示变量做出0.2秒的延迟，
      // 那么他会在列表框消失前就消失，动画不同步
      setTimeout(() => {
        this.ifNewGroup = false
      }, 200)
    },
    onGroupClick(item) {
      if (item.edit && item.edit === 1) {
        // 改为新建分组状态
        this.ifNewGroup = true
      } else if (item.edit && item.edit === 2) {
        // 调用移除分组方法
        this.moveOutFromGroup()
      } else {
        // 移入指定分组
        this.moveToGroup(item)
      }
    },
    clear() {
      this.newGroupName = ''
    },
    moveToGroup(group) {
      // 分为两步，一是移出并保存 二是移入并保存
      // 1.遍历图书列表中的图书，将未选中的图书重新保存
      this.setShelfList(this.shelfList
        .filter(book => {
          // 以下两步操作保证了，分组和书架都会被准确移出
          // 如果存在itemList证明是分组，对分组中的数据进行更新
          if (book.itemList) {
            // 分组更新
            book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
          }
          // 对书架中的书进行判断，返回非选中的图书
          return this.shelfSelected.indexOf(book) < 0
        }))
        .then(() => {
          // 2.
          // 传入的每个item都相当于一个分组group，分组内容保存在它的itemList数组属性中
          if (group && group.itemList) {
            // 将选中的图书加入itemList数组中
            group.itemList = [...group.itemList, ...this.shelfSelected]
          }
          // 对itemList的索引进行更新
          group.itemList.forEach((item, index) => {
            item.id = index + 1
          })
          // 保存数据列表到本地存储
          saveBookShelf(this.shelfList)
          // 关闭修改模式
          this.setIsEditMode(false)
          // 显示弹窗
          this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
          this.onComplete()
        })
    },
    moveOutFromGroup() {
      // 调用混入中封装的方法,并将回调传入等待执行
      this.moveOutOfGroup(this.onComplete)
    },
    createNewGroup() {
      // 如果输入看内容不存在或长度为0，直接返回
      if (!this.newGroupName && this.newGroupName.length === 0) {
        return
      }
      // 如果该变量为真，证明需要修改分组，反之则增加
      if (this.showNewGroup) {
        // 修改分组名
        this.shelfCategory.title = this.newGroupName
        this.onComplete()
      } else {
        // 创建一个分组，设置它的各项属性
        const group = {
          // id 它的id应该是数据倒数第二个元素id加1（倒数第一个元素是添加，id是-1，不能作为参考值）
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          // 存放图书的数组
          itemList: [],
          // 是否选中
          selected: false,
          // 分组名
          title: this.newGroupName,
          // 类型判断，分组类型都是2
          type: 2
        }
        // 删除最后一栏的添加，并赋值新的书架列表数组
        let list = removeAddFromShelf(this.shelfList)
        // 在书架列表数组的最后加入新分组
        list.push(group)
        // 书架列表的最后加入新的添加
        list = appendAddToShelf(list)
        // 更新图书列表
        this.setShelfList(list).then(() => {
          // 调用移到分组方法，将图书移入新建的分组
          this.moveToGroup(group)
        })
      }
    },
    onComplete() {
      // 保存数据列表到本地存储
      saveBookShelf(this.shelfList)
      // 隐藏弹窗设置新分组变量为false
      this.hide()
      // 关闭修改模式
      this.setIsEditMode(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.dialog-list-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  font-size: px2rem(14);
  @include scroll;
  .dialog-list-item {
    display: flex;
    padding: px2rem(15) 0;
    box-sizing: border-box;
    color: #666;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, .5)
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 px2rem(30);
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: px2rem(10);
    margin-top: px2rem(20);
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 px2rem(30) 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: px2rem(10) 0;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(14);
      color: #666;
      .dialog-input {
        flex: 1;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 px2rem(30);
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}
.dialog-btn {
  flex: 1;
  &.is-empty {
    color: rgba(255, 255, 255, .5);
  }
  &:active {
    color: rgba(255, 255, 255, .5)
  }
}
</style>
