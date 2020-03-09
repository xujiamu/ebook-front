<template>
  <div class="store-shelf">
    <!-- 尽管scroll组件设置的滚动范围是整个页面，但是标题在该组件外，所以不会一起滚动，滚动内容也不会出现在它的下方，但是当
    标题隐藏后，整个页面便可以一起滚动，所以这时需要将 shelf-search组件使用 fixed固定，才能让他不滚动，但是这时shelf-list
    内容，就会出现在shelf-search下方，为了保证shelf-list显示完全，所以需要对它使用绝对定位，对top值进行设置-->
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <!-- 在编辑模式下,有了底部菜单，为了保证剩余的内容不会被菜单遮挡，所以滚动高度，需要去掉滚动条底部高度，
    在store-shelf-scroll-wrapper样式中，top已经固定是0了，所以直接传入bottom，减去的高度就是底部少的高度-->
    <scroll class="store-shelf-scroll-wrapper" :top="0"
            :bottom="scrollBottom"
            @oncScroll="onScroll"
            ref="scroll">
      <!--书架搜索-->
      <shelf-search></shelf-search>
      <!--书架列表-->
      <shelf-list :data="shelfList"></shelf-list>
      <!--书架底部菜单-->
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
import ShelfSearch from '../../components/shelf/ShelfSearch'
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
    ShelfTitle,
    ShelfSearch
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
    // 获取书架列表数据
    this.getShelfList()
    // 设置分组数据为空
    this.setShelfCategory([])
    // 将现在的类别设为1
    this.setCurrentType(1)
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
}
</style>
