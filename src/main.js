import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
import i18n from './lang'
// import './mock'
import './utils/boost'
import './utils/create-api'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  loading: require('./assets/images/placeholder.png'),
  attempt: 1
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
