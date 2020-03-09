<template>
  <!--最外一个包裹层-->
  <div class="playing-item-wrapper">
    <!--内部通过循环生成许多重复图层，实际上就是动画中的一个个竖线-->
    <div class="playing-item" :style="item" v-for="(item, index) in styles" :key="index" ref="playingItem"></div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils'

export default {
  props: {
    // number竖线的数量，通过外部传入
    number: Number
  },
  computed: {
    styles() {
      // 根据竖线的数量新建一个数组
      const styles = new Array(this.number)
      // 遍历数组,添加数组对象
      for (let i = 0; i < styles.length; i++) {
        styles[i] = {
          // 每个对象中保存一个高度，高度的值通过random方法随机获取
          height: px2rem(this.random()) + 'rem'
        }
      }
      return styles
    }
  },
  methods: {
    // 将开始动画方法提供给外层调用（也就是在单击播放按钮时），会每0.2秒更新一次高度
    startAnimation() {
      this.task = setInterval(() => {
        this.$refs.playingItem.forEach(item => {
          item.style.height = px2rem(this.random()) + 'rem'
        })
      }, 200)
    },
    // 关闭动画方法，当外层销毁组件时，调用该方法，清除定时器
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task)
      }
    },
    random() {
      return Math.ceil(Math.random() * 10)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .playing-item-wrapper {
    @include center;
    .playing-item {
      flex: 0 0 px2rem(2);
      width: px2rem(2);
      height: px2rem(1);
      background: $color-blue;
      margin-left: px2rem(2);
      transition: all .2s ease-in-out;
      &:first-child {
        margin: 0;
      }
    }
  }
</style>
