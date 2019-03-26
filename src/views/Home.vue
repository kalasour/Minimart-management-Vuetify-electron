
  <template>
  <v-app>
    <v-data-table :headers="headers" :items="List" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.Detail }}</td>
        <td class="text-xs-center">{{ props.item.Barcode_ID }}</td>
        <td class="text-xs-center">-{{ props.item.Discount_amount }} .-</td>
        <td class="text-xs-center">-{{ props.item.Discount_per }}%</td>
        <td class="text-xs-center">{{ props.item.Discounted }}</td>
        <td class="text-xs-center">{{ CalPrice(props.item) }}</td>
        <td class="justify-center layout px-0">
          <v-icon small :disabled="props.item.piece<=1" @click="DecreasePiece(props.item)">remove</v-icon>
          <v-card-text class="text-xs-center">{{props.item.piece}}</v-card-text>
          <v-icon
            small
            :disabled="props.item.piece>=props.item.QT"
            @click="IncreasePiece(props.item)"
          >add</v-icon>
        </td>
        <td class="text-xs-center">
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>

    <v-layout>
      <v-flex xs12 sm6 py2 pt-3 offset-sm6>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 center">Payment summary</h3>
              <div>Total Discounted : {{TotalDiscounted()}} .-</div>
              <div>Total Ordered : {{TotalOrdered()}}</div>
              <div>Total Piece : {{TotalPiece()}}</div>
              <div>Paid  : {{TotalPiece()}}</div>
              <div>Customer ID : {{TotalPiece()}}</div>
              <h1 class="headline mb-0">Total price : {{TotalPrice()}} .-</h1>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="red" :disabled="List.length<=0" @click="Clear">Clear</v-btn>
            <v-btn flat color="blue" :disabled="List.length<=0" @click="Sale">Sale</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      headers: [
        {
          text: "Detail",
          align: "left",
          value: "Detail",
          sortable: false
        },
        {
          text: "BARCODE ID",
          value: "Barcode_ID",
          align: "center",
          sortable: false
        },
        {
          text: "Discount(amount)",
          value: "Discount_amount",
          align: "center",
          sortable: false
        },
        {
          text: "Discount(%)",
          value: "Discount_per",
          align: "center",
          sortable: false
        },
        {
          text: "Discounted",
          value: "Discount_per",
          align: "center",
          sortable: false
        },
        {
          text: "Price",
          value: "Unit_price",
          align: "center",
          sortable: false
        },
        { text: "Piece", sortable: false, align: "center" },
        { text: "Action", sortable: false, align: "center" }
      ]
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    Sale() {},
    Clear() {
      this.List.splice(0,this.List.length)
    },
    ...mapMutations(["initialize", "UpdateStock"]),
    TotalPrice: function() {
      return this.List.map(item => {
        return this.CalPrice(item);
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
      return (
        (item.Unit_price - discount_amount - discount_per) *
        item.piece
      ).toFixed(2);
    }
  },
  computed: {
    ...mapState(["SearchField", "JSONStock", "Stock", "List"])
  },
  watch: {
    SearchField: function() {
      if (this.JSONStock[this.SearchField] != null) {
        if (this.JSONStock[this.SearchField].QT < 1) {
          alert("Out of stock!!");
          return;
        }
        this.JSONStock[this.SearchField].piece = 1;
        this.JSONStock[this.SearchField].Discounted = 0;
        this.List.push(Object.assign({}, this.JSONStock[this.SearchField]));
      } else if (this.SearchField != null) {
        alert("Not founded in stock!!");
      }
    }
  }
};
</script>
