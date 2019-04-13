<template>
  <div id="app">
    <v-app id="inspire">
      <div>
        <v-toolbar flat>
          <v-toolbar-title>Customers</v-toolbar-title>
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
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="editedItem.ID=(parseInt((Customers.length==0)?0:(Customers[Customers.length-1].ID)+1)).toString()"
                v-on="on"
              >New Customer</v-btn>
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
                      <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field v-model="editedItem.Address" label="Adress"></v-text-field>
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

          <v-dialog v-model="dialogCustomer" max-width="1200px">
            <ItemList v-bind:selected="SelectedCustomer"/>
            <div class="text-xs-right" dark>
              <v-btn @click="closeCustomer">Close</v-btn>
            </div>
          </v-dialog>
        </v-toolbar>
        <v-data-table :headers="headers" :items="Customers.filter(filterTable)" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.ID }}</td>
            <td class="text-xs-center">{{ props.item.Name }}</td>
            <td class="text-xs-center">{{ props.item.Address }}</td>
            <td class="justify-center layout px-0">
              <v-icon small class="mr-2" @click="handleClick(props.item)">assignment</v-icon>
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
import { Promise } from "q";
import ItemList from "./Report_customer";
import Vue from "vue";
Vue.component("ItemList", ItemList);
export default {
  data: () => ({
    dialog: false,
    dialogCustomer: false,
    SelectedCustomer: {},
    headers: [
      {
        text: "ID",
        align: "left",
        value: "ID"
      },
      { text: "Name", value: "Name", align: "center" },
      { text: "Address", value: "Address", align: "center" },
      { text: "Action", sortable: false, align: "center" }
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    },
    ...mapState(["SearchField", "JSONCustomers", "Customers"])
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
    handleClick(selected) {
      this.SelectedCustomer = selected;
      this.dialogCustomer = true;
    },
    clearSF() {
      this.$store.commit("SetSF", "");
    },
    look(data) {
      console.log(data);
    },
    ...mapMutations(["initialize", "UpdateCustomers"]),
    filterTable(element) {
      return (
        (element.ID == null ? "" : element.ID)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
        (element.Name == null ? "" : element.Name)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1 ||
        (element.Address == null ? "" : element.Address)
          .toLowerCase()
          .indexOf(
            (this.SearchField == null ? "" : this.SearchField).toLowerCase()
          ) > -1
      );
    },
    editItem(item) {
      this.editedIndex = this.Customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.Customers.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.Customers.splice(index, 1);
      this.UpdateCustomers();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    closeCustomer() {
      this.dialogCustomer = false;
    },

    async save() {
      // if (this.editedItem.ID == "" || this.editedItem.ID == null) {
      //   alert("Please Input  ID");
      //   return;
      // } else {
      //   var con = true;
      //   await Promise.all(
      //     this.Customers.map(async (item, index) => {
      //       if (this.editedItem.ID == item.ID && this.editedIndex !== index) {
      //         await alert("This ID is already!");
      //         con = false;
      //         return;
      //       }
      //     })
      //   );
      //   if (con) {

      //     }
      // }
      if (this.editedIndex > -1) {
        Object.assign(this.Customers[this.editedIndex], this.editedItem);
      } else {
        this.Customers.push(this.editedItem);
      }
      this.close();
      this.UpdateCustomers();
    }
  }
};
</script>

<style>
</style>
