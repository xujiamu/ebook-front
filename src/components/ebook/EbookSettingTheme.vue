<template>
  <transition name='slide-up'>
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme" >
        <div class="setting-theme-item"
             v-for="(item,index) in themeList" :key="index"
             @click="setTheme(index)">
          <div class="preview"
               :class="{'selected': item.name === defaultTheme}"
               :style="{'background':item.style.body.background}"></div>
          <div class="text"
               :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from '../../utils/mixin'
import { saveTheme } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  methods: {
    setTheme(index) {
      const theme = this.themeList[index]
      this.setDefaultTheme(theme.name).then(() => {
        this.currentBook.rendition.themes.select(this.defaultTheme)
        this.initGlobalStyle()
      })
      saveTheme(this.fileName, theme.name)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
  position: absolute;
  bottom: px2rem(40);
  left: 0;
  width: 100%;
  height: px2rem(80);
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  background-color: rgb(255, 255, 255);
  z-index: 190;
  .setting-theme {
    display: flex;
    height: 100%;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: px2rem(5);
      .preview {
        flex: 1;
        &.selected {
          box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .1);
          border: px2rem(2) solid #5e6369;
        }
      }
      .text {
        flex: 0 0 px2rem(20);
        font-size: px2rem(16);
        color: #ccc;
        &.selected {
          color: #000;
        }
        @include center;
      }
    }
  }
}
</style>
