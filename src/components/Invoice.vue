
  <template>
  <v-card dark color="grey darken-4">
    <v-toolbar dark flat>
      <v-toolbar-title>Sale by customer</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      
       <v-layout column align-end>
        <v-flex>
          <span>Invoice No. : {{selected.InvoiceNumber}}</span>
        </v-flex>
        <v-flex>
          <span>Date : {{selected.date}}</span>
        </v-flex>
        <v-flex>
          <span>Customer Name : {{(selected.Customer==null)?'':selected.Customer.Name}}</span>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <v-data-table :rows-per-page-items="[{text:'All',value:-1}]"  :headers="headers" :items="currentList()" class="elevation-1">
      <template v-slot:items="props">
        <td class="justify-center layout px-0">
          <v-card-text class="text-xs-center">{{props.item.piece}}</v-card-text>
          
        </td>
        <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
        <td class="text-xs-center">{{ props.item.Detail }}</td>
        <td class="text-xs-center">{{ props.item.Unit_price }}</td>
        <td class="text-xs-center">{{ props.item.Tax }}</td>
        <td class="text-xs-center">- {{ props.item.Discount_per }} %</td>
        <td class="text-xs-center">- {{ props.item.Discount_amount }} .-</td>
        <!-- <td class="text-xs-center">{{ props.item.Discounted }}</td> -->
        <td class="text-xs-center">{{ props.item.Price }}</td>
      </template>
    </v-data-table>

    <v-layout>
      <v-flex xs12 sm6 py2 pt-3 offset-sm9>
        <v-card color="grey darken-3">
          <v-card-title primary-title>
            <v-flex xs12>
              <h3 class="headline mb-0 text-md-center">Payment summary</h3>
                  <v-flex mx-5>
                    <div>Subtotal : {{parseFloat(TotalPrice()-TotalTaxes()).toFixed(2)}} .-</div>
                    <div>Taxes : {{TotalTaxes()}}</div>
                    <div>Total : {{TotalPrice()}} .-</div>
                  </v-flex>
                </v-flex>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <div class="text-xs-center">
              <v-flex xs12>
                <h1 class="headline mb-0 text-md-right">Paid : {{parseFloat(selected.Paid).toFixed(2)}} .-</h1>
                <h1 class="headline mb-0 text-md-right">Amount Due : {{(Math.max(0,TotalPrice()-selected.Paid)).toFixed(2)}} .-</h1>
              </v-flex>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import moment from "moment";
import { ipcRenderer } from "electron";
export default {
  name: "App",
  props: {
    selected: Object
  },
  created() {
    // this.initialize();
  },
  data() {
    return {
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
          align: "center",
          value: "Detail",
          sortable: false
        },
        {
          text: "Unit price",
          align: "center",
          value: "Unit_price",
          sortable: false
        },
        {
          text: "Tax",
          align: "center",
          value: "Tax",
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
        // { text: "Action", sortable: false, align: "center" }
      ]
    };
  },
  methods: {
    clearSF() {
      this.$store.commit("SetSF", "");
    },
    currentList(){
      return (this.$props.selected.List==null)?[]:Object.values(this.$props.selected.List)
    },

    TotalPrice: function() {
      return this.currentList().map(item => {
        return item.Price;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalTaxes: function() {
      return this.currentList().map(item => {
        return item.Tax;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalDiscounted: function() {
      return this.currentList().map(item => {
        return item.Discounted;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(2);
    },
    TotalOrdered: function() {
      return this.currentList().map(item => {
        return item;
      })
        .reduce((total, num) => {
          return parseFloat(total) + 1;
        }, 0)
        .toFixed(0);
    },
    TotalPiece: function() {
      return this.currentList().map(item => {
        return item.piece;
      })
        .reduce((total, num) => {
          return parseFloat(total) + parseFloat(num);
        }, 0)
        .toFixed(0);
    },

    SearchFilter(item, queryText, itemText) {
      const textOne = item.Detail.toLowerCase();
      const textTwo = item.ID.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    // CalPrice(item) {
    //   var discount_per = 0,
    //     discount_amount = 0;
    //   if (item.Discount_amount != null) discount_amount = item.Discount_amount;
    //   if (item.Discount_per != null) discount_per = item.Discount_per;
    //   if (discount_per != 0)
    //     discount_per = (discount_per / 100) * item.Unit_price;
    //   item.Discounted = (
    //     (parseFloat(discount_amount) + parseFloat(discount_per)) *
    //     item.piece
    //   ).toFixed(2);
    //    item.Tax = (
    //     (parseFloat((this.JSONInformation==null||this.JSONInformation.Tax==null)?'0':this.JSONInformation.Tax) / 100) *
    //     ((item.Unit_price - discount_amount - discount_per) * item.piece)
    //   ).toFixed(2);
    //   item.Price = (
    //     (item.Unit_price - discount_amount - discount_per) * item.piece +
    //     parseFloat(item.Tax)
    //   ).toFixed(2);
    //   return item.Price;
    // }
  },
  computed: {
    ...mapState([
      "SearchField",
      "JSONStock",
      "Stock",
      "List",
      "Customers",
      "JSONInformation"
    ])
  },
  created() {
  },
  
};
</script>
