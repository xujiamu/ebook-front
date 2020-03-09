<template>
  <!-- data.type===3时（即添加组件）没有阴影 -->
  <div class="shelf-item"
       :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}"
       @click="onItemClick">
    <!--通过动态组件展示正确得组件,正确组件的显示逻辑通过计算属性item返回-->
    <!--并向动态组件传入数据data-->
    <!-- 为动态组件设置class和动态class，当处于编辑状态下，且type为2时，改变透明度-->
    <component :is="item" :data="data"
               class="shelf-item-comp"
               :class="{'is-edit': isEditMode && data.type === 2}"></component>
    <!--图书右下角选中框，由icon-selected图标实现-->
    <!-- v-show通过vuex中的变量，指定其在编辑状态下并且type为1时展示-->
    <!--选中时样式的该变，由data数据中的selected属性决定-->
    <div class="icon-selected"
         :class="{'is-selected': data.selected}"
         v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import ShelfBook from './ShelfItemBook'
import ShelfCategory from './ShelfItemCategory'
import ShelfAdd from './ShelfItemAdd'
import { gotoStoreHome } from '../../utils/store'

export default {
  mixins: [storeShelfMixin],
  props: {
    data: Object
  },
  computed: {
    // 动态组件的显示逻辑
    item() {
      return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
    }
  },
  data() {
    // 将三个动态组件保存在变量中
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add: ShelfAdd
    }
  },
  methods: {
    onItemClick() {
      // 在编辑模式下
      if (this.isEditMode) {
        // 如果type为1（封面状态）
        if (this.data.type === 1) {
          // 每次点击将selected属性取反
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            // 这里将选中的图书保存vuex在`shelfSelected`数组中，直接使用Push保存，重复选中某一数据，会导致数据重复，
            // 所以定义一个新数组方法，在这里调用，用于添加数据
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
            // 通过filter方法过滤未选中的图书
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        }
      } else {
        // 在非编辑模式下
        // 如果type为1（封面状态），跳转到电子书详情页
        if (this.data.type === 1) {
          // 调用混入中的路由跳转方法
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          // 当type为2 通过路由跳转到分组页面
          this.$router.push({
            path: '/store/category',
            query: {
              // 传递分组名
              title: this.data.title
            }
          })
        } else {
          // 如果type为3 跳转到书城首页，this为vue实例
          gotoStoreHome(this)
        }
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: .5;
    }
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, .4);
    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>
