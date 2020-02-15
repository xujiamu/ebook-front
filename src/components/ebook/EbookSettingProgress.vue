<template>
  <transition name='slide-up'>
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" >
            <span class="icon-back" @click="prevSection"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 :value="progress"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper">
            <span class="icon-forward" @click="nextSection"></span>
          </div>
          <div class="text-wrapper">
            <span class="progress-section-text">{{getSectionName}}</span>
            <span>{{!bookAvailable?`加载中...`:progress+"%"}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  updated() {
    this.updateProgressBackground()
  },
  computed: {
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    // 进度条拖动松手时调用的方法
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBackground()
      })
    },
    // 进度条拖动过程中调用的方法
    onProgressInput(progress) {
      this.setProgress(progress)
      this.updateProgressBackground()
    },
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      this.display(cfi)
    },
    updateProgressBackground() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection() {
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
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
  .setting-progress {
    width: 100%;
    height: 100%;
    position: relative;
    .read-time-wrapper{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(14);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(20)
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        height: px2rem(2);
        margin: 0 px2rem(10);
        &:focus {
          outline: none
        }
        &::-webkit-slider-thumb,&::-moz-range-thumb {
          -webkit-appearance: none;
          -moz-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
          border: px2rem(1) solid #ddd;
        }
      }
      .text-wrapper {
        position: absolute;
        @include center;
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        bottom: px2rem(10);
        span {
          font-size: px2rem(14);
        }
        @include ellipsis
      }
    }
  }
}
</style>
