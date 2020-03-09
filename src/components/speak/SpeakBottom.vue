<template>
  <div class="bottom-wrapper" :class="{'hide-play': !showPlay}">
    <div class="bottom-playing-wrapper" @click.stop.prevent="onPlayingCardClick" v-if="showPlay">
      <div class="bottom-playing-left">
        <!-- 播放暂停按钮，通过if判断图标的显示，togglePlay事件-->
        <div class="icon-play-wrapper" @click.stop.prevent="togglePlay">
          <span class="icon-play_go" v-if="!isPlaying"></span>
          <span class="icon-play_pause" v-else></span>
        </div>
      </div>
      <div class="bottom-playing-right">
        <div class="bottom-playing-chapter-text">
          <span class="chapter-label">{{chapter ? chapter.label : ''}}</span>
          <span class="bottom-playing-page-text" v-if="currentSectionIndex && currentSectionTotal">( {{currentSectionIndex}} / {{currentSectionTotal}} )</span>
        </div>
        <div class="bottom-playing-page-text">{{playInfo ? playInfo.currentMinute : '00'}}:{{playInfo ? playInfo.currentSecond : '00'}} / {{playInfo ? playInfo.totalMinute : '00'}}:{{playInfo ? playInfo.totalSecond : '00'}}</div>
      </div>
    </div>
    <div class="bottom-btn-wrapper">
      <span class="bottom-btn-text">{{$t('detail.addOrRemoveShelf')}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 章节
    chapter: Object,
    // 每个章节的语言会分成很多段
    // 当前章节语音段索引
    currentSectionIndex: Number,
    // 当前章节总计语音段
    currentSectionTotal: Number,
    // 是否显示播放面板
    showPlay: Boolean,
    // 是否播放
    isPlaying: Boolean,
    // 播放信息：里面包括了时长，剩余时长等相关信息，各类信息在
    // StoreSpeaking.vue中通过计算属性逐一实现
    playInfo: Object
  },
  methods: {
    togglePlay() {
      // 调用父组件的togglePlay方法
      this.$parent.togglePlay()
    },
    onPlayingCardClick() {
      this.$emit('onPlayingCardClick')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.bottom-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 110;
  width: 100%;
  height: px2rem(116);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-play {
    height: px2rem(52);
  }
  .bottom-playing-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(64);
    .bottom-playing-left {
      flex: 0 0 px2rem(70);
      width: px2rem(70);
      @include center;
      .icon-play-wrapper {
        flex: 0 0 px2rem(100);
        @include center;
        &:active {
          opacity: .5;
        }
        .icon-play_go {
          font-size: px2rem(40);
          color: $color-blue;
        }
        .icon-play_pause {
          font-size: px2rem(40);
          color: $color-blue;
        }
      }
    }
    .bottom-playing-right {
      flex: 1;
      padding-right: px2rem(15);
      box-sizing: border-box;
      @include columnLeft;
      .bottom-playing-chapter-text {
        max-width: px2rem(305);
        color: #333;
        font-size: px2rem(16);
        line-height: px2rem(19);
        @include ellipsis;
      }
      .bottom-playing-page-text {
        color: #666;
        font-size: px2rem(10);
        margin-top: px2rem(5);
      }
    }
  }
  .bottom-btn-wrapper {
    width: 100%;
    height: px2rem(52);
    border-top: px2rem(1) solid #eee;
    box-sizing: border-box;
    @include center;
    .bottom-btn-text {
      font-size: px2rem(14);
      color: $color-blue;
      font-weight: bold;
    }
  }
}
</style>
