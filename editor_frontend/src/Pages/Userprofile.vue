<template>
  <div class="" v-if="this.$store.state.user != null">
    <h1>
      Hallo <span class="tag">{{ this.$store.state.user.username }}</span>
    </h1>
    <div class="role-info">
      <span class="tag">{{ this.$store.state.user.role.name }}</span>
      {{ this.$store.state.user.role.description }}
    </div>
    <h2>Projekte:</h2>

    <div class="content-block">
      <div
        class="content"
        v-for="contentblock in content"
        v-bind:key="contentblock.id"
      >
        <div class="table">
          <div class="table-cell">Name: {{ contentblock.Name }}</div>
          <div class="table-cell">ID: {{ contentblock.id }}</div>
          <div class="table-cell">
            Beschreibung:
            <vue-markdown> {{ contentblock.Description }}</vue-markdown>
          </div>
          <div class="table-cell" v-if="contentblock.author != null">
            Autor:in: {{ contentblock.author.username }}
          </div>
          <!--<div class="table-cell">
            <button @click="DeleteEntry(contentblock)">x</button>
          </div>-->

          <div class="table-cell">
            <button @click="GoToProjekt(contentblock)">Projekt Öffnen</button>
          </div>
        </div>
      </div>
    </div>
    <button @click="NewProjekt">Neues Projekt</button>
  </div>
</template>
<script>
import axios from "axios";
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";

export default {
  name: "Userprofile",
  mixins: [IOMixin],
  data() {
    return {
      content: null,
    };
  },
  mounted() {
    if (this.$store.state.user == null) {
      return;
    }

    this.Get(config.CMS_BASE_URL + "/projekts").then((response) => {
      console.log(response.data);

      this.content = response.data;
    });
  },
  methods: {
    GoToProjekt(projekt) {
      this.$router.push({
        path: "/Projekt/" + projekt.id,
      });
    },
    DeleteEntry(entry) {
      console.log(entry.id);

      this.Delete(config.CMS_BASE_URL + "/test-contents/" + entry.id)
        .then((response) => {
          console.log("delete", response.data);

          // get index of object with id:37
          this.content = this.content.filter(
            (item) => item.id != response.data.id
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    NewProjekt() {
      this.Post(config.CMS_BASE_URL + "/projekts", {
        Name: "Test Projekt",
        Description: "Per API kreiierter Beitrag",
        Author: this.$store.state.user,
      })
        .then((response) => {
          console.log(response);
          if (this.content.length > 0) {
            this.content.push(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.content {
  margin: 20px;
}
</style>