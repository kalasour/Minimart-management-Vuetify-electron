import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

const storage = require('electron-json-storage');
storage.setDataPath(process.cwd() + '/Mini-mart-electron-vue-data-json');
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
