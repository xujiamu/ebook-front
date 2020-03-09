<template>
  <!--动态绑定top，具体值通过计算属性得出-->
  <div class="shelf-list" :style="{top: shelfListTop}">
    <!--transition-group对列表进行过渡，也就是为每一个shelf-list-item-wrapper都添加过渡-->
    <!--该动画与正常的transition不同的是，它会以一个真实DOM的形式存在,默认为span，可以通过tag属性更改默认-->
    <!--为这个DOM添加id,方便修改样式-->
    <transition-group name="list" tag="div" id="shelf-list">
      <!--遍历书架列表-->
      <!--补充，这里之后还需要用于遍历分组，所以不能固定使用tem in shelfList 应该设置变量，通过props传递-->
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <!--宽度因为一排固定三个，所以能够动态计算，而高度则需要人为绑定动态样式通过计算属性计算-->
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <!--图书标题-->
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import ShelfItem from './ShelfItem'
import { realPx, px2rem } from '../../utils/utils'

export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfItem
  },
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: {
      type: Array
    }
  },
  computed: {
    itemHeight() {
      // 图片的宽高比例为 250 / 350
      // 所以 w / 250 = h / 350
      // h = w / 250 * 350
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    },
    shelfListTop() {
      return px2rem(this.top) + 'rem'
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-list {
  position: absolute;
  /* 据上方 fixed元素距离，因为书架页和分组页的top不同，分组页没有搜索组件
  所以这里需要使用动态top，在上方props接收top，并通过:style赋值*/
  /*top: px2rem(94);*/
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    width: 100%;
    display: flex;
    /* 同时设置 flex-direction 以及 flex-wrap */
    flex-flow: row wrap;
    padding: px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      /* list-leave-active list-move 是两个动画属性，list是name值，
      原理简介：当执行动画时会为需要移动的(比如我移除第三书，
      那么前两本就是不需要移动的，第三本往后的所有书，都是需要移动的)
      shelf-list-item-wrapper类绑定
      list-leave-active类 list-move类 list-leave-to类(这里是移除所以没有list-enter等几个类)
      第一个属性设置了 display:none ，才能使页面正常运动
      第二个属性设置的 transform是固定写法 .5s代表运动时间 */
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform .5s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
      }
    }
  }
}
</style>
