<template>
  <transition name="fade">
    <!--@click.prevent 单独设置该方法，代表阻止所有点击事件,保证了弹窗显示时不能切换-->
    <div class="toast-bg-wrapper" @click.prevent v-show="visible">
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'toast',
  props: {
    text: [String, Number],
    timeout: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      // 默认不展示消息框
      visible: false,
      // 由于上面的text由父组件传递，在子组件中不能实时监听变化，
      // 所以这里新建一个showText变量，用于改变页面展示的值
      showText: ''
    }
  },
  methods: {
    // 隐藏弹出框
    hide() {
      this.visible = false
    },
    // 展示消息框，指定时间后隐藏消息框
    show() {
      // 同步showText
      this.updateText(this.text)
      // 清空上一次未执行完毕的定时器
      clearTimeout(this.task)
      // 重置变量
      this.task = null
      // 展示消息框
      this.visible = true
      // 1.5s后隐藏
      this.task = setTimeout(() => {
        this.visible = false
      }, this.timeout)
    },
    continueShow() {
      // 清空定时器，展示消息框
      clearTimeout(this.task)
      this.task = null
      this.visible = true
    },
    // 调用该方法会使用新的text，对showText进行更新
    updateText(text) {
      this.showText = text
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.toast-bg-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2500;
  width: 100%;
  height: 100%;
  background: transparent;
  .toast-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 0 0 -50%;
    z-index: 2500;
    width: 100%;
    @include center;
    .toast-wrapper {
      width: 60%;
      line-height: px2rem(20);
      padding: px2rem(10) px2rem(20);
      box-sizing: border-box;
      background: #ccc;
      border-radius: px2rem(10);
      font-size: px2rem(14);
      color: white;
      .toast {
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>
