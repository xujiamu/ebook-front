<template>
  <div class="store-shelf">
    <!-- 传入title显示正确的分组名，并设置显示返回按钮-->
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <!-- v-if 进行判定，不是空分组显示滚动条内的内容-->
    <scroll class="store-shelf-scroll-wrapper" :top="0"
            :bottom="scrollBottom"
            @oncScroll="onScroll"
            ref="scroll"
            v-if="ifShowList">
      <!--书架列表-->
      <!-- 分组数据对象中的itemList为具体的图书列表数据-->
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
      <!--书架底部菜单-->
      <shelf-footer></shelf-footer>
    </scroll>
    <!-- 是空分组显示如下内容-->
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTilte'
import { storeShelfMixin } from '../../utils/mixin'
import Scroll from '../../components/common/Scroll'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'

export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfFooter,
    ShelfList,
    Scroll,
    ShelfTitle
  },
  computed: {
    ifShowList() {
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
    }
  },
  watch: {
    // 监听是否处于编辑模式，对滚动高度做出相应修改
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      // 等待dom更新完毕后
      this.$nextTick(() => {
        // 对滚动条做出刷新
        this.$refs.scroll.refresh()
      })
    }
  },
  data() {
    return {
      scrollBottom: 0
    }
  },
  methods: {
    // 接收Scroll组件传递的滚动距离，并保存
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted () {
    // 获取分组数据，传入从ShelfItem跳转时，接收到的title
    this.getCategoryList(this.$route.query.title)
    // 将现在的类别设为2
    this.setCurrentType(2)
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      @include center
    }
  }
</style>
