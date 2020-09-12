<template>
  <div>
    <v-dialog v-model="invoiceListDialog" max-width="1200px">
      <InvoiceList v-bind:selected="selectedInvoices" />
      <div class="text-xs-right" dark>
        <v-btn @click="invoiceListDialog = false">Close</v-btn>
      </div>
    </v-dialog>
    <v-toolbar flat>
      <v-toolbar-title>Order List</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-switch v-model="ActiveCost" hide-details label="Show Cost"></v-switch>
    </v-toolbar>
    <v-data-table
      :rows-per-page-items="[{ text: 'All', value: -1 }]"
      :headers="headersItem"
      :items="InvoiceGroupList.filter(filterTable)"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td class="text-xs-center">
          <v-btn @click="view(props.item)">{{ props.item.date }}</v-btn>
        </td>
        <td class="text-xs-center">{{ totalAmount(props.item) }}</td>
        <td class="text-xs-center">{{ totalPrice(props.item) }}</td>
        <td class="justify-center align-center layout px-1">
          <v-icon small class="mr-2" @click="rec(props.item)">save</v-icon>
          <v-icon small class="mr-2" @click="print(props.item)"
            >local_printshop</v-icon
          >
          <v-icon small class="mr-2" @click="openInvoiceList(props.item)"
            >edit</v-icon
          >
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import InvoiceList from "@/components/Report";
import { ipcRenderer } from "electron";
import Vue from "vue";
import { dialog } from "electron";
Vue.component("InvoiceList", InvoiceList);
export default {
  data: () => ({
    ActiveCost: false,
    invoiceListDialog: false,
    selectedInvoices: [],
    headersItem: [
      { text: "Date", sortable: false, align: "center" },
      { text: "Total Amount", sortable: false, align: "center" },
      { text: "Total Price", sortable: false, align: "center" },
      { text: "Action", sortable: false, align: "center" },
    ],
  }),
  computed: {
    ...mapState(["InvoiceGroupList", "Invoice"]),
  },
  methods: {
    ...mapMutations(["UpdateInvoiceGroup"]),
    List(invoiceGroup) {
      var temp = [];
      this.Invoice.filter((invoice) =>
        invoiceGroup.invoices.map((invoice) => invoice.ID).includes(invoice.ID)
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
          const index = temp
            .map((item) => item.Barcode_ID)
            .indexOf(item.Barcode_ID);
          if (index == -1) {
            let clonedItem = JSON.parse(JSON.stringify(item));
            if (
              item.Cost != "" &&
              item.Cost != null &&
              item.Cost != undefined
            ) {
              clonedItem.Unit_price = parseFloat(clonedItem.Cost);
            }
            temp.push(clonedItem);
          } else {
            temp[index].piece =
              parseInt(temp[index].piece) + parseInt(item.piece);
          }
        });
      return temp;
    },
    deleteItem(invoiceGroup) {
      const index = this.InvoiceGroupList.indexOf(invoiceGroup);
      confirm("Are you sure you want to delete this item?") &&
        Vue.set(this.InvoiceGroupList[index], "status", "deleted");
      this.UpdateInvoiceGroup();
    },
    filterTable(element, index) {
      return element.status != "deleted";
    },
    getInvoiceFrom(invoiceGroup) {
      return this.Invoice.filter((invoice) =>
        invoiceGroup.invoices.map((invoice) => invoice.ID).includes(invoice.ID)
      );
    },
    totalAmount(invoiceGroup) {
      return this.getInvoiceFrom(invoiceGroup)
        .map((invoice) => parseInt(invoice.TotalPiece))
        .reduce((a, b) => a + b);
    },
    totalPrice(invoiceGroup) {
      return (
        this.List(invoiceGroup)
          .map((item) => {
            return item.Unit_price * item.piece;
          })
          .reduce((a, b) => parseFloat(a) + parseFloat(b)) +
        parseFloat(this.TotalTax(invoiceGroup)) +
        parseFloat(this.TotalDiscounted(invoiceGroup))
      ).toFixed(2);
    },
    TotalTax(invoiceGroup) {
      return this.List(invoiceGroup)
        .map((item) => item.Tax * item.piece)
        .reduce((a, b) => parseFloat(a) + parseFloat(b))
        .toFixed(2);
    },
    TotalDiscounted(invoiceGroup) {
      return this.List(invoiceGroup)
        .map((item) => item.Discounted * item.piece)
        .reduce((a, b) => parseFloat(a) + parseFloat(b))
        .toFixed(2);
    },
    openInvoiceList(invoiceGroup) {
      Vue.set(this, "selectedInvoices", invoiceGroup.invoices);
      this.invoiceListDialog = true;
    },
    print(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      invoiceGroup.invoices = this.getInvoiceFrom(invoiceGroup);
      ipcRenderer.send("PrintInvoicesGroup", invoiceGroup);
    },
    rec(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      invoiceGroup.invoices = this.getInvoiceFrom(invoiceGroup);
      ipcRenderer.send("SaveInvoicesGroup", invoiceGroup);
    },
    view(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      invoiceGroup.invoices = this.getInvoiceFrom(invoiceGroup);
      ipcRenderer.send("ViewInvoicesGroup", invoiceGroup);
    },
  },
};
</script>
