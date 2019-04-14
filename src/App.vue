<template>
  <v-app dark>
    <v-toolbar v-if="this.$route.path!=='/print'">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Mintmart management</v-toolbar-title>
      <v-spacer></v-spacer>

      <Searchbar></Searchbar>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-navigation-drawer v-if="this.$route.path!=='/print'" :mini-variant="mini" v-model="drawer" absolute stateless width="250">
        <div @mouseover="mini=false" @mouseout="mini=true" absolute>
          <v-list class="pa-1">
            <v-list-tile avatar tag="div">
              <v-list-tile-avatar>
                <img src="https://pngimage.net/wp-content/uploads/2018/06/minimart-png-6.png">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>Minimart</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon @click="editInfo()">
                      <v-icon color="grey lighten-1">settings</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Minimart Information</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.Name" label="Minimart name"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.Address" label="Adress"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.Contact" label="Contact"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md4>
                            <v-text-field type="number" v-model="editedItem.Tax" label="Tax (%)"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <v-list class="pt-0" dense>
            <v-divider light></v-divider>
            <v-list-tile v-for="item in items" :key="item.title" @click="goto(item.path)">
              <v-list-tile-action>
                <v-icon :large="false" color="grey lighten-1">{{ item.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
      </v-navigation-drawer>
    </v-content>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Searchbar from "./components/searchbar";
import { ipcRenderer } from "electron";
export default {
  name: "App",
  components: {
    Searchbar
  },
  data() {
    return {
      SearchField: "",
      drawer: true,
      items: [
        { title: "Home", icon: "shopping_cart", path: "/" },
        { title: "Stock", icon: "table_chart", path: "/stock" },
        { title: "Customers", icon: "supervisor_account", path: "/customers" },
        { title: "Report", icon: "timeline", path: "/report" },
        { title: "About", icon: "question_answer", path: "/about" }
      ],
      mini: true,
      right: null,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      dialog: false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  computed: {
    // JSONInformation:{},
    ...mapState(["JSONInformation"])
  },
  created() {
    this.initialize();
    ipcRenderer.on("toPrint",async event => {
      this.$router.push({ path: "/print" });
    });
    ipcRenderer.send("toPrint");
  },
  methods: {
    ...mapMutations(["initialize", "UpdateInformation"]),
    goto(page) {
      this.$router.push({ path: page });
    },
    editInfo() {
      // console.log(JSONInformation);
      this.editedItem = Object.assign({}, this.JSONInformation);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
       ipcRenderer.send("Refresh");
      this.UpdateInformation(this.editedItem);
      this.close();
    }
  }
};
</script>
