<template>
  <div id="app">
    <v-app id="inspire">
      <div>
        <v-toolbar flat>
          <v-toolbar-title>Stock</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
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
                      <v-text-field v-model="editedItem.Detail" label="Detail"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Barcode_ID" label="BARCODE ID"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.BE_ID" label="BE ID"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Discount_amount" label="Discount(amount)"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Discount_per" label="Discount(%)"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.JM_ID" label="JM ID"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.QT" label="Quantities"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Unit_price" label="price/unit"></v-text-field>
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
        </v-toolbar>
        <v-data-table :headers="headers" :items="Stock" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.Detail }}</td>
            <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
            <td class="text-xs-center">{{ props.item.BE_ID }}</td>
            <td class="text-xs-center">{{ props.item.Discount_amount }}</td>
            <td class="text-xs-center">{{ props.item.Discount_per }}</td>
            <td class="text-xs-center">{{ props.item.JM_ID }}</td>
            <td class="text-xs-center">{{ props.item.QT }}</td>
            <td class="text-xs-center">{{ props.item.Unit_price }}</td>
            <td class="justify-center layout px-0">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </div>
    </v-app>
  </div>
</template>

<script>
const storage = require("electron-json-storage");
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Detail",
        align: "left",
        value: "Detail"
      },
      { text: "BARCODE ID", value: "Barcode_ID", align: "center" },
      { text: "BE ID", value: "BE_ID", align: "center" },
      { text: "Discount(amount)", value: "Discount_amount", align: "center" },
      { text: "Discount(%)", value: "Discount_per", align: "center" },
      { text: "JM ID", value: "JM_ID", align: "center" },
      { text: "Quantities", value: "QT", align: "center" },
      { text: "price/unit", value: "Unit_price", align: "center" },
      { text: "Action", sortable: false, align: "center" }
    ],
    JSONStock: null,
    Stock: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    look(data) {
      console.log(data);
    },
    async UpdateStock() {
      var _stock = {};
      await this.Stock.map(item => {
        _stock[item.Barcode_ID] = item;
      });
      storage.set("Stock", _stock);
    },
    async initialize() {
      await storage.getAll((error, data) => {
        if (error) throw error;
        this.JSONStock = data.Stock;
        if (this.JSONStock !== null)
          Object.keys(this.JSONStock).map(key => {
            this.JSONStock[key].Barcode_ID = key;
            this.Stock.push(this.JSONStock[key]);
          });
      });
    },

    editItem(item) {
      this.editedIndex = this.Stock.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.Stock.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.Stock.splice(index, 1);
      this.UpdateStock();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.Stock[this.editedIndex], this.editedItem);
      } else {
        this.Stock.push(this.editedItem);
      }
      this.close();
      this.UpdateStock();
    }
  }
  // data(){
  //   return{

  //   }
  // },
  // computed: mapState(["SearchField"]),
  // methods: {
  //   getPath() {
  //     // storage.set('StockIndex',1)

  //     // console.log(storage.getDataPath())

  //     storage.getAll(function(error, data) {
  //       if (error) throw error;
  //       console.log(data);
  //     });
  //   }
  // }
};
</script>

<style>
</style>
