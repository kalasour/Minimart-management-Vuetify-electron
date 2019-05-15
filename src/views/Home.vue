
  <template>
  <v-app>
    <v-card>
      <v-toolbar>
        <v-combobox
          auto-select-first
          autofocus
          v-model="model"
          :items="Stock"
          :label="`Enter Barcode ID`"
          prepend-icon="toc"
          item-text="Barcode_ID"
          :filter="ItemFilter"
          @input="updateSearchField(model)"
        >
          <template v-slot:selection="data" @input="look(data.parent)">
            <v-chip
              :selected="data.selected"
              close
              class="chip--select-multi"
            >{{SearchField}}{{look(data.parent)}}</v-chip>
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
              <!-- <v-list-tile-content v-text="data.item.Detail"></v-list-tile-content>
        <v-list-tile-content>
          <v-list-tile-title v-text="data.item.Barcode_ID"></v-list-tile-title>
          <v-list-tile-sub-title v-text="data.item.QT"></v-list-tile-sub-title>
              </v-list-tile-content>-->
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
        <td class="text-xs-center">- {{ props.item.Discount_per }} %</td>
        <td class="text-xs-center">- {{ props.item.Discount_amount }} .-</td>
        <!-- <td class="text-xs-center">{{ props.item.Discounted }}</td> -->
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
                  <!-- <v-text-field v-model="CustomerID" label="Customer ID" required></v-text-field> -->
                  Invoice number : {{new Date().getFullYear()}} - {{(parseInt(Invoice[Invoice.length-1].ID)+1).toString().padStart(3, "0")}}
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
  name: "App",
  created() {
    // this.initialize();
  },
  data() {
    return {
      Enter: "",
      model: null,
      Note: "",
      CustomerID: "",
      Paid: "",
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
        data = data.Barcode_ID;
      }
      // this.$store.commit("SetSF", data);
      this.Enter = data;
    },
    ItemFilter(item, queryText, itemText) {
      const textOne = item.Detail.toLowerCase();
      const textTwo = item.Barcode_ID.toLowerCase();
      const text3 = item.JM_ID.toLowerCase();
      const text4 = item.BE_ID.toLowerCase();
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

      var DateFormat = "MMMM Do YYYY, h:mm:ss a";
      var now_date = moment(new Date()).format(DateFormat);
      var new_invoice = {};
      new_invoice.Customer = await this.Customers.find(
        customer => customer.ID === this.CustomerID
      );
      new_invoice.List = { ...this.List };
      new_invoice.date = now_date;
      new_invoice.Note = this.Note;
      new_invoice.Paid = this.Paid;
      new_invoice.TotalTax = this.TotalTaxes();
      new_invoice.TotalPrice = this.TotalPrice();
      new_invoice.TotalDiscounted = this.TotalDiscounted();
      new_invoice.TotalOrdered = this.TotalOrdered();
      new_invoice.TotalPiece = this.TotalPiece();
      await this.List.map((item, index) => {
        this.Stock[
          this.Stock.findIndex(s => s.Barcode_ID === item.Barcode_ID)
        ].QT -= item.piece;
      });
      await this.CreateInvoice(new_invoice);
      ipcRenderer.send("printPDF", new_invoice);
      this.UpdateInvoice();
      this.UpdateStock();
      this.Clear();
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
      const index = this.Stock.indexOf(item);
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
  computed: {
    ...mapState([
      "Invoice",
      "SearchField",
      "JSONStock",
      "Stock",
      "List",
      "Customers",
      "JSONInformation"
    ])
  },
  created() {
    this.$store.commit("SetSF", "");
  },
  watch: {
    Enter: function() {
      if (this.Enter == "" || this.Enter == null) return;
      // console.log(this.SearchField)
      var Sindex = this.Stock.map(item => {
        return item.Barcode_ID;
      }).indexOf(this.Enter);
      if (Sindex != -1) {
        var Findex = this.List.map(item => {
          return item.Barcode_ID;
        }).indexOf(this.Enter);
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
        alert("Not founded in stock!!");
      }
      this.Enter = "";
    }
  }
};
</script>
