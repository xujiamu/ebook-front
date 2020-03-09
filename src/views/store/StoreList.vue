<template>
  <div class="book-list-wrapper">
    <detail-title :title="title"
                  :showShelf="true"
                  @back="back"
                  ref="title"></detail-title>
    <scroll class="book-list-scroll-wrapper"
            :top="42"
            @onScroll="onScroll"
            ref="scroll">
      <!-- 这里复用了精选组件 -->
      <featured :data="value" :titleText="titleText ? titleText : getCategoryText(key)" :btnText="''" v-for="(value, key, index) in list"
                :key="index"></featured>
    </scroll>
  </div>
</template>

<script>
import DetailTitle from '../../components/detail/DetaiTitle'
import Scroll from '../../components/common/Scroll'
import Featured from '../../components/home/Featured'
import { realPx } from '../../utils/utils'
import { list } from '../../api/store'
import { categoryList, categoryText } from '../../utils/store'

export default {
  components: {
    DetailTitle,
    Scroll,
    Featured
  },
  computed: {
    title() {
      if (this.list) {
        return this.total && this.$t('home.allBook').replace('$1', this.totalNumber)
      } else {
        return null
      }
    },
    totalNumber() {
      let num = 0
      Object.keys(this.list).forEach(key => {
        num += this.list[key].length
      })
      return num
    }
  },
  data() {
    return {
      list: null,
      total: null
    }
  },
  methods: {
    getCategoryText(key) {
      return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
    },
    back() {
      this.$router.go(-1)
    },
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow()
      } else {
        this.$refs.title.hideShadow()
      }
    },
    getList() {
      // 通过list请求获取所有的电子书数据
      list().then(response => {
        // 数据内容
        this.list = response.data.data
        // 图书总计
        this.total = response.data.total
        // 通过传入的category得到具体分类
        const category = this.$route.query.category
        // 通过传入的keyword得到查询关键字
        const keyword = this.$route.query.keyword
        // 如果category存在
        if (category) {
          // 则通过Object.keys得到所有属性的数组，从中过滤出于category相同的元素的数组，通过[0]将其取出
          const key = Object.keys(this.list).filter(item => item === category)[0]
          // 将对应数据保存
          const data = this.list[key]
          // 重置list 并更新
          this.list = {}
          this.list[key] = data
        } else if (keyword) {
          // 通过Object.keys得到所有属性的数组
          Object.keys(this.list).filter(key => {
            // 之后对所每个key再次进行二次遍历，通过indexOf判断 是否包含keyword的内容,将符合条件的值返回，替换掉原数组
            this.list[key] = this.list[key].filter(book => book.fileName.indexOf(keyword) >= 0)
            // 判断此时的数组是否有值，若有则返回,注：该步对于数据没有实际影响
            return this.list[key].length > 0
          })
        }
      })
    }
  },
  created() {
    // 创建时调用getList方法
    this.getList()
    this.titleText = this.$route.query.categoryText
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.book-list-wrapper {
  width: 100%;
  height: 100%;
  background: white;
}
</style>
