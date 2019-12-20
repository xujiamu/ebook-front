<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  if (fontSize > 50) fontSize = 50
  html.style.fontSize = fontSize + 'px'
})
</script>

<style lang="scss" scoped>
  @import "./assets/styles/global";
</style>
