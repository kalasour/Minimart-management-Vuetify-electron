<template>
  <div>
    <v-card>
      <v-toolbar>
        <v-combobox
          auto-select-first
          autofocus
          v-model="model"
          :items="StockWithCost"
          :label="`Search`"
          prepend-icon="search"
          :filter="ItemFilter"
          @input="updateSearchField(model)"
        >
          <template v-slot:selection="data">
            <v-chip
              :selected="data.selected"
              close
              class="chip--select-multi"
              >{{ look(data.parent) }}</v-chip
            >
          </template>
          <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-layout dark>
                <v-flex xs12 sm6 py2 pt-6>{{ data.item.code }}</v-flex>
                <v-flex xs12 sm6 py2 pt-6
                  >Left : {{ data.item.QT }} pcs.</v-flex
                >
              </v-layout>
            </template>
          </template>
        </v-combobox>
      </v-toolbar>
    </v-card>

    <v-data-table
      :rows-per-page-items="[{ text: 'All', value: -1 }]"
      :headers="head"
      :items="List"
      class="elevation-1"
      hide-actions
    >
      <template v-slot:pageText="props">
        <v-layout align-center justify-space-between row>
          <v-flex align-center justify-center class="ma-0 pa-0" xs6>
            <v-switch
              v-model="ActiveDis"
              hide-details
              label="Active Discounts"
            ></v-switch>
          </v-flex>
          <v-flex xs6
            >{{ props.pageStart }} - {{ props.pageStop }} of
            {{ props.itemsLength }}</v-flex
          >
        </v-layout>
      </template>
      <template v-slot:footer>
        <td></td>
        <td>
          <v-switch
            v-model="ActiveDis"
            hide-details
            label="Show Discounts"
          ></v-switch>
        </td>
        <td></td>
        <td></td>
        <td v-if="ActiveDis"></td>
        <td v-if="ActiveDis"></td>
        <td></td>
        <td>
          <p class="text-xs-center justify-center my-0">
            {{ List.length }} items
          </p>
        </td>
        <td></td>
      </template>
      <template v-slot:items="props">
        <td class="justify-center align-center layout">
          <v-icon
            small
            :disabled="props.item.piece <= 1"
            @click="DecreasePiece(props.item)"
            >remove</v-icon
          >
          <v-card-text class="text-xs-center">{{
            props.item.piece
          }}</v-card-text>
          <v-icon
            small
            :disabled="props.item.piece >= props.item.QT && false"
            @click="IncreasePiece(props.item)"
            >add</v-icon
          >
        </td>
        <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
        <td class="text-xs-left">{{ props.item.code }}</td>
        <td class="text-xs-center">{{ props.item.Unit_price }}</td>
        <td v-if="ActiveDis">
          <div class="text-xs-center justify-center align-center layout">
            -
            <v-edit-dialog
              :return-value.sync="props.item.Discount_per"
              lazy
              class="text-xs-center"
            >
              {{ props.item.Discount_per ? props.item.Discount_per : 0 }}
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.Discount_per"
                  single-line
                  type="number"
                ></v-text-field>
              </template> </v-edit-dialog
            >%
          </div>
        </td>
        <td v-if="ActiveDis">
          <div class="text-xs-center justify-center align-center layout">
            -
            <v-edit-dialog
              :return-value.sync="props.item.Discount_amount"
              lazy
              class="text-xs-center"
            >
              {{ props.item.Discount_amount ? props.item.Discount_amount : 0 }}
              <template v-slot:input>
                <v-text-field
                  v-model="props.item.Discount_amount"
                  single-line
                  type="number"
                ></v-text-field>
              </template> </v-edit-dialog
            >.-
          </div>
        </td>
        <td class="text-xs-center">
          {{ (CalPrice(props.item) - props.item.Tax).toFixed(2) }}
        </td>
        <td class="text-xs-left">{{ props.item.Tax }}</td>
        <td class="text-xs-center">
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>

    <v-layout>
      <v-flex xs12 sm6 py2 pt-3 offset-sm6>
        <v-card>
          <v-card-title primary-title>
            <v-flex xs12>
              <h3 class="headline mb-0 text-md-center">Payment summary</h3>

              <v-layout pt-2 row wrap mb-0>
                <v-flex xs6>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      v-model="date"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-switch
                    v-model="ActiveCost"
                    hide-details
                    label="Show Cost"
                  ></v-switch>
                </v-flex>
                <v-flex xs6>
                  <v-flex mx-5>
                    <v-textarea v-model="Note" label="Note"></v-textarea>
                    <div>
                      Subtotal :
                      {{ (TotalPrice() - TotalTaxes()).toFixed(2) }} .-
                    </div>
                    <div>Taxes : {{ TotalTaxes() }}</div>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <div class="text-xs-center">
              <v-flex xs12>
                <h1 class="headline mb-0 text-md-right">
                  Total : {{ TotalPrice() }} .-
                </h1>
              </v-flex>
              <v-btn
                flat
                color="red"
                :disabled="List.length <= 0"
                @click="Clear"
                >Clear</v-btn
              >
              <v-btn
                flat
                color="blue"
                :disabled="List.length <= 0"
                @click="Order"
                >place order</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<style>
.text-xs-center .v-menu__activator {
  justify-content: center;
}
</style>

<script>
import { mapMutations, mapState } from "vuex";
import moment from "moment";
import { ipcRenderer } from "electron";
import { constants } from "crypto";
export default {
  name: "Order",
  props: {
    selected: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  data() {
    return {
      menu: false,
      date: moment(new Date()).format("YYYY-MM-DD"),
      Enter: "",
      orderId: null,
      model: null,
      Note: "",
      CustomerID: "",
      Paid: "",
      ActiveDis: false,
      ActiveCost: true,
      headers: [
        { text: "Qty.", sortable: false, align: "center" },
        {
          text: "BARCODE ID",
          value: "Barcode_ID",
          align: "center",
          sortable: false,
        },
        {
          text: "Description",
          align: "left",
          value: "code",
          sortable: false,
        },
        {
          text: "Unit price",
          align: "left",
          value: "Unit_price",
          sortable: false,
        },
        {
          text: "% Discount",
          value: "Discount_per",
          align: "center",
          sortable: false,
        },
        {
          text: "Amount Discount",
          value: "Discount_amount",
          align: "center",
          sortable: false,
        },
        // {
        //   text: "Discounted",
        //   value: "Discount_per",
        //   align: "center",
        //   sortable: false
        // },
        {
          text: "Line total",
          value: "Unit_price",
          align: "center",
          sortable: false,
        },
        {
          text: "Tax",
          align: "left",
          value: "Tax",
          sortable: false,
        },
        { text: "Action", sortable: false, align: "center" },
      ],
      List: [],
    };
  },
  methods: {
    look(data) {
      data.internalValue = "";
    },
    updateSearchField(data) {
      if (data == "") {
        return;
      }

      if (typeof data === "object" && data != null) {
        data = this.StockWithCost.indexOf(data);
      } else {
        data = this.StockWithCost.map((item) => item.Barcode_ID).indexOf(data);
      }
      // this.$store.commit("SetSF", data);
      if (data != -1) data += 1;
      this.Enter = data;
    },
    ItemFilter(item, queryText, itemText) {
      const textOne = item.code == null ? "" : item.code.toLowerCase();
      const textTwo =
        item.Barcode_ID == null ? "" : item.Barcode_ID.toLowerCase();
      const text3 = item.JM_ID == null ? "" : item.JM_ID.toLowerCase();
      const text4 = item.BE_ID == null ? "" : item.BE_ID.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        text3.indexOf(searchText) > -1 ||
        text4.indexOf(searchText) > -1
      );
    },

    async Order() {
      var DateFormat = "MMMM Do YYYY";
      var date = moment(this.date).format(DateFormat);
      var newOrder = {};
      newOrder.List = { ...this.List };
      newOrder.ActiveDis = this.ActiveDis;
      newOrder.date = date;
      newOrder.Note = this.Note;
      newOrder.TotalTax = this.TotalTaxes();
      newOrder.TotalPrice = this.TotalPrice();
      newOrder.TotalDiscounted = this.TotalDiscounted();
      newOrder.TotalOrdered = this.TotalOrdered();
      newOrder.TotalPiece = this.TotalPiece();
      await this.List.map((item, index) => {
        this.Stock[this.Stock.findIndex((s) => s.index === item.index)].QT -=
          item.piece;
      });
      if (this.orderId != null) {
        newOrder.ID = this.orderId;
        await this.UpdateOrder(newOrder);
      } else {
        await this.CreateOrder(newOrder);
        this.Clear();
      }
      let invoiceGroup = {};
      invoiceGroup.showCost = this.ActiveCost;
      invoiceGroup.invoices = [newOrder];
      invoiceGroup.date = date;
      ipcRenderer.send("PrintInvoicesGroup", invoiceGroup);
    },
    Clear() {
      this.List.splice(0, this.List.length);
      this.Paid = "";
      this.CustomerID = "";
      this.Note = "";
      this.date = moment(new Date()).format("YYYY-MM-DD");
      this.orderTempList.splice(0, this.orderTempList.length);
    },
    ...mapMutations([
      "initialize",
      "UpdateStock",
      "CreateInvoice",
      "UpdateInvoice",
      "CreateOrder",
      "UpdateOrder",
    ]),
    TotalPrice: function() {
      return this.List.map((item) => {
        return this.CalPrice(item);
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalTaxes: function() {
      return this.List.map((item) => {
        return item.Tax;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalDiscounted: function() {
      return this.List.map((item) => {
        return item.Discounted;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalOrdered: function() {
      return this.List.map((item) => {
        return item;
      })
        .reduce((total, num) => {
          return parseFloat(total) + 1;
        }, 0)
        .toFixed(0);
    },
    TotalPiece: function() {
      return this.List.map((item) => {
        return item.piece;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(0);
    },
    IncreasePiece(item) {
      item.piece++;
    },
    deleteItem(item) {
      const index = this.List.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.List.splice(index, 1);
    },
    DecreasePiece(item) {
      item.piece--;
    },
    SearchFilter(item, queryText, itemText) {
      const textOne = item.Name.toLowerCase();
      const textTwo = item.ID.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    CalPrice(item) {
      var discount_per = 0,
        discount_amount = 0;
      if (item.Discount_amount != null) discount_amount = item.Discount_amount;
      if (item.Discount_per != null) discount_per = item.Discount_per;
      if (discount_per != 0)
        discount_per = (discount_per / 100) * item.Unit_price;
      item.Discounted = (
        (parseFloat(discount_amount) + parseFloat(discount_per)) *
        item.piece
      ).toFixed(2);
      item.Tax = (item.TaxActive
        ? (parseFloat(
            this.JSONInformation == null || this.JSONInformation.Tax == null
              ? "0"
              : this.JSONInformation.Tax
          ) /
            100) *
          ((item.Unit_price - discount_amount - discount_per) * item.piece)
        : 0
      ).toFixed(2);
      item.Price = (
        (item.Unit_price - discount_amount - discount_per) * item.piece +
        parseFloat(item.Tax)
      ).toFixed(2);
      return item.Price;
    },
  },
  computed: {
    StockWithCost() {
      return this.Stock.map((item) => {
        let clonedItem = JSON.parse(JSON.stringify(item));
        if (item.Cost != "" && item.Cost != null && item.Cost != undefined) {
          clonedItem.Unit_price = parseFloat(clonedItem.Cost);
        }
        return clonedItem;
      });
    },
    head() {
      if (this.ActiveDis) return this.headers;
      else
        return this.headers
          .map((item) => {
            if (
              item.value != "Discount_per" &&
              item.value != "Discount_amount"
            ) {
              return item;
            }
          })
          .filter((item) => item != null);
    },
    ...mapState([
      "Invoice",
      "SearchField",
      "JSONStock",
      "Stock",
      "Customers",
      "JSONInformation",
      "orderTempList",
    ]),
  },
  created() {
    this.$store.commit("SetSF", "");
    if (this.selected == undefined || this.selected == null) {
      this.List = this.orderTempList.map((kuy) => kuy);
    }
  },
  watch: {
    selected() {
      this.List = Object.values(this.selected.List);
      this.orderId = this.selected.ID;
      this.date = moment(this.selected.date, "MMMM Do YYYY, h:mm:ss a").format(
        "YYYY-MM-DD"
      );
    },
    List: async function() {
      if (
        (this.selected == undefined || this.selected == null) &&
        this.List.length != 0
      ) {
        this.orderTempList.splice(0, this.orderTempList.length);
        await this.List.forEach((item) => this.orderTempList.push(item));
      }
    },
    Enter: function() {
      if (this.Enter == "" || this.Enter == null) return;
      var Sindex = this.Enter - 1;
      let clonedItem = JSON.parse(JSON.stringify(this.JSONStock[Sindex]));
      if (Sindex > -1) {
        var Findex = this.List.map((item) => {
          return item.index;
        }).indexOf(clonedItem.index);
        if (Findex != -1) {
          this.List[Findex].piece++;
          this.Enter = "";
          return;
        }
        if (
          clonedItem.Cost != "" &&
          clonedItem.Cost != null &&
          clonedItem.Cost != undefined
        ) {
          clonedItem.Unit_price = parseFloat(clonedItem.Cost);
        }

        var indexFormBarcode = this.List.findIndex(
          (ele) =>
            ele.Barcode_ID == clonedItem.Barcode_ID &&
            ele.Unit_price == clonedItem.Unit_price
        );
        if (indexFormBarcode != -1) {
          this.List[indexFormBarcode].piece++;
          this.Enter = "";
          return;
        }

        clonedItem.piece = 1;
        clonedItem.Discounted = 0;
        this.List.unshift(Object.assign({}, clonedItem));
      } else if (this.Enter != null) {
      }
      this.Enter = "";
    },
  },
};
</script>
