<template  >
  <div class="text-xs-center light">
    <v-layout column wrap xs12>
      <h3>{{this.JSONInformation.Name}},{{this.JSONInformation.Address}}</h3>
      <h3>Contact:{{this.JSONInformation.Contact}}</h3>
      <h1>---------------------</h1>
      <v-layout row wrap xs12 v-for="(n,index) in List" :key="index">
        <h3>{{index+1}} {{n.Detail}}</h3>
        <v-spacer/>
        <h3>{{n.Price}}</h3>
      </v-layout>
      <h1>---------------------</h1>
      <div class="text-xs-left">
        <h3>Total piece : {{this.Invoice.TotalPiece}}</h3>
        <h3>Total price : {{this.Invoice.TotalPrice}}</h3>
        <h3>Paid : {{this.Invoice.Paid}}</h3>
      </div>
      <div class="text-xs-right">
        <h4>{{this.Invoice.date}}</h4>
      </div>
    </v-layout>
  </div>
</template>
<style>
.light {
  background-color: white;
  color: #232323;
}
</style>
<script>
import { mapMutations, mapState } from "vuex";
const ipcRenderer = require("electron").ipcRenderer;

export default {
  created() {
    ipcRenderer.on("printPDF", (event, Invoice) => {
      //   document.body.innerHTML = content;
      this.Invoice = Invoice;
      this.List = Object.values(this.Invoice.List);
      ipcRenderer.send("readyToPrintPDF");
    });
  },
  data: () => ({
    Invoice: [],
    List: []
  }),
  computed: {
    // JSONInformation:{},
    ...mapState(["JSONInformation"])
  }
};
</script>