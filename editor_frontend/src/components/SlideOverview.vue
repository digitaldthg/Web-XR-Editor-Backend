<template>
  <div class="slide-overview" v-if="this.$store.state.currentProjekt != null">
    Slides Overview
    <div
      class="container"
      v-for="container in this.$store.state.currentProjekt.slidecontainers"
      v-bind:key="container.id"
    >
      Container: {{ container.Name }} 
      <div class="slide-container">
        <SlidePreview
          v-for="slide in container.Slides"
          v-bind:key="slide.id"
          :slide="slide"
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
import SlidePreview from "../components/SlidePreview";
export default {
  name: "SlideOverview",
  mixins: [IOMixin],
  components: {
    SlidePreview,
  },
  methods: {
    AddSlide(container) {
      this.Post(
        config.CMS_BASE_URL + "/slides"
      ).then((response) => {
        console.log("SLIDE:" , response.data);
        this.$store.state.currentProjekt.AddSlide(container,response.data);
      });
    },
    AddContainer() {
      this.Post(
        config.CMS_BASE_URL + "/slide-containers"
      ).then((response) => {
        console.log("SLIDECONTAINER:" , response.data);
        this.$store.state.currentProjekt.AddContainer(response.data);
      });
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


