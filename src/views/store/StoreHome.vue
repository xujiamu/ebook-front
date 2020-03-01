<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flip-card :data="random"></flip-card>
    <scroll :top="94" @onScroll="onScroll">
      <div>
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
        1111111
      </div>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import Scroll from '../../components/common/Scroll'
import { storeHomeMixin } from '../../utils/mixin'
import FlipCard from '../../components/home/FlipCard'
import { home } from '../../api/store'

export default {
  components: {
    FlipCard,
    Scroll,
    SearchBar
  },
  data() {
    return {
      random: null
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
        this.random = data.random[randomIndex]
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
}
</style>
