<template>
  <v-container pa-0 ma-0 class="text-xs-center light" px-1>
    <v-flex xs12>
      <v-img
        class="img"
        :src="require('@/assets/Logo.jpg')"
        max-height="180"
        position="left center"
        contain
      >
        <br />
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Date:</th>
            <td align="right" style="padding:0 10px;">
              {{ toDate(this.InvoicesGroup.date) }}
            </td>
          </tr>
        </table>

        <div id="header">
          <h1 class="pa-0 ma-0" id="header-text">Order List</h1>
        </div>
      </v-img>
    </v-flex>
    <v-layout row wrap xs12 v-for="(i, index) in List2D" :key="index">
      <v-flex v-if="index != 0" xs12>
        <p style="page-break-after: always;"></p>
        <p style="page-break-before: always;"></p>
      </v-flex>

      <v-flex xs12>
        <br />
        <table width="100%" style="border: 1px solid black;" cellspacing="0">
          <tr>
            <th style="border: 1px solid black;" class="mx-3" align="center">
              {{ " " }}Qt{{ " " }}
            </th>
            <th style="border: 1px solid black;" align="center">Code Order</th>
            <th
              v-if="InvoicesGroup.showCost"
              style="border: 1px solid black;"
              align="center"
            >
              Unit Cost
            </th>
            <th
              v-if="InvoicesGroup.showCost"
              style="border: 1px solid black;"
              align="center"
            >
              Amount
            </th>
            <th
              v-if="InvoicesGroup.showCost"
              style="border: 1px solid black;"
              align="center"
            >
              Tax
            </th>
          </tr>
          <tr v-for="(n, indexx) in i" :key="indexx">
            <td align="center" style="padding-left:20px;">{{ n.piece }}</td>
            <td align="left" style="padding-left:10px;">{{ n.code }}</td>
            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding-right:10px;"
            >
              {{ n.Unit_price }}
            </td>

            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding-right:10px;"
            >
              {{ n.Unit_price * n.piece }}
            </td>
            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding-right:10px;"
            >
              {{ n.Tax }}
            </td>
          </tr>
        </table>
      </v-flex>
    </v-layout>
    <v-flex v-if="shouldBreakPage" xs12>
      <p style="page-break-after: always;"></p>
      <p style="page-break-before: always;"></p>
    </v-flex>
    <v-flex d-flex xs12>
      <v-flex xs6></v-flex>
      <v-flex xs6>
        <br />
        <table align="right" width="auto" border="1" cellspacing="0">
          <tr>
            <th align="left" style="padding:0 10px;">Total qt :</th>
            <td align="right" style="padding:0 10px;">
              {{ TotalPiece }}
            </td>
          </tr>
          <tr>
            <th
              v-if="InvoicesGroup.showCost"
              align="left"
              style="padding:0 10px;"
            >
              Subtotal :
            </th>
            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding:0 10px;"
            >
              {{
                (
                  this.TotalPrice -
                  this.TotalTax +
                  parseFloat(this.TotalDiscounted)
                ).toFixed(2)
              }}
            </td>
          </tr>
          <tr>
            <th
              v-if="InvoicesGroup.showCost"
              align="left"
              style="padding:0 10px;"
            >
              Taxes :
            </th>
            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding:0 10px;"
            >
              {{ this.TotalTax }}
            </td>
          </tr>
          <tr>
            <th
              v-if="InvoicesGroup.showCost"
              align="left"
              style="padding:0 10px;"
            >
              Total :
            </th>
            <td
              v-if="InvoicesGroup.showCost"
              align="right"
              style="padding:0 10px;"
            >
              {{ this.TotalPrice }}
            </td>
          </tr>
        </table>

        <br />
      </v-flex>
    </v-flex>
    <v-flex xs12>
      <br />
    </v-flex>
  </v-container>
</template>

<script>
import moment from "moment";
import vue from "vue";
export default {
  props: {
    SumMod: Array,
    InvoicesGroup: Object,
  },
  methods: {
    toDate(date) {
      return moment(date, "MMMM Do YYYY, h:mm:ss a").format("MMMM Do YYYY");
    },
    toMonth(date) {
      return moment(date, "MMMM Do YYYY, h:mm:ss a").format("MMMM YYYY");
    },
  },
  data: () => ({}),
  computed: {
    Invoice() {
      return this.InvoicesGroup.invoices;
    },
    List2D() {
      var temp = [];
      if (this.List == null || this.List == undefined) {
        temp = [];
        return;
      }
      if (this.List.length > 0) {
        var len = this.List.length;
        var sumIndex = 0;
        var tempArr = [];
        temp = [];
        var count = 0;
        for (var i = 0; i < len; i++) {
          tempArr.push(this.List[i]);
          count++;
          if (count == this.SumMod[sumIndex] || i == len - 1) {
            count = 0;
            temp.push(tempArr);
            sumIndex = 1;
            tempArr = [];
          }
        }
      }
      return temp;
    },
    List() {
      var temp = [];
      this.Invoice.filter((invoice) =>
        this.InvoicesGroup.invoices
          .map((invoice) => invoice.ID)
          .includes(invoice.ID)
      )
        .map((invoice) => {
          return Object.values(invoice.List);
        })
        .reduce((prev, curr) => {
          return [...prev, ...curr];
        })
        .map((item) => {
          if (item.code == "" || item.code == null || item.code == undefined) {
            item.code = item.Detail;
          }
          return item;
        })
        .map((item) => {
          let clonedItem = JSON.parse(JSON.stringify(item));
          if (
            clonedItem.Cost != "" &&
            clonedItem.Cost != null &&
            clonedItem.Cost != undefined
          ) {
            clonedItem.Unit_price = parseFloat(clonedItem.Cost);
          }
          const index = temp.findIndex(
            (ele) =>
              ele.Barcode_ID == clonedItem.Barcode_ID &&
              ele.Unit_price == clonedItem.Unit_price
          );
          if (index == -1) {
            temp.push(clonedItem);
          } else {
            temp[index].piece =
              parseInt(temp[index].piece) + parseInt(clonedItem.piece);
          }
        });
      return temp;
    },
    TotalPrice() {
      return (
        this.List.map((item) => {
          return item.Unit_price * item.piece;
        }).reduce((a, b) => parseFloat(a) + parseFloat(b)) +
        parseFloat(this.TotalTax) +
        parseFloat(this.TotalDiscounted)
      ).toFixed(2);
    },
    TotalTax() {
      return this.List.map((item) => {
        return item.Tax;
      })
        .reduce((a, b) => parseFloat(a) + parseFloat(b))
        .toFixed(2);
    },
    TotalAmount() {
      return this.List.map((item) => item.piece)
        .reduce((a, b) => parseFloat(a) + parseFloat(b))
        .toFixed(2);
    },
    TotalPiece() {
      return this.List.map((item) => item.piece).reduce((a, b) => a + b);
    },
    TotalDiscounted() {
      return this.List.map((item) => item.Discounted * item.piece)
        .reduce((a, b) => parseFloat(a) + parseFloat(b))
        .toFixed(2);
    },
    shouldBreakPage() {
      if (this.List2D.length == 0) return false;
      return (
        this.SumMod[Math.min(1, this.List2D.length - 1)] -
          this.List2D[this.List2D.length - 1].length <
        4
      );
    },
  },
};
</script>

<style>
#header {
  position: absolute;
  left: 50%;
  top: 70%;
}
#header-text {
  position: relative;
  left: -50%;
}
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
