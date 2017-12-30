// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './theme.scss'

import Vue from 'vue'
import App from './App'

import router from './router'

import regulations from './assets/regulationsAndGuidelines.json'

Vue.config.productionTip = false

Vue.filter('link', (value) => '#' + value)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: {
    regulations
  },
  template: '<App/>',
  components: { App }
})
