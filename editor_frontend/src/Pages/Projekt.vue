<template>
  <div v-if="this.$store.state.currentProjekt != null">
   Projektname: {{this.$store.state.currentProjekt.Name}}
   <SlideOverview/>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import SlideOverview from "../components/SlideOverview"
export default {
  name: "Projekt",
  mixins: [IOMixin],
  components:{
      SlideOverview
  },
  mounted() {
    this.Get(config.CMS_BASE_URL + "/projekts/"+this.$route.params.id ).then((response) => {
      console.log("PROJEKT:" +response.data);
      this.$store.commit("SetProjekt", response.data);
    });
  },
};
</script>
