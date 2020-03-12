<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flip-card :data="random"></flip-card>
    <scroll :top="94" @onScroll="onScroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage:`url(${banner})`}"></div>
      </div>
      <guess-you-like :data="gussYouLike"></guess-you-like>
      <recommend class="recommend" :data="recommend"></recommend>
      <featured class="featured" :data="featured"
                :titleText="$t('home.featured')"
                :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper"
           v-for="(item, index) in categoryList"
           :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category class="category" :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import Scroll from '../../components/common/Scroll'
import { storeHomeMixin } from '../../utils/mixin'
import FlipCard from '../../components/home/FlipCard'
import { home } from '../../api/store'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'

export default {
  components: {
    Category,
    CategoryBook,
    Featured,
    Recommend,
    GuessYouLike,
    FlipCard,
    Scroll,
    SearchBar
  },
  data() {
    return {
      random: null,
      banner: '',
      gussYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  mixins: [storeHomeMixin],
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted () {
    home().then(response => {
      // 响应存在，且状态码为200
      if (response && response.status === 200) {
        // 取出响应数据
        const data = response.data
        // 这里取出数组random中，随机数据对象，保存在random变量中
        const randomIndex = Math.floor(Math.random() * data.random.length)
        // 获取随机图书
        this.random = data.random[randomIndex]
        // 获取图片
        this.banner = data.banner
        // 猜你喜欢
        this.gussYouLike = data.guessYouLike
        // 推荐
        this.recommend = data.recommend
        // 精选
        this.featured = data.featured
        // 分类列表
        this.categoryList = data.categoryList
        // 分类
        this.categories = data.categories
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .category {
    margin-top: px2rem(20);
  }
}
</style>
