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
                      <v-text-field v-model="editedItem.ID" label="ID"></v-text-field>
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
        </v-toolbar>
        <v-data-table :headers="headers" :items="Invoice.filter(filterTable)" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.ID }}</td>
            <td class="text-xs-center">{{ props.item.Customer.ID }}</td>
            <td class="text-xs-center">{{ props.item.date }}</td>
            <td class="text-xs-center">{{ props.item.TotalPrice }}</td>
            <td class="text-xs-center">{{ props.item.Paid }}</td>
            <td class="justify-center layout px-0">
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
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "ID",
        align: "left",
        value: "ID"
      },
      { text: "Customer", value: "Customer.ID", align: "center" },
      { text: "Date", sortable: false, align: "center" },
      { text: "Total price", value: "TotalPrice", align: "center" },
      { text: "Paid", value: "Paid", align: "center" },
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
    ...mapState(["SearchField", "JSONCustomers", "Customers","Invoice"])
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
    ...mapMutations(["initialize", "UpdateCustomers"]),
    filterTable(element) {
      return (
        (element.ID == null ? "" : element.ID)
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

    async save() {
      if (this.editedItem.ID == "" || this.editedItem.ID == null) {
        alert("Please Input  ID");
        return;
      } else {
        var con = true;
        await Promise.all(
          this.Customers.map(async (item, index) => {
            if (this.editedItem.ID == item.ID && this.editedIndex !== index) {
              await alert("This ID is already!");
              con = false;
              return;
            }
          })
        );
        if (con) {
          if (this.editedIndex > -1) {
            Object.assign(this.Customers[this.editedIndex], this.editedItem);
          } else {
            this.Customers.push(this.editedItem);
          }
          this.close();
          this.UpdateCustomers();
        }
      }
    }
  }
};
</script>

<style>
</style>
