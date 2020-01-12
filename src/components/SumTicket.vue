<template>
  <div id="app">
    <v-app id="inspire">
      <div>
        <v-toolbar flat>
          <v-toolbar-title>Summary Sale</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <template v-if="SearchField!==''">
            <v-chip close color="blue" text-color="white" @input="clearSF">
              <v-avatar>
                <v-icon>search</v-icon>
              </v-avatar>
              {{SearchField}}
            </v-chip>
          </template>
          <v-flex xs12 sm6 md4>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dateStart"
                  label="Start date"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>

              <v-date-picker v-model="dateStart" @input="menu = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-icon v-if="dateStart!==null" @click="dateStart = null">close</v-icon>
          <v-flex xs12 sm6 md4>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dateEnd"
                  label="End date"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateEnd" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-icon v-if="dateEnd!==null" @click="dateEnd = null">close</v-icon>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1200px">
            <EditInvoice v-bind:selected="SelectedInvoice" />
            <div class="text-xs-right" dark>
              <v-btn @click="dialog=false">Close</v-btn>
            </div>
          </v-dialog>

          <v-dialog v-model="dialogList" max-width="500">
            <v-card>
              <v-card-text class="text-xs-center">
                <h3>Note</h3>
              </v-card-text>
              <v-card-text>
                <span
                  class="grey--text"
                  v-if="itemSelected.Note==''||itemSelected.Note==null"
                >Empty note!</span>
                <span v-else>{{itemSelected.Note}}</span>
              </v-card-text>

              <!-- <v-list>
                <v-card-text class="text-xs-center">
                  <h3>List of items</h3>
                </v-card-text>
                <v-list-group
                  v-for="item in Object.values(listSelected)"
                  :key="item.Barcode_ID"
                  v-model="item.active"
                  no-action
                >
                  <template v-slot:activator>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.Detail }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>

                  <v-list-tile v-for="subItem in Object.keys(item)" :key="subItem">
                    <v-list-tile-content>
                      <v-list-tile-title v-if="subItem!=='active'">{{ subItem }} : {{item[subItem]}}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
              </v-list>-->
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="dialogList = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogInvoice" max-width="1200px">
            <InvoiceDetail v-bind:selected="SelectedInvoice" />
            <div class="text-xs-right" dark>
              <v-btn @click="dialogInvoice=false">Close</v-btn>
            </div>
          </v-dialog>
          <v-dialog v-model="dialogCustomer" max-width="1200px">
            <ItemList v-bind:selected="SelectedCustomer" />
            <div class="text-xs-right" dark>
              <v-btn @click="dialogCustomer = false">Close</v-btn>
            </div>
          </v-dialog>
        </v-toolbar>
        <v-data-table
          :rows-per-page-items="[{text:'All',value:-1}]"
          :headers="headers"
          :items="Invoice.filter(filterTable)"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>
              <v-btn @click="show(props.item)">{{ props.item.InvoiceNumber}}</v-btn>
            </td>
            <td class="text-xs-center">{{props.item.Customer.Name}}</td>
            <td class="text-xs-center">{{ (props.item.TotalPrice-props.item.TotalTax).toFixed(2) }}</td>
            <td class="text-xs-center">{{ props.item.TotalTax }}</td>
            <td class="text-xs-center">{{ props.item.TotalPrice }}</td>
          </template>
          <template v-slot:footer>
            <td class="px-0 mx-0 grey darken-1">
              <v-layout row justify-space-around align-center>
                <v-flex xs4 class="text-xs-center">
                  <v-hover>
                    <v-card
                      @click="ipc('ViewSum')"
                      style="cursor: pointer"
                      class="grey darken-1 ma-0 pa-0"
                      flat
                      slot-scope="{ hover }"
                    >
                      <v-icon :large="hover" class="text-xs-center mx-3">search</v-icon>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs4 class="text-xs-center">
                  <v-hover>
                    <v-card
                      @click="ipc('SaveSum')"
                      style="cursor: pointer"
                      class="grey darken-1 ma-0 pa-0"
                      flat
                      slot-scope="{ hover }"
                    >
                      <v-icon :large="hover" class="mx-3">save</v-icon>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs4 class="text-xs-center">
                  <v-hover>
                    <v-card
                      @click="ipc('PrintSum')"
                      style="cursor: pointer"
                      class="grey darken-1 ma-0 pa-0"
                      flat
                      slot-scope="{ hover }"
                    >
                      <v-icon :large="hover" class="mx-3">local_printshop</v-icon>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-layout>
            </td>
            <td class="justify-center align-center grey darken-4 mx-0 px-0">
              <v-layout row class="justify-center align-center">
                <v-spacer></v-spacer>
                <v-btn large block class="text-xs-center" flat>Total</v-btn>
                <v-spacer></v-spacer>
                <v-divider vertical></v-divider>
              </v-layout>
            </td>
            <td
              class="text-xs-center grey darken-4"
            >{{ Invoice.filter(filterTable).map(a=>a.TotalPrice-a.TotalTax).reduce((a,b)=>a+b,0).toFixed(2) }}</td>
            <td
              class="text-xs-center grey darken-4"
            >{{ Invoice.filter(filterTable).map(a=>parseFloat(a.TotalTax)).reduce((a,b)=>a+b,0).toFixed(2) }}</td>
            <td class="text-xs-center grey darken-4">
              {{ Invoice.filter(filterTable).map(item => item.TotalPrice)
              .reduce((a, b) => {
              return parseFloat(a) + parseFloat(b);
              }, 0).toFixed(2) }}
            </td>
          </template>
        </v-data-table>
      </div>
    </v-app>
  </div>
</template>

<script>
const storage = require("electron-json-storage");
import moment from "moment";
import { mapMutations, mapState } from "vuex";
import { ipcRenderer } from "electron";
import InvoiceDetail from "./Invoice";
import EditInvoice from "./EditInvoice";
import ItemList from "./Report_customer";
import Vue from "vue";
Vue.component("InvoiceDetail", InvoiceDetail);
Vue.component("EditInvoice", EditInvoice);
Vue.component("ItemList", ItemList);
const DateFormat = "MMMM Do YYYY";
export default {
  data: () => ({
    SelectedInvoice: {},
    dialogInvoice: false,
    menu: false,
    modal: false,
    menu2: false,
    dialog: false,
    dialogCustomer: false,
    dialogList: false,
    headers: [
      {
        text: "Invoice No.",
        value: "InvoiceNumber",
        align: "left",
        sortable: true,
        width: "30%"
      },
      {
        text: "Customer Name",
        value: "Customer.Name",
        align: "center",
        width: "25%"
      },
      {
        text: "Net Sale",
        value: "(TotalPrice-TotalTax)",
        align: "center",
        width: "15%"
      },
      { text: "Taxes", value: "TotalTax", align: "center", width: "15%" },
      { text: "Total", value: "TotalPrice", align: "center", width: "15%" }
    ],
    editedIndex: -1,
    SelectedCustomer: {},
    editedItem: {},
    defaultItem: {},
    itemSelected: {},
    listSelected: {},
    customerSelected: {},
    dateStart: null,
    dateEnd: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapState(["SearchField", "JSONCustomers", "Customers", "Invoice"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    // this.initialize();
  },

  methods: {
    // genInvoiceNumber(item){
    //   item.InvoiceNumber = moment(item.date,DateFormat).format('Y')+'-'+item.ID.padStart(3, "0");
    //   return item.InvoiceNumber
    // },
    handleClick(item) {
      this.SelectedInvoice = item;
      this.dialogInvoice = true;
    },
    print(invoice) {
      ipcRenderer.send("printPDF", invoice);
    },
    show(invoice) {
      ipcRenderer.send("showPDF", invoice);
    },
    rec(invoice) {
      ipcRenderer.send("savePDF", invoice);
    },
    ipc(command) {
      var sum = {};
      var DateFormat = "MMMM Do YYYY";
      sum.dateStart =
        this.dateStart == null
          ? null
          : moment(this.dateStart).format(DateFormat);
      sum.dateEnd =
        this.dateEnd == null ? null : moment(this.dateEnd).format(DateFormat);
      sum.List = this.Invoice.filter(this.filterTable);
      sum.TotalSalenet = this.Invoice.filter(this.filterTable)
        .map(a => a.TotalPrice - a.TotalTax)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);
      sum.TotalTax = this.Invoice.filter(this.filterTable)
        .map(a => parseFloat(a.TotalTax))
        .reduce((a, b) => a + b, 0)
        .toFixed(2);
      sum.TotalPrice = this.Invoice.filter(this.filterTable)
        .map(item => item.TotalPrice)
        .reduce((a, b) => {
          return parseFloat(a) + parseFloat(b);
        }, 0)
        .toFixed(2);
      ipcRenderer.send(command, sum);
    },
    clickList(item) {
      this.itemSelected = item;
      this.listSelected = item.List;
      this.dialogList = true;
    },
    clickCustomer(lastCustomer) {
      this.SelectedCustomer = lastCustomer;
      this.customerSelected = lastCustomer;
      this.dialogCustomer = true;
    },

    clearSF() {
      this.$store.commit("SetSF", "");
    },
    look(data) {
      alert(data);
    },
    ...mapMutations(["initialize", "UpdateInvoice"]),
    filterTable(element) {
      return (
        ((element.InvoiceNumber == null ? "" : element.InvoiceNumber)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
          (element.Customer.Name == null ? "" : element.Customer.Name)
            .toLowerCase()
            .indexOf(
              (this.SearchField == null ? "" : this.SearchField).toLowerCase()
            ) > -1) &&
        element.isOpTicket &&
        (this.dateStart == null ||
          moment(element.date, DateFormat) >= moment(this.dateStart)) &&
        (this.dateEnd == null ||
          moment(element.date, DateFormat) <= moment(this.dateEnd))
      );
    },
    editItem(item) {
      this.SelectedInvoice = Object.assign({}, item);
      this.editedIndex = this.Invoice.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.Invoice.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.Invoice.splice(index, 1);
      this.UpdateInvoice();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      if (this.editedItem.ID == "" || this.editedItem.ID == null) {
        alert("Please Input  ID");
        return;
      } else {
        var con = true;
        await Promise.all(
          this.Invoice.map(async (item, index) => {
            if (this.editedItem.ID == item.ID && this.editedIndex !== index) {
              await alert("This ID is already!");
              con = false;
              return;
            }
          })
        );
        if (con) {
          if (this.editedIndex > -1) {
            Object.assign(this.Invoice[this.editedIndex], this.editedItem);
          } else {
            this.Invoice.push(this.editedItem);
          }
          this.close();
          this.UpdateInvoice();
        }
      }
    }
  }
};
</script>

<style>
</style>
