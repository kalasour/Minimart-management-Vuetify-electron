<template  >
  <v-container
    v-if="JSONInformation==null"
    class="text-xs-center light"
  >Please setting store information</v-container>
  <v-container v-else-if="this.Invoice.length==0" class="text-xs-center light">Invoice Error</v-container>
  <v-container v-else class="text-xs-center light" px-1>
    <v-layout row wrap xs12>
      <v-flex xs6>
        <h5
          style="color:gray;"
          class="text-xs-left"
        >{{new Date().getMonth()+1}}/{{new Date().getDate()}}/{{new Date().getFullYear()}}</h5>
      </v-flex>
      <v-flex xs6>
        <h5 style="color:gray;" class="text-xs-left">Invoice: {{this.Invoice.Customer.Name}}</h5>
      </v-flex>
      <v-flex xs12>
        <h1>INVOICE</h1>
      </v-flex>
      <v-flex xs12>
        <br>
      </v-flex>
      <v-flex d-flex xs12>
        <v-flex xs6>
          <h4 class="text-xs-left">BIM TECH</h4>
          <h4 class="text-xs-left">{{this.JSONInformation.Name}},{{this.JSONInformation.Address}}</h4>
          <h4 class="text-xs-left">Contact:{{this.JSONInformation.Contact}}</h4>
        </v-flex>
        <v-flex xs6>
          <table width="100%" border="1" cellspacing="0">
            <tr>
              <th align="left" style="padding-left:10px;">Invoice #:</th>
              <td align="right" style="padding-right:10px;">{{this.Invoice.InvoiceNumber}}</td>
            </tr>
            <tr>
              <th align="left" style="padding-left:10px;">Date:</th>
              <td align="right" style="padding-right:10px;">{{this.Invoice.date}}</td>
            </tr>
            <tr>
              <th align="left" style="padding-left:10px;">Balance Due (USD):</th>
              <td
                align="right"
                style="padding-right:10px;"
              >${{(Math.max(0,this.Invoice.TotalPrice-this.Invoice.Paid)).toFixed(2)}}</td>
            </tr>
          </table>
          <br>
        </v-flex>
      </v-flex>
      <v-flex xs12>
        <table width="100%" style="border: 1px solid black;" cellspacing="0">
          <tr>
            <th style="border: 1px solid black;" align="center">Item</th>
            <th style="border: 1px solid black;" align="center">Description</th>
            <th style="border: 1px solid black;" align="center">Unit Cost ($)</th>
            <th style="border: 1px solid black;" align="center">Quantity</th>
            <th style="border: 1px solid black;" align="center">Price ($)</th>
          </tr>
          <tr v-for="(n,index) in List" :key="index">
            <td align="left" style="padding-left:10px;">{{n.Barcode_ID}}</td>
            <td align="left" style="padding-left:10px;">{{n.Detail}}</td>
            <td align="right" style="padding-right:10px;">{{n.Unit_price}}</td>
            <td align="center">{{n.piece}}</td>
            <td align="right" style="padding-right:10px;">{{n.Price}}</td>
          </tr>
        </table>
      </v-flex>
      <v-flex d-flex xs12>
        <v-flex xs6></v-flex>
        <v-flex xs6>
          <br>
          <table width="100%" border="1" cellspacing="0">
            <tr>
              <th align="left" style="padding-left:10px;">Subtotal :</th>
              <td
                align="right"
                style="padding-right:10px;"
              >{{(this.Invoice.TotalPrice-this.Invoice.TotalTax).toFixed(2)}}</td>
            </tr>
            <tr>
              <th align="left" style="padding-left:10px;">Total:</th>
              <td align="right" style="padding-right:10px;">{{this.Invoice.TotalPrice}}</td>
            </tr>
            <tr>
              <th align="left" style="padding-left:10px;">Amount Paid:</th>
              <td align="right" style="padding-right:10px;">{{this.Invoice.Paid}}</td>
            </tr>
            <tr>
              <th align="left" style="padding-left:10px;">Balance Due (USD):</th>
              <th
                align="right"
                style="padding-right:10px;"
              >${{(Math.max(0,this.Invoice.TotalPrice-this.Invoice.Paid)).toFixed(2)}}</th>
            </tr>
          </table>
          <br>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
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
      setTimeout(function() { ipcRenderer.send("readyToPrintPDF"); }, 100);
      
    });
  },
  data: () => ({
    Invoice: [],
    List: [],
  }),
  computed: {
    // JSONInformation:{},
    ...mapState(["JSONInformation"])
  }
};
</script>