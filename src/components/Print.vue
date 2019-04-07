<template>
  <div class="about">
    <h1>Print this page</h1>
    <h1>{{this.List}}</h1>
  </div>
</template>
<script>
const ipcRenderer = require("electron").ipcRenderer;

export default {
  created() {
    ipcRenderer.on("printPDF", (event, List) => {
      //   document.body.innerHTML = content;
      this.List = List;
      ipcRenderer.send("readyToPrintPDF");
    });
  },
  data: () => ({
    List: []
  })
};
</script>