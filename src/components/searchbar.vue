<template>
  <v-autocomplete
    auto-select-first
    chips
    autofocus
    v-model="model"
    :items="Stock"
    :label="`Search`"
    prepend-icon="search"
    item-text="Barcode_ID"
    :filter="SearchFilter"
    @change="updateSearchField(model)"
  >
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-tile-content v-text="data.item"></v-list-tile-content>
      </template>
      <template v-else>
        <v-list-tile-content v-text="data.item.Detail"></v-list-tile-content>
        <v-list-tile-content>
          <v-list-tile-title v-text="data.item.Barcode_ID"></v-list-tile-title>
          <v-list-tile-sub-title v-text="data.item.QT"></v-list-tile-sub-title>
        </v-list-tile-content>
      </template>
      
    </template>
  </v-autocomplete>
</template>

<script>
const storage = require("electron-json-storage");
import { mapMutations, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      model: null,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    updateSearchField(data) {
     this.$store.commit("SetSF",data)
    },
    SearchFilter(item, queryText, itemText) {
      const textOne = item.Detail.toLowerCase();
      const textTwo = item.Barcode_ID.toLowerCase();
      const text3 = item.JM_ID.toLowerCase();
      const text4 = item.BE_ID.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        text3.indexOf(searchText) > -1 ||
        text4.indexOf(searchText) > -1
      );
    }
  },computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapState(["SearchField","JSONStock",'Stock'])
  },
};
</script>

