<template>
  <div class="home">
    <span class="test">ABCDE</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const getter = {
  a: () => 1,
  b: () => 2
}
function fn (keys) {
  const obj = {}
  keys.forEach((key) => {
    if (getter.hasOwnProperty(key)) {
      obj[key] = getter[key]
    }
  })
  return obj
}

export default {
  name: 'home',
  computed: {
    ...mapGetters(['test']),
    ...fn(['a', 'b', 'c'])
  },
  mounted () {
    // this.$store.dispatch('changeTest', 10).then(() => {
    //   console.log(this.$store.state.book.test)
    //   console.log(this.test)
    // })
    console.log(this.a, this.b, this.c)
  }
}
</script>

<style scoped>
  .test {
    font-family: "Days One";
    color: red;
  }
</style>
