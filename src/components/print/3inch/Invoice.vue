<template>
  <v-container
    style="width: 8cm; background-color: white;"
    pa-0
    ma-0
    class="text-xs-center light"
  >
    <v-img
      class="img"
      :src="require('@/assets/Logo.jpg')"
      max-height="100"
      position="center center"
      contain
    >
    </v-img>
    <h1 class="text-center">INVOICE</h1>
    <h3 class="text-xs-center">
      <h5 style="display: inline;">Please pay check able to</h5>
      {{ " " }}BIM TECH
    </h3>

    <table
      style="font-size: 14px;"
      width="100%"
      border="0"
      cellspacing="0"
      class="my-2"
    >
      <tr>
        <th align="left" style="padding:0 10px;">Customer :</th>
        <td align="right" style="padding:0 10px;">
          {{ customer }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Invoice #:</th>
        <td align="right" style="padding:0 10px;">
          {{ invoiceId }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Date :</th>
        <td align="right" style="padding:0 10px;">
          {{ date }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Balance Due :</th>
        <td align="right" style="padding:0 10px;">${{ balanceDue }}</td>
      </tr>
    </table>

    <table width="100%" style="border: 1px solid black;" cellspacing="0">
      <tr class="mb-1" style="font-size: 14px;">
        <th align="center">Description</th>
        <th align="center">Unit price</th>
        <th align="center">{{ " " }}Qt{{ " " }}</th>
        <th align="center">Amount</th>
      </tr>
      <tr
        v-for="(n, index) in list"
        :key="index"
        style="font-size: 14px;"
        class="my-1"
      >
        <td align="left" style="padding-left:10px;">
          <p style="width: 1.25in;" class="text-truncate mb-0">
            {{ n.Detail }}
          </p>
        </td>
        <td align="right" style="padding-right:10px;">
          {{ n.Unit_price }}
        </td>
        <td align="center" style="padding-left:5px;">{{ n.piece }}</td>
        <td align="right" style="padding-right:10px;">
          {{ n.Unit_price * n.piece }}
        </td>
      </tr>
    </table>

    <table
      style="font-size: 14px;"
      width="100%"
      border="0"
      cellspacing="0"
      class="mt-2"
    >
      <tr>
        <th align="left" style="padding:0 10px;">Subtotal :</th>
        <td align="right" style="padding:0 10px;">
          {{ Subtotal }}
        </td>
      </tr>
      <tr v-if="!isOpTicket">
        <th v-if="!isOpTicket" align="left" style="padding:0 10px;">
          Discounted :
        </th>
        <td v-if="!isOpTicket" align="right" style="padding:0 10px;">
          - {{ Discounted }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Taxes :</th>
        <td align="right" style="padding:0 10px;">
          {{ TotalTax }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Total :</th>
        <td align="right" style="padding:0 10px;">
          {{ TotalPrice }}
        </td>
      </tr>
      <tr>
        <th v-if="!isOpTicket" align="left" style="padding:0 10px;">
          Amount Paid :
        </th>
        <th v-else align="left" style="padding:0 10px;">Deposited :</th>
        <td align="right" style="padding:0 10px;">
          {{ AmountPaid }}
        </td>
      </tr>
      <tr>
        <th align="left" style="padding:0 10px;">Balance Due :</th>
        <th align="right" style="padding:0 10px;">${{ balanceDue }}</th>
      </tr>
    </table>
  </v-container>
</template>
<script>
export default {
  props: {
    customer: String,
    invoiceId: String,
    date: String,
    balanceDue: String,
    list: Array,
    isOpTicket: Boolean,
    Subtotal: String,
    Discounted: String,
    TotalTax: String,
    TotalPrice: String,
    AmountPaid: String,
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
  margin: 0;
  padding: 0;
}
</style>
