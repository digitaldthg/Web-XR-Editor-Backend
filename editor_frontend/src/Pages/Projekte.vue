<template>
  <div class="" v-if="this.$store.state.user != null">
    <header>
      <div class="wrapper">
        <h1>
          Hallo <span class="tag">{{ this.$store.state.user.username }}</span>
        </h1>


        <div class="role-info">
          <span class="tag">{{ this.$store.state.user.role.name }}</span>
          {{ this.$store.state.user.role.description }}
        </div>
      </div>
    </header>


    <div class="content-wrapper">
      <div class="wrapper">
        <h2>Projekte:</h2>

        <div class="content-block flex">
          
          <ProjektCard
            class="content width-4"
            v-for="projekt in projekts"
            v-bind:key="projekt.id"
            :projekt="projekt"
          />


          <div class="projekt">
            <div class="projekt-inner">

              <button class="cta-button" @click="NewProjekt">Neues Projekt</button>
            </div>
          </div>


          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import ProjektCard from '../Components/Projekt/ProjektCard.vue';

export default {
  components: { ProjektCard },
  name: "Projekte",
  mixins: [IOMixin],
  data() {
    return {
      projekts: null,
    };
  },
  mounted(){
    this.Init();
  },
  watch : {
    "$store.state.user" : function(){
      this.Init();
    }
  },
  methods: {
    Init(){
      console.log("store," , this.$store.state.user == null);

      if (this.$store.state.user == null) {
        return;
      }

      this.Get(config.CMS_BASE_URL + "/projekts").then((response) => {
        console.log(response.data);

        this.projekts = response.data;
      }).catch(error=> {
        console.log(error);
      });
    },
    GoToProjekt(projekt) {
      this.$router.push({
        path: "/Editor/" + projekt.id,
      });
    },
    DeleteEntry(entry) {
      console.log(entry.id);

      // this.Delete(config.CMS_BASE_URL + "/test-contents/" + entry.id)
      //   .then((response) => {
      //     console.log("delete", response.data);

      //     // get index of object with id:37
      //     this.content = this.content.filter(
      //       (item) => item.id != response.data.id
      //     );
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
    NewProjekt() {
      this.Post(config.CMS_BASE_URL + "/projekts", {
        Name: "Test Projekt",
        Description: "Per API kreiierter Beitrag",
      })
        .then((response) => {
          console.log(response);
          if (this.projekts.length > 0) {
            this.projekts.push(response.data);
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
header {
  padding: 2rem 0;
  background: #eee;
  margin-bottom: 2rem;
}
</style>