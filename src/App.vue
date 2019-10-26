<template>
  <v-app dark>
    <v-toolbar v-if="this.$route.path!=='/print'">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Minimart management</v-toolbar-title>
      <v-spacer></v-spacer>

      <Searchbar></Searchbar>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
      <v-navigation-drawer
        v-if="this.$route.path!=='/print'"
        :mini-variant="mini"
        v-model="drawer"
        absolute
        stateless
        width="250"
      >
        <div @mouseover="mini=false" @mouseout="mini=true" absolute>
          <v-list class="pa-1">
            <v-list-tile avatar tag="div">
              <v-list-tile-avatar>
                <img src="https://pngimage.net/wp-content/uploads/2018/06/minimart-png-6.png" />
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>BIM TECH</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-dialog v-model="dialogBackup" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Backup</span>
                      <v-spacer></v-spacer>
                      <v-btn @click="refresh" :loading="refreshing" :disabled="refreshing" flat>
                        <v-icon>refresh</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-container class="py-0" row wrap>
                        <v-flex v-for="(i,index) in listBackup" :key="index" lg12>
                          <v-layout row wrap>
                            <p>{{i.name}}</p>
                            <v-spacer></v-spacer>
                            <v-icon @click="restoreBackup(i)">restore</v-icon>
                            <v-icon @click="deleteBackup(i)">delete</v-icon>
                          </v-layout>
                        </v-flex>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="darken-1" flat @click="dialogBackup=false">Done</v-btn>
                      <v-btn
                        color="darken-1"
                        :loading="refreshing"
                        :disabled="refreshing"
                        flat
                        @click="backup"
                      >
                        <v-icon class="mr-2">backup</v-icon>Backup
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
                          <v-flex xs12 sm6 md4>
                            <v-btn @click="dialog=false;dialogBackup=true;">Backup data</v-btn>
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
            <v-divider></v-divider>
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
import { storage } from "./firebase";
import { mapMutations, mapState } from "vuex";
import Searchbar from "./components/searchbar";
import { ipcRenderer } from "electron";
let Storage = require("electron-json-storage");
const storageRef = storage.ref().child("Backup");
export default {
  name: "App",
  components: {
    Searchbar
  },
  data() {
    return {
      SearchField: "",
      drawer: true,
      directoryPath: Storage.getDataPath(),
      items: [
        { title: "Home", icon: "shopping_cart", path: "/" },
        { title: "Stock", icon: "table_chart", path: "/stock" },
        { title: "Customers", icon: "supervisor_account", path: "/customers" },
        { title: "Report", icon: "timeline", path: "/report" },
        { title: "Summary Sale", icon: "attach_money", path: "/sum_sale" },
        {
          title: "Profit Sale",
          icon: "assignment_returned",
          path: "/profit_sale"
        },
        { title: "Open Ticket", icon: "receipt", path: "/openTicket" },
        { title: "About", icon: "question_answer", path: "/about" }
      ],
      mini: true,
      right: null,
      listBackup: ["asdasd", "asdasds"],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      dialog: false,
      refreshing: false,
      dialogBackup: false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogBackup(val) {
      val && this.refresh();
    }
  },
  computed: {
    // JSONInformation:{},
    ...mapState(["JSONInformation"])
  },
  created() {
    this.initialize();
    ipcRenderer.on("toPrint", async event => {
      this.$router.push({ path: "/print" });
    });
    ipcRenderer.send("toPrint");
  },
  methods: {
    ...mapMutations(["initialize", "UpdateInformation"]),
    deleteBackup(ref) {
      confirm("Are you sure you want to delete this backup?") &&
        this.deleting(ref);
    },
    restoreBackup(ref) {
      confirm("Are you sure you want to restore from this backup?") &&
        this.restoring(ref);
    },

    restoring(ref) {
      const toStream = require("blob-to-stream");
      const fs = require("fs");
      this.refreshing = true;
      ref
        .listAll()
        .then(res => {
          res.items.forEach(itemRef => {
            itemRef.getDownloadURL().then(url => {
              var xhr = new XMLHttpRequest();
              xhr.responseType = "blob";
              xhr.onload = event => {
                var blob = xhr.response;
                var writeStream = fs.createWriteStream(
                  `${this.directoryPath}/${itemRef.name}`
                );
                writeStream.on("error", function(err) {
                  console.log(err);
                });
                toStream(blob).pipe(writeStream);
              };
              xhr.open("GET", url);
              xhr.send();
            });
          });
          this.refreshing = false;
        })
        .catch(error => {
          this.refreshing = false;
        });
      // location.reload();
    },
    deleting(ref) {
      alert("deleted");
    },
    backup() {
      this.refreshing = true;
      const path = require("path");
      const fs = require("fs");
      const streamToBlob = require("stream-to-blob");
      fs.readdir(path.join(this.directoryPath), async (err, items) => {
        if (err) {
          console.log(err);
        }
        await items.forEach(async (item, index) => {
          const stream = fs.createReadStream(`${this.directoryPath}/${item}`);
          const blob = await streamToBlob(stream);
          await storageRef
            .child(`${new Date().toDateString()}/${item}`)
            .put(blob)
            .then(snapshot => {
              if (index == items.length - 1) {
                this.refresh();
              }
            })
            .catch(err => {
              console.log(err);
            });
        });
      });
    },
    refresh() {
      this.refreshing = true;
      this.listBackup = [];

      // Find all the prefixes and items.
      storageRef
        .listAll()
        .then(res => {
          res.prefixes.forEach(folderRef => {
            this.listBackup.push(folderRef);
          });
          // res.items.forEach(itemRef => {});
          this.refreshing = false;
        })
        .catch(error => {
          this.listBackup.push(error);
          this.refreshing = false;
        });
    },
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
