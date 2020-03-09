<template>
  <!--最外层的包裹层，用于给搜索框定位与控制高度 当点击搜索框后，改变整体布局为fixed-->
  <!-- 通过滚动与是否点击判断阴影的显示隐藏 -->
  <div class="shelf-search-wrapper"
       :class="{'search-top': ifInputClicked, 'hide-shadow': isHideShadow}">
    <!--搜索框，当点击搜索框时top归零-->
    <div class="shelf-search" :class="{'search-top': ifInputClicked}">
      <!--搜索框主体部分-->
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <div class="icon-search icon"></div>
        </div>
        <div class="search-input-wrapper">
          <input type="text" class="search-input" :placeholder="$t('shelf.search')"
                 @click="onSearchClick"
                 v-model="searchText">
        </div>
        <!--清空按钮的展示条件以及单击事件-->
        <div class="icon-clear-wrapper" @click="clearSearchText" v-show="searchText.length > 0">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <!--中英文切换,通过click事件实现-->
      <div class="icon-locale-wrapper" @click="switchLocale" v-if="!ifInputClicked">
        <!--通过计算属性判断中英文按钮的显示-->
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <!--取消按钮-->
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <!-- 选项卡过渡动画 -->
    <transition name="hot-search-move">
      <!--搜索选项卡，通过if判断 点击搜索框时选项卡显示-->
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <!--展示所有选项卡，并对点击选项卡加上样式-->
        <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { setLocalStorage } from '../../utils/localStorage'
import { storeShelfMixin } from '../../utils/mixin'

export default {
  mixins: [storeShelfMixin],
  watch: {
    // 判断vuex中保存的滚动距离是否大于0
    offsetY (v) {
      // 大于0且点击显示阴影，反之隐藏
      if (v > 0 && this.ifInputClicked) {
        this.isHideShadow = false
      } else {
        this.isHideShadow = true
      }
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ]
    }
  },
  data() {
    return {
      // 通过该变量控制中英文按钮和 取消按钮的交替显示，变量通过onSearchClick，onCancelClick事件切换
      ifInputClicked: false,
      searchText: '',
      selectedTab: 1,
      // 默认隐藏阴影
      isHideShadow: true
    }
  },
  methods: {
    onTabClick(id) {
      this.selectedTab = id
    },
    clearSearchText() {
      this.searchText = ''
    },
    switchLocale() {
      if (this.lang === 'en') {
        this.$i18n.locale = 'cn'
      } else {
        this.$i18n.locale = 'en'
      }
      // 保存改变的语言,注意这里语言改变的不是整体语言，只是书架部分的，所有不会使用saveLocale保存
      setLocalStorage(this.$i18n.locale)
    },
    onSearchClick() {
      this.ifInputClicked = true
      // 设置标题隐藏
      this.setShelfTitleVisible(false)
    },
    onCancelClick() {
      this.ifInputClicked = false
      // 设置标题显示
      this.setShelfTitleVisible(true)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-search-wrapper {
  position: relative;
  z-index: 105;
  width: 100%;
  /*标题高度加上搜索框高度*/
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-shadow {
    box-shadow: none;
  }
  &.search-top {
    /* 注意：该状态下，下方的ShelfList内容会上移,为了避免，需要在ShelfList组件中设置相应样式*/
    position: fixed;
    left: 0;
    top: 0;
  }
  /* 搜索框 */
  .shelf-search {
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(52);
    display: flex;
    /* 对top属性设置过渡 */
    transition: top .2s linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      flex: 1;
      display: flex;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include center;
        .search-input {
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-locale-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn, .icon-en {
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      @include center;
      flex: 0 0 px2rem(55);
      .cancel-text {
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .shelf-search-tab-wrapper {
    position: absolute;
    /*距离搜索框高度*/
    top: px2rem(52);
    left: 0;
    z-index: 105;
    display: flex;
    width: 100%;
    height: px2rem(42);
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-tab-text {
        font-size: px2rem(12);
        color: #999;
        &.is-selected {
          color: $color-blue;
        }
      }
    }
  }
}
</style>
