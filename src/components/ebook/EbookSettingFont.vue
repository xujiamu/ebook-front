<template>
  <transition name='slide-up'>
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <div class="setting-font-size">
        <div class="prev left" :style="{'font-size': fontSizeList[0].fontSize+'px'}">a</div>
        <div class="select">
          <div class="select-wrapper"
               v-for="(item,index) in fontSizeList"
               @click="setFontSize(item.fontSize)"
               :key="index">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point"
                   v-show='defaultFontSize === item.fontSize'>
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="prev right" :style="{'font-size': fontSizeList[fontSizeList.length-1].fontSize+'px'}">A</div>
      </div>
      <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="setting-font-family-text">{{defaultFontFamily}}</div>
        <div class="setting-font-family-icon">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from '../../utils/mixin'
import { FONT_SIZE_LIST } from '../../utils/book'
import { saveFontSize } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST
    }
  },
  methods: {
    setFontSize(fontSize) {
      this.setDefaultFontSize(fontSize)
      this.currentBook.rendition.themes.fontSize(fontSize)
      saveFontSize(this.fileName, fontSize)
    },
    showFontFamilyPopup() {
      this.setFontFamilyVisible(true)
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
  display: flex;
  flex-direction: column;
  .setting-font-size {
    flex: 1;
    display: flex;
    height: 100%;
    .prev {
      flex: 0 0 px2rem(30);
      height: 100%;
      @include center;
      position: relative;
      &.left {
        left: calc(((100%- 60px)/12 + 30px)/2 - 15px);
      }
      &.right {
        right: calc(((100%- 60px)/12 + 30px)/2 - 15px);
      }
    }
    .select {
      flex: 1;
      display: flex;
      .select-wrapper {
        flex: 1;
        &:first-child {
          .line {
            &:first-child {
              border:none
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border:none
            }
          }
        }
        @include center;
        .line {
          flex: 1;
          height: 0;
          border-top: px2rem(1) solid hsl(0, 0%, 80%);
        }
        .point-wrapper {
          position: relative;
          width: 0;
          height: px2rem(4);
          border-left: px2rem(1) solid hsl(0, 0%, 80%);
          .point {
            position: absolute;
            top: px2rem(-8);
            left: px2rem(-10);
            width: px2rem(20);
            height: px2rem(20);
            background-color: white;
            border-radius: 50%;
            border: px2rem(1) solid rgba( 0, 0, 0, .15);
            display: flex;
            @include center;
            .small-point {
              width: px2rem(5);
              height: px2rem(5);
              border-radius: 50%;
              background-color: black;
            }
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    @include center;
    font-size: px2rem(15);
    .setting-font-family-text {
      @include center
    }
    .setting-font-family-icon {
      @include center
    }
  }
}
</style>
