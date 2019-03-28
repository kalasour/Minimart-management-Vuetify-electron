import Vue from 'vue'
import Vuex from 'vuex'
const storage = require("electron-json-storage");
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SearchField: '',
    JSONStock: null,
    JSONCustomers:null,
    Customers:[],
    Stock: [],
    List:[]
  },

  actions: {
  },

  mutations: {
    SetSF(state,text) {
      state.SearchField=text
    },
    
    async initialize(state) {
      state.Stock=[]
      state.Customers=[]
      await storage.getAll((error, data) => {
        if (error) throw error;
        state.JSONStock = data.Stock;
        state.JSONCustomers = data.Customers;
        if (state.JSONStock !== null)
          Object.keys(state.JSONStock).map(key => {
            state.JSONStock[key].Barcode_ID = key;
            state.Stock.push(state.JSONStock[key]);
          });

          if (state.JSONCustomers !== null)
          Object.keys(state.JSONCustomers).map(key => {
            state.JSONCustomers[key].ID = key;
            state.Customers.push(state.JSONCustomers[key]);
          });
      });
    },
    async UpdateStock(state) {
      state.JSONStock= {};
      await state.Stock.map(item => {
        state.JSONStock[item.Barcode_ID] = item;
      });
      storage.set("Stock", state.JSONStock);
    },
    async UpdateCustomers(state) {
      state.JSONCustomers= {};
      
      await state.Customers.map(item => {
        state.JSONCustomers[item.ID] = item;
      });
      storage.set("Customers", state.JSONCustomers);
    }
  },
})
