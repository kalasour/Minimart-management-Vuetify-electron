import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';
const storage = require("electron-json-storage");
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SearchField: '',
    JSONInformation: null,
    JSONStock: null,
    JSONCustomers: null,
    JSONInvoice: null,
    Invoice: [],
    Customers: [],
    Stock: [],
    List: []
  },

  actions: {
  },

  mutations: {
    SetSF(state, text) {
      state.SearchField = text
    },

    async initialize(state) {
      state.Stock = []
      state.Customers = []
      await storage.getAll((error, data) => {
        if (error) throw error;
        state.JSONStock = data.Stock;
        state.JSONCustomers = data.Customers;
        state.JSONInformation = data.Information;
        state.JSONInvoice = data.Invoice;
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

          if (state.JSONInvoice !== null)
          Object.keys(state.JSONInvoice).map(key => {
            state.JSONInvoice[key].ID = key;
            state.Invoice.push(state.JSONInvoice[key]);
          });
      });
    },
    UpdateInformation(state, NewInformation) {
      state.JSONInformation = Object.assign({}, NewInformation)
      storage.set("Information", NewInformation)
    },
    async UpdateStock(state) {
      state.JSONStock = {};
      await state.Stock.map(item => {
        state.JSONStock[item.Barcode_ID] = item;
      });
      storage.set("Stock", state.JSONStock);
    },
    async UpdateCustomers(state) {
      state.JSONCustomers = {};

      await state.Customers.map(item => {
        state.JSONCustomers[item.ID] = item;
      });
      storage.set("Customers", state.JSONCustomers);
    },
    async CreateInvoice(state,new_invoice){
      new_invoice.ID=state.Invoice.length.toString()
      state.Invoice.push(new_invoice)
    }
    ,
    async UpdateInvoice(state) {
      state.JSONInvoice = {};

      await state.Invoice.map(item => {
        state.JSONInvoice[item.ID] = item;
      });
      storage.set("Invoice", state.JSONInvoice);
    }
  },
})
