<template>
  <div class="slide-overview" v-if="this.$store.state.currentProjekt != null">
    Slides Overview
    <div
      class="container"
      v-for="container in this.$store.state.currentProjekt.slide_containers"
      v-bind:key="container.id"
    >
      Container: {{ container.Name }} 
      <div class="slide-container">
        <SlidePreview
          v-for="slide in container.Slides"
          v-bind:key="slide.id"
          :slide="slide"
          :DeleteSlide="DeleteSlide"
        />
      </div>
      <button @click="AddSlide(container)">Neue Slide</button>
    </div>
    <button @click="AddContainer()">Neuer Container</button>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import SlidePreview from "../Components/SlidePreview";
export default {
  name: "SlideOverview",
  mixins: [IOMixin],
  components: {
    SlidePreview,
  },
  methods: {
    DeleteSlide(slide){
      
      this.Delete(config.CMS_BASE_URL + "/slides/" + slide.id).then( res => this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(response => this.$store.commit("SetProjekt", response.data) ) );
          
    },
    AddSlide(container) {


      this.Post(config.CMS_BASE_URL + "/projekts-add-slide/"+ this.$store.state.currentProjekt.id + "/" + container.id).then((response)=>{
        console.log("response" , response);
        this.$store.commit("SetProjekt", response.data);

      });

      // this.Post(
      //   config.CMS_BASE_URL + "/slides"
      // ).then((response) => {
      //   console.log("SLIDE:" , response.data);
      //   this.$store.state.currentProjekt.AddSlide(container,response.data);
      // });
    },
    AddContainer() {

      this.$store.state.currentProjekt.AddContainer();
      // this.Post(
      //   config.CMS_BASE_URL + "/slide-containers"
      // ).then((response) => {
      //   console.log("SLIDECONTAINER:" , response.data);
      //   this.$store.state.currentProjekt.AddContainer(response.data);
      // });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.slide-overview {
  background-color: tomato;
  width: 30%;
}
.container {
  width: 90%;
  background-color: grey;
}
.slide-container {
  width: 80%;
  background-color: white;
}
</style>


