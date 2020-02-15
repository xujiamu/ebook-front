<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils'

export default {
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}]
      ],
      lineWidth: [20, 20, 20, 20, 20, 20],
      add: true,
      end: false
    }
  },
  mounted () {
    this.task = setInterval(() => {
      this.$refs.line.forEach((item, index) => {
        if (index === 0) {
          if (this.add && this.lineWidth[index] > 0) {
            this.lineWidth[index]--
          } else if (!this.add && this.lineWidth[index] < 20) {
            this.lineWidth[index]++
          }
        } else {
          if (this.add && this.lineWidth[index] > 0) {
            let preLine = this.lineWidth[index - 1]
            if (preLine <= 10) {
              this.lineWidth[index]--
            }
          } else if (!this.add && this.lineWidth[index] < 20) {
            let preLine = this.lineWidth[index - 1]
            if (preLine >= 10) {
              this.lineWidth[index]++
            }
          }
        }

        item.style.flex = `0 0 ${px2rem(this.lineWidth[index])}rem`
        if (index === this.lineWidth.length - 1) {
          if (this.add && this.lineWidth[index] === 0) {
            this.end = true
          } else if (!this.add && this.lineWidth[index] === 20) {
            this.end = true
          }
        }
        if (this.end) {
          this.end = !this.end
          this.add = !this.add
        }
      })
    }, 20)
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.ebook-loading {
  position: relative;
  width: px2rem(60);
  height: px2rem(43);
  border-radius: px2rem(4);
  background: transparent;
  border: px2rem(3) solid #d7d7d7;
  .ebook-loading-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 0 px2rem(5);
    .ebook-loading-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(5) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        @include left;
        .ebook-loading-line {
          flex: 0 0 px2rem(20);
          height: px2rem(2);
          background: #d7d7d7;
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      width: px2rem(1.5);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>
