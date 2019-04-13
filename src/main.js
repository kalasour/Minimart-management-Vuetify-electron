import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
const homedir = require('os').homedir()+'\\.MinimartData';
const storage = require('electron-json-storage');
storage.setDataPath(homedir + '\\Mini-mart-electron-vue-data-json');

var fs = require("fs-extra");
 
var source =homedir + '\\Mini-mart-electron-vue-data-json'
var destination = homedir + '\\Backup\\' +new Date().toDateString()
 
// copy source folder to destination
fs.copy(source, destination, function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('Copy completed!')
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
