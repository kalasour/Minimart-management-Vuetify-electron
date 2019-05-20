
  <template>
  <v-app dark>
    <v-card>
      <v-toolbar>
        <v-combobox
          auto-select-first
          autofocus
          v-model="model"
          :items="Stock"
          :label="`Enter Barcode ID`"
          prepend-icon="toc"
          :filter="ItemFilter"
          @input="updateSearchField(model)"
        >
          <template v-slot:selection="data">
            <v-chip :selected="data.selected" close class="chip--select-multi">{{look(data.parent)}}</v-chip>
          </template>
          <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-layout dark>
                <v-flex xs12 sm6 py2 pt-6>{{data.item.Detail}}</v-flex>
                <v-flex xs12 sm6 py2 pt-6>Left : {{data.item.QT}} pcs.</v-flex>
              </v-layout>
            </template>
          </template>
        </v-combobox>
      </v-toolbar>
    </v-card>

    <v-data-table :headers="headers" :items="List" class="elevation-1">
      <template v-slot:items="props">
        <td class="justify-center align-center layout">
          <v-icon small :disabled="props.item.piece<=1" @click="DecreasePiece(props.item)">remove</v-icon>
          <v-card-text class="text-xs-center">{{props.item.piece}}</v-card-text>
          <v-icon
            small
            :disabled="props.item.piece>=props.item.QT&&false"
            @click="IncreasePiece(props.item)"
          >add</v-icon>
        </td>
        <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
        <td class="text-xs-left">{{ props.item.Detail }}</td>
        <td class="text-xs-left">{{ props.item.Unit_price }}</td>
        <td>
          <div class="text-xs-center justify-center align-center layout">
            -
            <v-text-field type="number" class="px-2" v-model="props.item.Discount_per"></v-text-field>%
          </div>
        </td>
        <td>
          <div class="text-xs-center justify-center align-center layout">
            -
            <v-text-field type="number" class="px-2" v-model=" props.item.Discount_amount"></v-text-field>.-
          </div>
        </td>
        <td class="text-xs-center">{{ CalPrice(props.item) - props.item.Tax }}</td>
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
                  Invoice number : {{InvoiceNumber}}
                  <v-autocomplete
                    v-model="CustomerID"
                    :items="Customers"
                    :label="((CustomerID==null)?'Customer':'Customer ID : '+CustomerID)"
                    item-text="Name"
                    item-value="ID"
                    clearable
                    chips
                    :filter="SearchFilter"
                  ></v-autocomplete>
                  <v-text-field v-model="Paid" type="number" label="Paid" required></v-text-field>
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

                    <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-flex mx-5>
                    <v-textarea v-model="Note" label="Note"></v-textarea>
                    <div>Subtotal : {{TotalPrice()-TotalTaxes()}} .-</div>
                    <div>Taxes : {{TotalTaxes()}}</div>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <div class="text-xs-center">
              <v-flex xs12>
                <h1 class="headline mb-0 text-md-right">Total : {{TotalPrice()}} .-</h1>
              </v-flex>
              <v-btn flat color="red" :disabled="List.length<=0" @click="Clear">Clear</v-btn>
              <v-btn flat color="blue" :disabled="List.length<=0" @click="Sale">placeorder</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import moment from "moment";
import { ipcRenderer } from "electron";
import { constants } from "crypto";
export default {
  props: {
    selected: Object
  },
  name: "App",
  created() {},
  computed: {
    ...mapState([
      "Invoice",
      "SearchField",
      "JSONStock",
      "Stock",
      "Customers",
      "JSONInformation"
    ])
  },
  data() {
    return {
      List: [],
      OldList: [],
      date: "",
      Paid: "",
      menu: false,
      Enter: "",
      model: null,
      Note: "",
      CustomerID: "",
      InvoiceNumber: "",
      headers: [
        { text: "Qty.", sortable: false, align: "center" },
        {
          text: "BARCODE ID",
          value: "Barcode_ID",
          align: "center",
          sortable: false
        },
        {
          text: "Description",
          align: "left",
          value: "Detail",
          sortable: false
        },
        {
          text: "Unit price",
          align: "left",
          value: "Unit_price",
          sortable: false
        },
        {
          text: "% Discount",
          value: "Discount_per",
          align: "center",
          sortable: false
        },
        {
          text: "Amount Discount",
          value: "Discount_amount",
          align: "center",
          sortable: false
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
          sortable: false
        },
        {
          text: "Tax",
          align: "left",
          value: "Tax",
          sortable: false
        },
        { text: "Action", sortable: false, align: "center" }
      ]
    };
  },
  methods: {
    look(data) {
      // data.item = "";
      // this.model=null
      // data.selectedValues.splice(0,1)
      // data.selectedItems.splice(0,1)
      data.internalValue = "";
      // console.log(data);
    },
    updateSearchField(data) {
      if (data == "") {
        return;
      }

      if (typeof data === "object" && data != null) {
        data = this.Stock.indexOf(data);
      } else {
        data = this.Stock.map(item => item.Barcode_ID).indexOf(data);
      }
      // this.$store.commit("SetSF", data);
      if (data != -1) data += 1;
      this.Enter = data;
    },
    ItemFilter(item, queryText, itemText) {
      const textOne = item.Detail == null ? "" : item.Detail.toLowerCase();
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
    async Sale() {
      // console.log(new_invoice)
      // console.log(moment(now_date,DateFormat).format('D'))

      if (this.CustomerID == "" || this.Paid == "") {
        alert("Please input customer ID or paid money!");
        return;
      }
      var IndFind = await this.Customers.findIndex(
        customer => customer.ID === this.CustomerID
      );
      if (IndFind == -1) {
        alert("Not found this customer ID!!");
        return;
      }

      var DateFormat = "MMMM Do YYYY";
      var now_date = moment(this.date).format(DateFormat);
      var new_invoice = {};
      new_invoice.Customer = await this.Customers.find(
        customer => customer.ID === this.CustomerID
      );
      new_invoice.List = { ...this.List };
      new_invoice.date = now_date;
      new_invoice.Note = this.Note;
      new_invoice.Paid = this.Paid;
      new_invoice.InvoiceNumber = this.InvoiceNumber;
      new_invoice.TotalTax = this.TotalTaxes();
      new_invoice.TotalPrice = this.TotalPrice();
      new_invoice.TotalDiscounted = this.TotalDiscounted();
      new_invoice.TotalOrdered = this.TotalOrdered();
      new_invoice.TotalPiece = this.TotalPiece();
      await this.OldList.map(async (item, index) => {
        var indexT = await this.Stock.findIndex(s => s.index === item.index);
        // console.log(indexT, this.Stock[indexT].QT, "+", item.piece);
        if (indexT != -1) this.Stock[indexT].QT += item.piece;
      });
      await this.List.map(async (item, index) => {
        var indexT = await this.Stock.findIndex(s => s.index === item.index);
        // console.log(indexT, this.Stock[indexT].QT, "-", item.piece);
        if (indexT != -1) this.Stock[indexT].QT -= item.piece;
      });
      Object.assign(
        this.Invoice[
          this.Invoice.findIndex(s => s.InvoiceNumber === this.InvoiceNumber)
        ],
        new_invoice
      );
      ipcRenderer.send("printPDF", new_invoice);
      this.OldList = JSON.parse(JSON.stringify(this.List));
      this.UpdateInvoice();
      this.UpdateStock();
    //   console.log("updated");
    },
    Clear() {
      this.List.splice(0, this.List.length);
      this.Paid = "";
      this.CustomerID = "";
      this.Note = "";
    },
    ...mapMutations([
      "initialize",
      "UpdateStock",
      "CreateInvoice",
      "UpdateInvoice"
    ]),
    TotalPrice: function() {
      return this.List.map(item => {
        return this.CalPrice(item);
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalTaxes: function() {
      return this.List.map(item => {
        return item.Tax;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalDiscounted: function() {
      return this.List.map(item => {
        return item.Discounted;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalOrdered: function() {
      return this.List.map(item => {
        return item;
      })
        .reduce((total, num) => {
          return parseFloat(total) + 1;
        }, 0)
        .toFixed(0);
    },
    TotalPiece: function() {
      return this.List.map(item => {
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
    }
  },

  created() {
    this.$store.commit("SetSF", "");
  },
  watch: {
    selected: function() {
      this.Paid = this.selected.Paid;
      this.date = moment(this.selected.date, "MMMM Do YYYY, h:mm:ss a").format(
        "YYYY-MM-DD"
      );
      this.CustomerID = this.selected.Customer.ID;
      this.Note = this.selected.Note;
      this.InvoiceNumber = this.selected.InvoiceNumber;
      this.List = Object.values(this.selected.List);
      this.OldList = JSON.parse(JSON.stringify(this.List));
    },
    Enter: function() {
      if (this.Enter == "" || this.Enter == null) return;
      // console.log(this.SearchField)
      var Sindex = this.Enter - 1;
      if (Sindex > -1) {
        var Findex = this.List.map(item => {
          return item.index;
        }).indexOf(this.JSONStock[Sindex].index);
        // alert(Findex)
        if (Findex != -1) {
          // if (this.List[Findex].piece < this.List[Findex].QT)
          this.List[Findex].piece++;
          // else alert("Out of stock!");
          this.Enter = "";
          return;
        }
        // if (this.JSONStock[this.Enter].QT < 1) {
        //   alert("Out of stock!!");
        //   this.Enter = "";
        //   return;
        // }

        this.JSONStock[Sindex].piece = 1;
        this.JSONStock[Sindex].Discounted = 0;
        this.List.push(Object.assign({}, this.JSONStock[Sindex]));
      } else if (this.Enter != null) {
        // alert("Not founded in stock!!");
      }
      this.Enter = "";
    }
  }
};
</script>
