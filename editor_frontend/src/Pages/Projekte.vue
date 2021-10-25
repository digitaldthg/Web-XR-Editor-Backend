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

        <div class="content-block flex flex-wrap">
          
          <ProjektCard
            class="content width-4"
            v-for="projekt in projekts"
            v-bind:key="projekt.id"
            :projekt="projekt"
            @deleteProjekt ="OnDelete"
          />


          <div class="projekt flex flex-center">
            

              <button class="cta-button" @click="NewProjekt">+</button>
            
          </div>


          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import ProjektCard from '../Components/Projekt/ProjektCard.vue';

//@group Page
// Übersicht sämtlicher Projekte einer Userin
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
      
      if (this.$store.state.user == null) {
        return;
      }

      // Holt alle Projekte des users
      this.Get(config.CMS_BASE_URL + "/projekts").then((response) => {
        this.projekts = response.data;
      }).catch(error=> {
        console.log(error);
      });
    },
    OnDelete(data){
      this.projekts = this.projekts.filter(p => p.id != data.id);
    },
    /**
     * Link zum Projekt
     */
    GoToProjekt(projekt) {
      this.$router.push({
        path: "/Editor/" + projekt.id,
      });
    },
    /**
     * Fügt ein neues Projekt hinzu
    */
    NewProjekt() {
      this.Post(config.CMS_BASE_URL + "/projekts")
        .then((response) => {
          console.log(response.data);
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