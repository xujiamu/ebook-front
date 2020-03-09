<template>
  <div class="shelf-item-add">
    <!--字体图标-->
    <span class="icon-add"></span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-item-add {
  width: 100%;
  height: 100%;
  border: px2rem(1) solid #ccc;
  /* 消除边框多出来的宽高 */
  box-sizing: border-box;
  @include center;
  .icon-add {
    font-size: px2rem(40);
    color: #ccc;
  }
}
</style>
