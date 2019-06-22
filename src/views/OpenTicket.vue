
  <template>
  <v-app dark>
    <v-card>
      <v-toolbar>
        <v-btn flat large @click="NewItem">
          <v-icon large>add_box</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-data-table
      :rows-per-page-items="[{text:'All',value:-1}]"
      :headers="head"
      :items="TicketList"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td class="text-xs-left">
          <v-edit-dialog :return-value.sync="props.item.Detail" lazy class="text-xs-left">
            {{ props.item.Detail }}
            <template v-slot:input>
              <v-text-field v-model="props.item.Detail" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
          <v-edit-dialog :return-value.sync="props.item.Unit_price" lazy class="text-xs-center">
            {{ props.item.Unit_price }}
            <template v-slot:input>
              <v-text-field v-model="props.item.Unit_price" single-line type="number"></v-text-field>
            </template>
          </v-edit-dialog>
        </td>

        <td class="justify-center align-center layout">
          <v-icon small :disabled="props.item.piece<=1" @click="DecreasePiece(props.item)">remove</v-icon>
          <v-edit-dialog :return-value.sync="props.item.piece" lazy class="text-xs-center">
            {{ props.item.piece }}
            <template v-slot:input>
              <v-text-field v-model="props.item.piece" single-line type="number"></v-text-field>
            </template>
          </v-edit-dialog>
          <v-icon small @click="IncreasePiece(props.item)">add</v-icon>
        </td>
        <td class="text-xs-center">{{ (props.item.piece * props.item.Unit_price).toFixed(2) }}</td>
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
                  Invoice number :
                  <span
                    v-if="!selected"
                  >{{new Date().getFullYear()}} - {{(parseInt((Invoice[Invoice.length-1]==null)?0:Invoice[Invoice.length-1].ID)+1).toString().padStart(3, "0")}}</span>
                  <span v-else>{{InvoiceNumber}}</span>
                  <v-autocomplete
                    v-if="!customCustomer"
                    v-model="CustomerID"
                    :items="Customers"
                    :label="((CustomerID==null)?'Customer':'Customer ID : '+CustomerID)"
                    item-text="Name"
                    item-value="ID"
                    clearable
                    chips
                    :filter="SearchFilter"
                  ></v-autocomplete>
                  <v-text-field
                    v-if="customCustomer"
                    v-model="CustomerName"
                    label="Customer name"
                    required
                  ></v-text-field>
                  <v-switch v-model="customCustomer" label="Custom customer"></v-switch>

                  <v-text-field v-model="Paid" type="number" label="Payment" required></v-text-field>
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
                    <v-text-field v-model="TaxRate" label="Tax rate (%)" type="number" required></v-text-field>
                    <v-textarea v-model="Note" label="Note"></v-textarea>
                    <div>Subtotal : {{TotalPrice()}} .-</div>
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
                <h1 class="headline mb-0 text-md-right">Total : {{FinalPrice()}} .-</h1>
              </v-flex>
              <v-btn flat color="red" :disabled="TicketList.length<=0" @click="Clear">Clear</v-btn>
              <v-btn flat color="blue" :disabled="TicketList.length<=0" @click="Sale">place order</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
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
export default {
  name: "App",
  mounted() {
    if (!this.selected) {
      this.Clear();
    }
  },
  data() {
    return {
      customCustomer: true,
      menu: false,
      date: moment(new Date()).format("YYYY-MM-DD"),
      Enter: "",
      model: null,
      Note: "",
      CustomerID: "",
      CustomerName: "",
      Paid: "",
      ActiveDis: false,
      TaxRate: 0,
      InvoiceNumber: "",
      headers: [
        {
          width: "1%",
          text: "Description",
          align: "left",
          value: "Detail",
          sortable: false
        },
        {
          width: "1%",
          text: "Unit price",
          align: "center",
          value: "Unit_price",
          sortable: false
        },
        { width: "1%", text: "Qt.", sortable: false, align: "center" },
        {
          width: "1%",
          text: "Line total",
          value: "Unit_price",
          align: "center",
          sortable: false
        },
        { width: "1%", text: "Action", sortable: false, align: "center" }
      ]
    };
  },
  methods: {
    NewItem() {
      this.TicketList.unshift({
        Detail: "_description_",
        Unit_price: 0,
        piece: 1
      });
    },
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

      if (this.Paid == "") {
        alert("Please put amount to pay.");
        return;
      }
      var DateFormat = "MMMM Do YYYY";
      var now_date = moment(this.date).format(DateFormat);
      var new_invoice = {};
      if (!this.customCustomer) {
        var IndFind = await this.Customers.findIndex(
          customer => customer.ID === this.CustomerID
        );
        if (IndFind == -1) {
          alert("Not found this customer ID!!");
          return;
        }
        new_invoice.Customer = await this.Customers.find(
          customer => customer.ID === this.CustomerID
        );
      } else {
        new_invoice.Customer = { Name: this.CustomerName };
      }
      new_invoice.List = { ...this.TicketList };
      new_invoice.isOpTicket = true;
      new_invoice.ActiveDis = this.ActiveDis;
      new_invoice.date = now_date;
      new_invoice.customCustomer = this.customCustomer;
      new_invoice.Note = this.Note;
      new_invoice.TaxRate = this.TaxRate;
      new_invoice.Paid = this.Paid;
      new_invoice.TotalTax = this.TotalTaxes();
      new_invoice.SubTotal = this.TotalPrice();
      new_invoice.TotalPrice = this.FinalPrice();
      new_invoice.TotalDiscounted = 0;
      new_invoice.TotalOrdered = this.TotalOrdered();
      new_invoice.TotalPiece = this.TotalPiece();
      if (!this.selected) await this.CreateInvoice(new_invoice);
      else {
        new_invoice.InvoiceNumber=this.InvoiceNumber
        await Object.assign(
        this.Invoice[
          this.Invoice.findIndex(s => s.InvoiceNumber === this.InvoiceNumber)
        ],
        new_invoice
      );
      }
      ipcRenderer.send("printPDF", new_invoice);
      this.UpdateInvoice();
      this.UpdateStock();
      if(!this.selected)this.Clear();
    },
    Clear() {
      this.TicketList.splice(0, this.TicketList.length);
      this.Paid = "";
      this.CustomerID = "";
      this.CustomerName = "";
      this.TaxRate = 0;
      this.Note = "";
      this.date = moment(new Date()).format("YYYY-MM-DD");
    },
    ...mapMutations([
      "initialize",
      "UpdateStock",
      "CreateInvoice",
      "UpdateInvoice"
    ]),
    FinalPrice: function() {
      return (
        parseFloat(this.TotalPrice()) + parseFloat(this.TotalTaxes())
      ).toFixed(2);
    },
    TotalPrice: function() {
      return this.TicketList.map(item => {
        return this.CalPrice(item);
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalTaxes: function() {
      return (
        (parseFloat(this.TotalPrice()) / 100) *
        (this.TaxRate == "" ? 0 : this.TaxRate)
      ).toFixed(2);
    },
    TotalOrdered: function() {
      return this.TicketList.map(item => {
        return item;
      })
        .reduce((total, num) => {
          return parseFloat(total) + 1;
        }, 0)
        .toFixed(0);
    },
    TotalPiece: function() {
      return this.TicketList.map(item => {
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
      const index = this.TicketList.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.TicketList.splice(index, 1);
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
    head() {
      if (this.ActiveDis) return this.headers;
      else
        return this.headers
          .map(item => {
            if (
              item.value != "Discount_per" &&
              item.value != "Discount_amount"
            ) {
              return item;
            }
          })
          .filter(item => item != null);
    },
    ...mapState([
      "Invoice",
      "SearchField",
      "JSONStock",
      "Stock",
      "TicketList",
      "Customers",
      "JSONInformation"
    ])
  },
  created() {
    this.$store.commit("SetSF", "");
  },
  props: {
    selected: Object
  },
  watch: {
    selected: async function() {
      this.Clear();
      this.Paid = this.selected.Paid;
      this.date = moment(this.selected.date, "MMMM Do YYYY, h:mm:ss a").format(
        "YYYY-MM-DD"
      );
      this.CustomerID = this.selected.Customer.ID;
      this.CustomerName = this.selected.Customer.Name;
      this.Note = this.selected.Note;
      this.InvoiceNumber = this.selected.InvoiceNumber;
      await Object.values(this.selected.List).map(item => {
        this.TicketList.push(item);
      });
      this.ActiveDis = this.selected.ActiveDis;
      this.TaxRate = this.selected.TaxRate;
      this.customCustomer = this.selected.customCustomer;
    }
  }
};
</script>
