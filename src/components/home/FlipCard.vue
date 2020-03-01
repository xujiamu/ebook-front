<template>
  <div class="flip-card-wrapper" v-show="flipCardVisible">
    <div class="flip-card-bg" :class="{'animation': runFlipCardAnimation}" v-show="runFlipCardAnimation">
      <div class="flip-card" v-for="(item, index) in flipCardList"
           :key=index
           :style="{zIndex: item.zIndex}">
        <div class="flip-card-circle">
          <div class="flip-card-semi-circle flip-card-semi-circle-left"
               :style="semiCircleStyle(item, 'left')"  ref='left'>
          </div>
          <div class="flip-card-semi-circle flip-card-semi-circle-right"
               :style="semiCircleStyle(item, 'right')"  ref='right'>
          </div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point"
             v-for="item in pointList" :key="item"
             :class="{'animation': runPointAnimation}"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import { flipCardList, categoryText } from '../../utils/store'

export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flipCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlipCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    flipCardVisible(v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    close() {
      this.stopAnimation()
      this.setFlipCardVisible(false)
    },
    runAnimation() {
      this.runFlipCardAnimation = true
      this.timeTask2 = setTimeout(() => {
        this.startFlipCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeTask = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === `left` ? item.imgLeft : item.imgRight
      }
    },
    rotate(index, type) {
      const item = this.flipCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    flipCardRotate() {
      const frontFlipCard = this.flipCardList[this.front]
      const backFlipCard = this.flipCardList[this.back]
      frontFlipCard.rotateDegree += 10
      frontFlipCard._g -= 5
      backFlipCard.rotateDegree -= 10
      backFlipCard._g += 5
      if (frontFlipCard.rotateDegree === 90 && backFlipCard.rotateDegree === 90) {
        backFlipCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlipCard.rotateDegree === 180 && backFlipCard.rotateDegree === 0) {
        this.next()
      }
    },
    next() {
      const frontFlipCard = this.flipCardList[this.front]
      const backFlipCard = this.flipCardList[this.back]
      frontFlipCard.rotateDegree = 0
      backFlipCard.rotateDegree = 0
      frontFlipCard._g = frontFlipCard.g
      backFlipCard._g = backFlipCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flipCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      this.flipCardList.forEach((item, index) => {
        item.zIndex = 100 - (index - this.front + len) % len
      })
      this.prepare()
    },
    prepare() {
      const backFlipCard = this.flipCardList[this.back]
      backFlipCard.rotateDegree = 180
      backFlipCard._g = backFlipCard.g - 5 * 18
      this.rotate(this.back, 'back')
    },
    startFlipCardAnimation() {
      this.prepare()
      this.task = setInterval(() => {
        this.flipCardRotate()
      }, this.intervalTime)
    },
    reset() {
      this.front = 0
      this.back = 1
      this.flipCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runBookCardAnimation = false
      this.runFlipCardAnimation = false
      this.runPointAnimation = false
    },
    startPointAnimation() {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeTask) {
        clearTimeout(this.timeTask)
      }
      if (this.timeTask2) {
        clearTimeout(this.timeTask)
      }
      this.reset()
    },
    categoryText() {
      // 这里需要做一次判断，在请求到结果之前data为null
      if (this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    }
  },
  created() {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
@import "../../assets/styles/flipCard";

.flip-card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, .6);
  @include center;
  .flip-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: flip-card-move .3s ease-in both;
    }
    @keyframes flip-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flip-card {
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flip-card-circle {
        display: flex;
        height: 100%;
        width: 100%;
        .flip-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility:hidden;
        }
        .flip-card-semi-circle-left{
          border-radius: px2rem(24) 0  0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flip-card-semi-circle-right{
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      @include absCenter;
      z-index: 1500;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    max-width: px2rem(400);
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale .3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2)
        }
        .content-author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .content-category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: white;
      @include center;
    }
  }
}

</style>
