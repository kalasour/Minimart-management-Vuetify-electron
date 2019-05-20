<template>
  <div id="app">
    <v-app id="inspire">
      <div>
        <v-toolbar flat>
          <v-toolbar-title>Stock</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <template v-if="SearchField!==''">
            <v-chip close color="blue" text-color="white" @input="clearSF">
              <v-avatar>
                <v-icon>search</v-icon>
              </v-avatar>
              {{SearchField}}
            </v-chip>
          </template>
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
                      <v-text-field
                        v-model="editedItem.Discount_amount"
                        type="number"
                        label="Discount(amount)"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="editedItem.Discount_per"
                        type="number"
                        label="Discount(%)"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.JM_ID" label="JM ID"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.QT" type="number" label="Quantities"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="editedItem.Unit_price"
                        type="number"
                        label="price/unit"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-checkbox v-model="editedItem.TaxActive" color="#880E4F" label="Tax active"></v-checkbox>
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
        <v-data-table :headers="headers" :items="Stock.filter(filterTable)" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.Detail }}</td>
            <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
            <td class="text-xs-center">{{ props.item.BE_ID }}</td>
            <td class="text-xs-center">{{ props.item.Discount_amount }}</td>
            <td class="text-xs-center">{{ props.item.Discount_per }}</td>
            <td class="text-xs-center">{{ props.item.JM_ID }}</td>
            <td class="text-xs-center">{{ props.item.QT }}</td>
            <td class="text-xs-center">{{ props.item.Unit_price }}</td>
            <td class="justify-center align-center text-xs-center px-0">
              <!-- <v-checkbox v-model="props.item.TaxActive" disabled></v-checkbox> -->
              <v-icon small v-if="props.item.TaxActive">check_box</v-icon>
              <v-icon small v-else>check_box_outline_blank</v-icon>
            </td>
            <td class="justify-center align-center layout px-0">
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
import { mapMutations, mapState } from "vuex";
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
      { text: "Tax active?", value: "TaxActive", align: "center" },
      { text: "Action", sortable: false, align: "center" }
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapState(["SearchField", "JSONStock", "Stock"])
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
    clearSF() {
      this.$store.commit("SetSF", "");
    },
    look(data) {
      console.log(data);
    },
    ...mapMutations(["initialize", "UpdateStock"]),
    filterTable(element) {
      return (
        (element.Detail == null ? "" : element.Detail)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
        (element.Barcode_ID == null ? "" : element.Barcode_ID)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
        (element.JM_ID == null ? "" : element.JM_ID)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
        (element.BE_ID == null ? "" : element.BE_ID)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1
      );
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

    async save() {
      // if (
      //   this.editedItem.Barcode_ID == "" ||
      //   this.editedItem.Barcode_ID == null
      // ) {
      //   alert("Please Input Barcode ID");
      //   return;
      // } else {
      var con = true;
      // await Promise.all(
      //   this.Stock.map(async (item, index) => {
      //     if (
      //       this.editedItem.Barcode_ID == item.Barcode_ID &&
      //       this.editedIndex !== index
      //     ) {
      //       await alert("This ID is already!");
      //       con = false;
      //       return;
      //     }
      //   })
      // );
      if (con) {
        if (this.editedIndex > -1) {
          Object.assign(this.Stock[this.editedIndex], this.editedItem);
        } else {
          if (this.Stock.length == 0) this.editedItem.index = "0";
          else {
            this.editedItem.index = (
              parseInt(this.Stock[this.Stock.length - 1].index) + 1
            ).toString();
          }
          this.Stock.push(this.editedItem);
        }
        this.close();
        this.UpdateStock();
      }
      // }
    }
  }
};
</script>

<style>
</style>
