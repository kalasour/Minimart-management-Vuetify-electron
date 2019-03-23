<template>
  <v-app dark>
    <v-toolbar>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="goto('/')">Link One</v-btn>
        <v-btn flat @click="goto('/stock')">Link Two</v-btn>
        <v-btn flat>Link Three</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-navigation-drawer
        :mini-variant="mini"
        v-model="drawer"
        absolute
        stateless
        width="200"
      >
        <div @mouseover="mini=false" @mouseout="mini=true" absolute>
          <v-list class="pa-1">
            <v-list-tile avatar tag="div">
              <v-list-tile-avatar>
                <img src="https://randomuser.me/api/portraits/men/85.jpg">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>John Leider</v-list-tile-title>
              </v-list-tile-content>
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
import HelloWorld from "./components/HelloWorld";
export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      SearchField: "",
      drawer: true,
      items: [
        { title: "Home", icon: "home", path: "/" },
        { title: "Stock", icon: "table_chart", path: "/stock" },
        { title: "About", icon: "question_answer", path: "/about" }
      ],
      mini: true,
      right: null
    };
  },
  methods: {
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
