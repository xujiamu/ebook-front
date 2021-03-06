<template>
  <div>
    <div class="search-bar"  :class="{'hide-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper"  v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper"  @click="showFlipCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" @click="back" :class="{'hide-title': !titleVisible}">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text"
                 class="input"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
                 @keyup.enter.exact="search">
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import HotSearchList from './HotSearchList'

export default {
  components: { HotSearchList },
  mixins: [storeHomeMixin],
  data() {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY(offsetY) {
      if (offsetY) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search() {
      // 根据输入内容，进行路由跳转
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlipCard() {
      this.setFlipCardVisible(true)
    },
    back() {
      if (this.hotSearchVisible) {
        this.hideHotSearch()
      } else {
        this.$router.push('/store/shelf')
      }
    },
    showHotSearch() {
      this.hideTitle()
      this.hotSearchVisible = true
      this.hideShadow()
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideHotSearch() {
      this.hotSearchVisible = false
      if (this.offsetY) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hideTitle() {
      this.titleVisible = false
    },
    showTitle() {
      this.titleVisible = true
    },
    hideShadow() {
      this.shadowVisible = false
    },
    showShadow() {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.search-bar{
  z-index: 150;
  position: relative;
  width: 100%;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, .1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    width: 100%;
    height: px2rem(42);
    position: absolute;
    top: 0;
    left: 0;
    .title-text-wrapper {
      height: px2rem(42);
      width: 100%;
      font-size: px2rem(16);
      @include center
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    height: px2rem(42);
    left: px2rem(15);
    top: 0;
    transition: top $animationTime linear;
    z-index: 200;
    @include center;
    &.hide-title {
      height: px2rem(52)
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    left: 0;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime linear;
    display: flex;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      transition: top $animationTime linear;
      &.hide-title {
        flex: 0 0 px2rem(31)
      }
    }
    .search-bar-input {
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      border: px2rem(1) solid #eee;
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        background: transparent;
        &:focus {
          outline: none;
        }
        &::placeholder {
          color: #ccc;
        }
      }
    }
  }
}

</style>
