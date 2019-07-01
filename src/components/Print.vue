<template  >
  <v-container
    v-if="JSONInformation==null"
    class="text-xs-center light"
    pa-0
    ma-0
  >Please setting store information</v-container>
  <v-container
    pa-0
    ma-0
    v-else-if="this.List.length==0"
    class="text-xs-center light"
  >Error (Empty List!)</v-container>
  <v-container pa-0 ma-0 v-else-if="Summarry.length!=0" class="text-xs-center light" px-1>
    <!-- <v-layout row wrap xs12> -->
    <v-flex xs12>
      <v-img
        class="img"
        :src="require('./../assets/Logo.jpg')"
        max-height="100"
        position="left center"
        contain
      >
        <h1 v-if="Summarry.TotalProfit">PROFIT SALE</h1>
        <h1 v-else>SUMMARY SALE</h1>
        <table align="right" width="auto" border="1" cellspacing="0"></table>
      </v-img>
    </v-flex>
    <v-layout row wrap xs12 v-for="(i,index) in List2D" :key="index">
      <v-flex v-if="index!=0" xs12>
        <p style="page-break-after: always;"></p>
        <p style="page-break-before: always;"></p>
      </v-flex>

      <v-flex xs12>
        <br>
        <table width="100%" style="border: 1px solid black;" cellspacing="0">
          <tr>
            <th style="border: 1px solid black;" align="center">Invoice No.</th>
            <th style="border: 1px solid black;" align="center">Customer Name</th>
            <th style="border: 1px solid black;" align="center">Net Sale</th>
            <th style="border: 1px solid black;" align="center">Taxes</th>
            <th style="border: 1px solid black;" align="center">Total</th>
            <th v-if="Summarry.TotalProfit" style="border: 1px solid black;" align="center">Profit</th>
          </tr>
          <tr v-for="j in i" :key="j.InvoiceNumber">
            <td align="center" style="padding-left:10px;">{{j.InvoiceNumber}}</td>
            <td align="center" style="padding-left:10px;">{{j.Customer.Name}}</td>
            <td align="right" style="padding-left:10px;">{{(j.TotalPrice-j.TotalTax).toFixed(2)}}</td>
            <td align="right" style="padding-right:10px;">{{j.TotalTax}}</td>
            <td align="right" style="padding-right:10px;">{{j.TotalPrice}}</td>
            <td
              v-if="Summarry.TotalProfit"
              align="right"
              style="padding-right:10px;"
            >{{j.TotalProfit}}</td>
          </tr>
        </table>
      </v-flex>
    </v-layout>
    <v-flex v-if="(SumMod[Math.min(1,List2D.length-1)]-List2D[List2D.length-1].length)<(Summarry.TotalProfit?4:3)" xs12>
      <!-- <p style="page-break-after: always;"></p> -->
      <p style="page-break-before: always;"></p>
    </v-flex>
    <v-flex d-flex xs12>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <br>

        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Subtotal :</th>
            <td align="right" style="padding:0 10px;">{{Summarry.TotalSalenet}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Taxes :</th>
            <td align="right" style="padding:0 10px;">{{Summarry.TotalTax}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Total :</th>
            <td align="right" style="padding:0 10px;">{{Summarry.TotalPrice}}</td>
          </tr>
          <tr v-if="Summarry.TotalProfit">
            <th align="left" style="padding:0 10px;">Total profit:</th>
            <td align="right" style="padding:0 10px;">{{Summarry.TotalProfit}}</td>
          </tr>
        </table>
        <br>
      </v-flex>
    </v-flex>
    <v-flex xs12>
      <br>
    </v-flex>
    <!-- </v-layout> -->
  </v-container>
  <v-container pa-0 ma-0 v-else-if="this.Statement.length!=0" class="text-xs-center light" px-1>
    <v-flex xs12>
      <v-img
        class="img"
        :src="require('./../assets/Logo.jpg')"
        max-height="180"
        position="left center"
        contain
      >
        <h1>STATEMENT</h1>
        <h1 class="text-xs-center">
          <h5 style="display: inline;">Please pay check able to</h5>
          {{' '}}BIM TECH
        </h1>
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Customer :</th>
            <td align="right" style="padding:0 10px;">{{this.Statement.Customer.Name}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Month:</th>
            <td align="right" style="padding:0 10px;">{{toMonth(this.List[0].date)}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Balance Due :</th>
            <td align="right" style="padding:0 10px;">${{Statement.Due}}</td>
          </tr>
        </table>
      </v-img>
    </v-flex>
    <v-layout row wrap xs12 v-for="(i,index) in List2D" :key="index">
      <v-flex v-if="index!=0" xs12>
        <p style="page-break-after: always;"></p>
        <p style="page-break-before: always;"></p>
      </v-flex>

      <v-flex xs12>
        <br>
        <table width="100%" style="border: 1px solid black;" cellspacing="0">
          <tr>
            <th style="border: 1px solid black;" align="center">Invoice No.</th>
            <th style="border: 1px solid black;" align="center">Delivery Date</th>
            <th style="border: 1px solid black;" align="center">Paid</th>
            <th style="border: 1px solid black;" align="center">Tax</th>
            <th style="border: 1px solid black;" align="center">Credit</th>
            <th style="border: 1px solid black;" align="center">Total</th>
          </tr>
          <tr v-for="(n,indexx) in i" :key="indexx">
            <td align="center" style="padding-left:10px;">{{n.InvoiceNumber}}</td>
            <td align="center" style="padding-left:10px;">{{n.date}}</td>
            <td align="right" style="padding-left:10px;">{{n.Paid}}</td>
            <td align="right" style="padding-right:10px;">{{n.TotalTax}}</td>
            <td align="right">{{n.Credit}}</td>
            <td align="right" style="padding-right:10px;">{{n.TotalPrice}}</td>
          </tr>
        </table>
      </v-flex>
    </v-layout>
    <v-flex v-if="(SumMod[Math.min(1,List2D.length-1)]-List2D[List2D.length-1].length)<8" xs12>
      <p style="page-break-after: always;"></p>
      <p style="page-break-before: always;"></p>
    </v-flex>
    <v-flex d-flex xs12>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <br>
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Discounted :</th>
            <td align="right" style="padding:0 10px;">- {{this.Statement.TotalDiscounted}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Subtotal :</th>
            <td align="right" style="padding:0 10px;">{{(this.Statement.Subtotal)}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Taxes :</th>
            <td align="right" style="padding:0 10px;">{{this.Statement.Taxes}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Total :</th>
            <td align="right" style="padding:0 10px;">{{this.Statement.Total}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Amount Paid :</th>
            <td align="right" style="padding:0 10px;">{{this.Statement.Paid}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Balance Due :</th>
            <th align="right" style="padding:0 10px;">${{this.Statement.Due}}</th>
          </tr>
        </table>
        <br>
      </v-flex>
    </v-flex>
    <v-flex xs12>
      <br>
      <h1>Thank you for your business !!!!!!</h1>
    </v-flex>
  </v-container>
  <v-container pa-0 ma-0 v-else-if="this.Invoice.length!=0" class="text-xs-center light" px-1>
    <v-flex xs12>
      <v-img
        class="img"
        :src="require('./../assets/Logo.jpg')"
        max-height="180"
        position="left center"
        contain
      >
        <h1>INVOICE</h1>
        <h1 class="text-xs-center">
          <h5 style="display: inline;">Please pay check able to</h5>
          {{' '}}BIM TECH
        </h1>
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Customer :</th>
            <td align="right" style="padding:0 10px;">{{this.Invoice.Customer.Name}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Invoice #:</th>
            <td align="right" style="padding:0 10px;">{{this.Invoice.InvoiceNumber}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Date:</th>
            <td align="right" style="padding:0 10px;">{{toDate(this.Invoice.date)}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Balance Due :</th>
            <td
              align="right"
              style="padding:0 10px;"
            >${{(Math.max(0,this.Invoice.TotalPrice-this.Invoice.Paid)).toFixed(2)}}</td>
          </tr>
        </table>
      </v-img>
    </v-flex>
    <v-layout row wrap xs12 v-for="(i,index) in List2D" :key="index">
      <v-flex v-if="index!=0" xs12>
        <p style="page-break-after: always;"></p>
        <p style="page-break-before: always;"></p>
      </v-flex>

      <v-flex xs12>
        <br>
        <table width="100%" style="border: 1px solid black;" cellspacing="0">
          <tr>
            <th v-if="!Invoice.isOpTicket" style="border: 1px solid black;" align="center">Item</th>
            <th style="border: 1px solid black;" align="center">Description</th>
            <th style="border: 1px solid black;" align="center">Unit price</th>
            <th style="border: 1px solid black;" class="mx-3" align="center">{{' '}}Qt{{' '}}</th>
            <th style="border: 1px solid black;" align="center">Amount</th>
            <th v-if="!Invoice.isOpTicket" style="border: 1px solid black;" align="center">Tax</th>
          </tr>
          <tr v-for="(n,indexx) in i" :key="indexx">
            <td v-if="!Invoice.isOpTicket" align="left" style="padding-left:10px;">{{n.JM_ID}}</td>
            <td align="left" style="padding-left:10px;">{{n.Detail}}</td>
            <td align="right" style="padding-right:10px;">{{n.Unit_price}}</td>
            <td align="center" style="padding-left:20px;">{{n.piece}}</td>
            <td align="right" style="padding-right:10px;">{{n.Unit_price*n.piece}}</td>
            <td v-if="!Invoice.isOpTicket" align="right" style="padding-right:10px;">{{n.Tax}}</td>
          </tr>
        </table>
      </v-flex>
    </v-layout>
    <v-flex v-if="(SumMod[Math.min(1,List2D.length-1)]-List2D[List2D.length-1].length)<8" xs12>
      <p style="page-break-after: always;"></p>
      <p style="page-break-before: always;"></p>
    </v-flex>
    <v-flex d-flex xs12>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <br>
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Subtotal :</th>
            <td
              align="right"
              style="padding:0 10px;"
            >{{(this.Invoice.TotalPrice-this.Invoice.TotalTax+parseFloat(this.Invoice.TotalDiscounted)).toFixed(2)}}</td>
          </tr>
          <tr v-if="!Invoice.isOpTicket">
            <th v-if="!Invoice.isOpTicket" align="left" style="padding:0 10px;">Discounted :</th>
            <td
              v-if="!Invoice.isOpTicket"
              align="right"
              style="padding:0 10px;"
            >- {{(parseFloat(this.Invoice.TotalDiscounted)).toFixed(2)}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Taxes :</th>
            <td align="right" style="padding:0 10px;">{{this.Invoice.TotalTax}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Total :</th>
            <td align="right" style="padding:0 10px;">{{this.Invoice.TotalPrice}}</td>
          </tr>
          <tr>
            <th v-if="!Invoice.isOpTicket" align="left" style="padding:0 10px;">Amount Paid :</th>
            <td
              v-if="!Invoice.isOpTicket"
              align="right"
              style="padding:0 10px;"
            >{{this.Invoice.Paid}}</td>
          </tr>
          <tr>
            <th align="left" style="padding:0 10px;">Balance Due :</th>
            <th
              align="right"
              style="padding:0 10px;"
            >${{(Math.max(0,this.Invoice.TotalPrice-this.Invoice.Paid)).toFixed(2)}}</th>
          </tr>
        </table>
        <br>
      </v-flex>
    </v-flex>
    <v-flex xs12>
      <br>
      <h1>Thank you for your business !!!!!!</h1>
    </v-flex>
  </v-container>
</template>
<style>
.light {
  align-items: flex-end;
  background-color: white;
  color: #232323;
  /* page-break-after: always !important; */
  -webkit-print-color-adjust: exact;
}
@page {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
<script>
// import 'bootstrap/dist/css/bootstrap.min.css';
require("bootstrap");
import { mapMutations, mapState } from "vuex";
const ipcRenderer = require("electron").ipcRenderer;
import moment from "moment";
export default {
  watch: {
    List: function() {
      if (this.List.length > 0) {
        var len = this.List.length;
        var sumIndex = 0;
        var tempArr = [];
        this.List2D = [];
        var count = 0;
        for (var i = 0; i < len; i++) {
          tempArr.push(this.List[i]);
          count++;
          if (count == this.SumMod[sumIndex] || i == len - 1) {
            count = 0;
            this.List2D.push(tempArr);
            sumIndex = 1;
            tempArr = [];
          }
        }
      }
    }
  },
  methods: {
    toDate(date) {
      return moment(date, "MMMM Do YYYY, h:mm:ss a").format("MMMM Do YYYY");
    },
    toMonth(date) {
      return moment(date, "MMMM Do YYYY, h:mm:ss a").format("MMMM YYYY");
    }
  },

  data: () => ({
    Invoice: [],
    List: [],
    Statement: [],
    Summarry: [],
    SumMod: [38, 43],
    List2D: []
  }),
  computed: {
    // JSONInformation:{},
    ...mapState(["JSONInformation"])
  },
  created() {
    ipcRenderer.on("printStatement", (event, statement) => {
      this.SumMod = [37, 44];
      this.Invoice = [];
      this.List = [];
      this.Summarry = [];
      this.Statement = statement;
      this.List = Object.values(this.Statement.List);
      setTimeout(() => {
        ipcRenderer.send("readyToPrintPDF");
      }, 500);
    });
    ipcRenderer.on("saveStatement", (event, statement) => {
      this.SumMod = [37, 44];
      this.Invoice = [];
      this.List = [];
      this.Summarry = [];
      this.Statement = statement;
      this.List = Object.values(this.Statement.List);
      setTimeout(() => {
        ipcRenderer.send("readyToSave");
      }, 500);
    });
    ipcRenderer.on("printPDF", (event, Invoice) => {
      //   document.body.innerHTML = content;
      this.SumMod = [37, 44];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Invoice = Invoice;
      this.List = Object.values(this.Invoice.List);
      setTimeout(() => {
        ipcRenderer.send("readyToPrintPDF");
      }, 500);
    });

    ipcRenderer.on("showPDF", (event, Invoice) => {
      //   document.body.innerHTML = content;
      this.SumMod = [37, 44];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Invoice = Invoice;
      this.List = Object.values(this.Invoice.List);
    });
    ipcRenderer.on("savePDF", (event, Invoice) => {
      //   document.body.innerHTML = content;
      this.SumMod = [37, 44];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Invoice = Invoice;
      this.List = Object.values(this.Invoice.List);
      setTimeout(() => {
        ipcRenderer.send("readyToSave");
      }, 500);
    });
    ipcRenderer.on("PrintSum", (event, Summarry) => {
      //   document.body.innerHTML = content;
      this.SumMod = [43, 48];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Summarry = Summarry;
      this.List = Object.values(this.Summarry.List);
      setTimeout(() => {
        ipcRenderer.send("readyToPrintPDF");
      }, 500);
    });
    ipcRenderer.on("ViewSum", (event, Summarry) => {
      //   document.body.innerHTML = content;
      this.SumMod = [43, 48];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Summarry = Summarry;
      this.List = Object.values(this.Summarry.List);
    });
    ipcRenderer.on("SaveSum", (event, Summarry) => {
      //   document.body.innerHTML = content;
      this.SumMod = [43, 48];
      this.Statement = [];
      this.List = [];
      this.Summarry = [];
      this.Summarry = Summarry;
      this.List = Object.values(this.Summarry.List);
      setTimeout(() => {
        ipcRenderer.send("readyToSave");
      }, 500);
    });
  }
};
</script>