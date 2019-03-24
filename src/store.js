import Vue from 'vue'
import Vuex from 'vuex'
const storage = require("electron-json-storage");
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SearchField: '',
    JSONStock: null,
    Stock: [],
  },

  actions: {
  },

  mutations: {
    SetSF(state,text) {
      state.SearchField=text
    },
    async initialize(state) {
      state.Stock=[]
      await storage.getAll((error, data) => {
        if (error) throw error;
        state.JSONStock = data.Stock;
        if (state.JSONStock !== null)
          Object.keys(state.JSONStock).map(key => {
            state.JSONStock[key].Barcode_ID = key;
            state.Stock.push(state.JSONStock[key]);
          });
      });
    },
    async UpdateStock(state) {
      var _stock = {};
      await state.Stock.map(item => {
        _stock[item.Barcode_ID] = item;
      });
      storage.set("Stock", _stock);
    }
  },
})
