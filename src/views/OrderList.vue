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
      return this.getInvoiceFrom(invoiceGroup)
        .map((invoice) => parseFloat(invoice.TotalPrice))
        .reduce((a, b) => a + b)
        .toFixed(2);
    },
    openInvoiceList(invoiceGroup) {
      Vue.set(this, "selectedInvoices", invoiceGroup.invoices);
      this.invoiceListDialog = true;
    },
    print(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      console.log(invoiceGroup);
      ipcRenderer.send("PrintInvoicesGroup", invoiceGroup);
    },
    rec(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      ipcRenderer.send("SaveInvoicesGroup", invoiceGroup);
    },
    view(invoiceGroup) {
      invoiceGroup.showCost = this.ActiveCost;
      ipcRenderer.send("ViewInvoicesGroup", invoiceGroup);
    },
  },
};
</script>
