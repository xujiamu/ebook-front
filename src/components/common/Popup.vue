<template>
  <!-- 显示隐藏通过 popupVisible变量控制-->
  <div class="popup" v-if="popupVisible">
    <!--渐隐动画-->
    <transition name="fade">
      <!--背景 点击背景，触发hide事件隐藏弹窗  为了动画正常显示，加上v-show-->
      <div class="popup-bg" @click.stop.prevent="hide" v-show="popupVisible"></div>
    </transition>
    <!--弹出动画-->
    <transition name="popup-slide-up">
      <!-- 添加v-show，让动画正常显示-->
      <div class="popup-wrapper" v-show="visible">
        <!--标题 title变量通过props接收，并根据是否有值判断是否显示-->
        <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
        <!--按钮 btn变量通过props接收， 并遍历数组-->
        <!--如果单个按钮item中的type属性为 danger则为该属性添加 danger类形式-->
        <!--如果单击按钮，则触发单个item中的click方法-->
        <div class="popup-btn"
             :class="{'danger':item.type==='danger'}"
             v-for="(item, index) in btn"
             :key="index"
             @click="item.click">{{item.text}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    // 标题字符串类型，可能有可能没有，比如正常的底部菜单有标题，
    // 而分组当中的编辑模式，底部弹窗则没有标题
    title: String,
    // btn同样如此，有的弹窗是一个按钮，而有的是多个，所以是数组类型
    btn: Array
  },
  data() {
    return {
      // 控制整体弹窗是否显示的变量
      popupVisible: false,
      // 控制按钮是否显示的变量
      visible: false
    }
  },
  methods: {
    // 展示弹窗和按钮
    // 这里只有visible使用定时器才能有动画，原因是如果连续设置两个为true,
    // 那么由于他们处于同一个DOM中，不间断的两次设置显示，就会导致动画失效，所以必须定时器
    show() {
      this.popupVisible = true
      setTimeout(() => {
        this.visible = true
      })
    },
    // 隐藏弹窗和按钮
    hide() {
      this.visible = false
      setTimeout(() => {
        this.popupVisible = false
      }, 200)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .4);
  .popup-bg {
    width: 100%;
    height: 100%;
  }
  .popup-wrapper {
    /*将弹窗使用fixed布局，固定在底部*/
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2000;
    width: 100%;
    background: white;
    .popup-title {
      width: 100%;
      height: px2rem(44);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(12);
      line-height: px2rem(14);
      padding: px2rem(15);
      box-sizing: border-box;
      color: #999;
      @include center;
    }
    .popup-btn {
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      color: #666;
      font-weight: bold;
      @include center;
      &.danger {
        color: $color-pink;
      }
    }
  }
}
</style>
