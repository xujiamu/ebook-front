<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="setting-popup-title">
        <div class="setting-popup-title-back" @click="hide">
          <span class="icon-back"></span>
        </div>
        <div class="setting-popup-title-text"> {{$t('book.selectFont')}}</div>
      </div>
      <div class="setting-popup-wrapper">
        <div class="setting-popup-item"
             v-for="(item,index) in fontFamily"
             :key="index">
          <div class="setting-popup-item-font"
               :class="{'select':defaultFontFamily === item.font}"
               @click="setFontFamily(item.font)">{{item.font}}</div>
          <div class="setting-popup-item-icon" v-show="defaultFontFamily === item.font">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from '../../utils/mixin'
import { FONT_FAMILY } from '../../utils/book'
import { saveFontFamily } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  methods: {
    hide() {
      this.setFontFamilyVisible(false)
    },
    setFontFamily(font) {
      this.setDefaultFontFamily(font)
      saveFontFamily(this.fileName, font)
      if (this.defaultFontFamily === 'Default') {
        this.currentBook.rendition.themes.font('Times New Roman')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
      return true
    }
  },
  data() {
    return {
      fontFamily: FONT_FAMILY
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-popup-list {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: #fff;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .setting-popup-title {
    box-sizing: border-box;
    font-size: px2rem(16);
    padding: px2rem(10);
    border-bottom: px2rem(1) solid #b8b9bb;
    font-weight: bold;
    .setting-popup-title-back {
      position: absolute;
      margin-left: px2rem(10);
    }
    .setting-popup-title-text {
      text-align: center;
    }
  }
  .setting-popup-wrapper {
    .setting-popup-item {
      box-sizing: border-box;
      padding: px2rem(15) px2rem(45);
      font-size: px2rem(14);
      display: flex;
      .setting-popup-item-font {
        &.select {
          color:  #346cb9;
          font-weight: bold;
        }
        text-align: left;
      }
      .setting-popup-item-icon {
        flex: 1;
        text-align: right;
        color: #346cb9;
        font-weight:  bold;
      }
    }
  }
}
</style>
