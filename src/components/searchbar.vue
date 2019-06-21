<template>
  <v-text-field
  v-if="this.$route.path!=='/'&&this.$route.path!=='/openTicket'"
    v-model="model"
    :label="`Search`"
    prepend-icon="search"
    :filter="SearchFilter"
    @input="updateSearchField(model)"
  >
  </v-text-field>
</template>

<script>
const storage = require("electron-json-storage");
import { mapMutations, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      model: null
    };
  },
  created() {
    // this.initialize();
  },
  // watch: {
  //   model: function() {
  //     this.model = null;
  //   }
  // },
  methods: {
    remove(item) {
      // console.log(this.model)
      // const index = this.model.indexOf(item);
      // console.log(index);
      // if (index >= 0) this.model.splice(index, 1);
    },
    look(data) {
      // data.item = "";
      // this.model=null
      // data.selectedValues.splice(0,1)
      // data.selectedItems.splice(0,1)
      data.internalValue = "";
      // console.log(data);
    },
    updateSearchField(data) {
      
      if (typeof data === "object" && data != null) {
        data = data.Barcode_ID;
      }
      this.$store.commit("SetSF", data);
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
    },
    ...mapMutations(["initialize", "UpdateStock"])
  },
  computed: {
    ...mapState(["SearchField", "JSONStock", "Stock"])
  },
  watch:{
    SearchField:function(){
      this.model=this.SearchField
    }
  }
};
</script>

