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
          v-for="(slide, index) in container.Slides"
          :index="index"
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

//@group UI
// Stellt alle verfügbaren Slides innerhalb eines SlideContainers dar und kann einen weiteren hinzufügen oder auch löschen.
export default {
  name: "SlideOverview",
  mixins: [IOMixin],
  components: {
    SlidePreview,
  },
  methods: {
    DeleteSlide(slide) {
      this.Delete(config.CMS_BASE_URL + "/slides/" + slide.id).then((res) =>
        this.Get(
          config.CMS_BASE_URL + "/projekts/" + this.$route.params.id
        ).then((response) => this.$store.commit("SetProjekt", response.data))
      );
    },
    AddSlide(container) {
      this.Post(
        config.CMS_BASE_URL +
          "/projekts-add-slide/" +
          this.$store.state.currentProjekt.id +
          "/" +
          container.id
      ).then((response) => {
        this.$store.commit("SetProjekt", response.data);
      });
    },
    AddContainer() {
      this.$store.state.currentProjekt.AddContainer();
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
