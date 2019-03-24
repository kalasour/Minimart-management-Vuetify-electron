<template>
    <v-autocomplete
      v-model="model"
      :items="Stock"
      :label="`Search`"
      prepend-icon="search"
    >
    </v-autocomplete>
</template>

<script>
const storage = require("electron-json-storage");
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      isEditing: false,
      model: null,
      states: [
        "Alabama",
        "Alaska",
        "American Samoa",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Federated States of Micronesia",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Marshall Islands",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Northern Mariana Islands",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Palau",
        "Pennsylvania",
        "Puerto Rico",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Island",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
      ],
      JSONStock: null
      ,Stock:[]
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      await storage.getAll((error, data) => {
        if (error) throw error;
        this.JSONStock = data.Stock;
        if (this.JSONStock !== null)
          Object.keys(this.JSONStock).map(key => {
            this.JSONStock[key].Barcode_ID = key;
            this.JSONStock[key].toString=()=>{
                return this.JSONStock[key].Detail
            }
            console.log(this.JSONStock[key].toString())
            this.Stock.push(this.JSONStock[key]);
          });
      });
    }
  }
};
</script>

