<template>
  <div id="app">
    <v-app id="inspire">
      <div>
        <v-toolbar flat>
          <v-toolbar-title>Report</v-toolbar-title>
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
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.ID" disabled label="ID"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Paid" label="Paid"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogList" max-width="500">
            <v-card>
              <v-card-text>Note : <span class="grey--text" v-if="itemSelected.Note==''||itemSelected.Note==null">Empty note!</span>
               <span v-else>{{itemSelected.Note}}</span>
               </v-card-text>

              <v-list>
                <v-card-text class="text-xs-center"><h3>List of items </h3></v-card-text>
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
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="dialogList = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogCustomer" max-width="500">
            <v-card>
              <v-list>
                <v-list-tile v-for="subItem in Object.keys(customerSelected)" :key="subItem">
                  <v-list-tile-content>
                    <v-list-tile-title
                      v-if="subItem!=='active'"
                    >{{ subItem }} : {{customerSelected[subItem]}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="dialogCustomer = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-data-table :headers="headers" :items="Invoice.filter(filterTable)" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.InvoiceNumber}}</td>
            <td class="text-xs-center">
              <v-btn @click="clickCustomer(props.item.Customer)">{{props.item.Customer.Name}}</v-btn>
            </td>
            <td class="text-xs-center">{{ props.item.date }}</td>
            <td class="text-xs-center">{{ props.item.TotalPiece }}</td>
            <!-- <td class="text-xs-center">{{ props.item.Paid }}</td> -->
            <td class="justify-center">
              <div class="text-xs-center" v-if="parseFloat(props.item.Paid)>=props.item.TotalPrice">
                <span class="green--text">Paid</span>
                <v-icon small color="green" class="mr-2">verified_user</v-icon>
              </div>
              <div class="text-xs-center" v-else>
                <span class="red--text">Due</span>
                <v-icon small color="red" class="mr-2">clear</v-icon>
              </div>
            </td>
            <td class="text-xs-center">
              <v-btn @click="clickList(props.item)">Note of Invoice</v-btn>
            </td>
            <!-- <td class="text-xs-center">{{ props.item.Note }}</td> -->
            <td class="justify-center layout px-1">
              <!-- <v-icon small @click="deleteItem(props.item)">local_printshop</v-icon> -->
              <v-icon small class="mr-2" @click="print(props.item)">local_printshop</v-icon>
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Refresh</v-btn>
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
import { Promise } from "q";
const DateFormat = "MMMM Do YYYY, h:mm:ss a";
export default {
  data: () => ({
    menu: false,
    modal: false,
    menu2: false,
    dialog: false,
    dialogCustomer: false,
    dialogList: false,
    headers: [
      { text: "Invoice No.",value: "InvoiceNumber", align: "left", sortable: true },
      { text: "Customer Name", value: "Customer.Name", align: "center" },
      { text: "Date", sortable: false, align: "center" },
      { text: "Total Amount", sortable: false, align: "center" },
      { text: "Payment Status", sortable: false, align: "center" },
      { text: "Note", sortable: false, align: "center" },
      { text: "Action", sortable: false, align: "center" }
    ],
    editedIndex: -1,
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
    print(invoice) {
      ipcRenderer.send("printPDF", invoice);
    },
    clickList(item) {
      this.itemSelected = item;
      this.listSelected=item.List
      this.dialogList = true;
    },
    clickCustomer(lastCustomer) {
      this.customerSelected = lastCustomer;
      this.dialogCustomer = true;
    },

    clearSF() {
      this.$store.commit("SetSF", "");
    },
    look(data) {
      console.log(data);
    },
    ...mapMutations(["initialize", "UpdateInvoice"]),
    filterTable(element) {
      

      return (
        (element.ID == null ? "" : element.ID)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 &&
        (this.dateStart == null ||
          moment(element.date, DateFormat) >= moment(this.dateStart)) &&
        (this.dateEnd == null ||
          moment(element.date, DateFormat) <= moment(this.dateEnd))
      );
    },
    editItem(item) {
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
