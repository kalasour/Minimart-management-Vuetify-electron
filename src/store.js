import Vue from "vue";
import Vuex from "vuex";
import { stat } from "fs";
import moment from "moment";
const storage = require("electron-json-storage");
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    SearchField: "",
    JSONInformation: null,
    JSONStock: null,
    JSONCustomers: null,
    JSONInvoice: null,
    Invoice: [],
    Customers: [],
    Stock: [],
    List: [],
    TicketList: [],
    InvoiceGroupList: [],
    isDevelopment: process.env.NODE_ENV !== "production",
  },

  actions: {},

  mutations: {
    SetSF(state, text) {
      state.SearchField = text;
    },

    async initialize(state) {
      state.Stock = [];
      state.Customers = [];

      await storage.getAll((error, data) => {
        if (error) throw error;
        state.JSONStock = data.Stock;
        state.JSONCustomers = data.Customers;
        state.JSONInformation = data.Information;
        state.JSONInvoice = data.Invoice;
        if (data.InvoiceGroup != undefined)
          Vue.set(state, "InvoiceGroupList", data.InvoiceGroup.list);
        if (state.JSONStock !== null)
          Object.keys(state.JSONStock).map((key) => {
            if (
              state.JSONStock[key].code == "" ||
              state.JSONStock[key].code == null ||
              state.JSONStock[key].code == undefined
            )
              state.JSONStock[key].code = state.JSONStock[key].Detail;
            state.Stock.push(state.JSONStock[key]);
          });

        if (state.JSONCustomers !== null)
          Object.keys(state.JSONCustomers).map((key) => {
            state.JSONCustomers[key].ID = key;
            state.Customers.push(state.JSONCustomers[key]);
          });

        if (state.JSONInvoice !== null)
          Object.keys(state.JSONInvoice).map((key) => {
            state.JSONInvoice[key].ID = key;
            state.Invoice.push(state.JSONInvoice[key]);
          });
      });
    },
    UpdateInformation(state, NewInformation) {
      state.JSONInformation = Object.assign({}, NewInformation);
      storage.set("Information", NewInformation);
    },
    async UpdateStock(state) {
      state.JSONStock = {};
      await state.Stock.map((item, index) => {
        state.JSONStock[index] = item;
      });
      storage.set("Stock", state.JSONStock);
    },
    async UpdateCustomers(state) {
      state.JSONCustomers = {};

      await state.Customers.map((item) => {
        state.JSONCustomers[item.ID] = item;
      });
      storage.set("Customers", state.JSONCustomers);
    },
    async CreateInvoice(state, new_invoice) {
      const year = moment(new Date(), "MMMM Do YYYY, h:mm:ss a").format("Y");
      if (state.Invoice.length == 0) {
        new_invoice.ID = "1";
        new_invoice.InvoiceNumber =
          year + "-" + new_invoice.ID.padStart(3, "0");
      } else {
        new_invoice.ID = (
          parseInt(state.Invoice[state.Invoice.length - 1].ID) + 1
        ).toString();
        const lastInvoiceNumber = state.Invoice[
          state.Invoice.length - 1
        ].InvoiceNumber.split("-");
        const tempNumber = (parseInt(lastInvoiceNumber[1]) + 1).toString();
        const tempYear = lastInvoiceNumber[0];
        var invoiceNumber = tempNumber.padStart(3, "0");
        if (parseInt(year) != parseInt(tempYear)) {
          invoiceNumber = "001";
        }
        new_invoice.InvoiceNumber = year + "-" + invoiceNumber;
      }
      state.Invoice.push(new_invoice);
    },
    async UpdateInvoice(state) {
      state.JSONInvoice = {};
      await state.Invoice.map((item) => {
        item.Credit = Math.max(
          0,
          parseFloat(item.Paid) - parseFloat(item.TotalPrice)
        ).toFixed(2);
        state.JSONInvoice[item.ID] = item;
      });
      storage.set("Invoice", state.JSONInvoice);
    },
    async UpdateInvoiceGroup(state) {
      let obj = {
        list: state.InvoiceGroupList.map((item, index) => {
          item.ID = index;
          return item;
        }),
      };

      storage.set("InvoiceGroup", obj);
    },
    async CreateInvoiceGroup(state, newInvoiceGroup) {
      state.InvoiceGroupList.push(newInvoiceGroup);
      this.commit("UpdateInvoiceGroup");
    },
  },
});
