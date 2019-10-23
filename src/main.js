import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuetify from "vuetify";

Vue.use(Vuetify, {
  iconfont: "md"
});
let homedir = require("os").homedir() + "\\.MinimartData";
let storage = require("electron-json-storage");
storage.setDataPath(homedir + "\\Mini-mart-electron-vue-data-json");
let source = homedir + "\\Mini-mart-electron-vue-data-json";
let destination = homedir + "\\Backup\\" + new Date().toDateString();
let fs = require("fs-extra");
let opsys = process.platform;
if (opsys == "darwin") {
  homedir = require("os").homedir() + "/.MinimartData";
  storage.setDataPath(homedir + "/Mini-mart-electron-vue-data-json");
  source = homedir + "/Mini-mart-electron-vue-data-json";
  destination = homedir + "/Backup/" + new Date().toDateString();
  opsys = "MacOS";
} else if (opsys == "win32" || opsys == "win64") {
  opsys = "Windows";
} else if (opsys == "linux") {
  opsys = "Linux";
}
// console.log(opsys);
// copy source folder to destination
fs.copy(source, destination, function(err) {
  if (err) {
    console.log("An error occured while copying the folder.");
    return console.error(err);
  }
  console.log("Copy completed!");
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
