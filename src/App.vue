<template>
  <v-app dark>
    <v-toolbar>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Mintmart management</v-toolbar-title>
      <v-spacer></v-spacer>

      <Searchbar></Searchbar>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-navigation-drawer :mini-variant="mini" v-model="drawer" absolute stateless width="250">
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
                <v-btn flat icon @click="EditInformation">
                  <v-icon color="grey lighten-1">settings</v-icon>
                </v-btn>
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
import { mapMutations } from "vuex";
import Searchbar from "./components/searchbar";
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
        { title: "About", icon: "question_answer", path: "/about" }
      ],
      mini: true,
      right: null
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    EditInformation() {
      alert("To editing...");
    },
    ...mapMutations(["initialize"]),
    Changing() {
      console.log(this.SearchField);
      this.$store.commit("SetSF", this.SearchField);
    },
    goto(page) {
      this.$router.push({ path: page });
    }
  }
};
</script>
