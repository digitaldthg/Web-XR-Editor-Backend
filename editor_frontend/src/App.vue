<template>
  <div id="app" :class="'template-' + this.$route.name">
    <Navigation />
    <div class="main-app">
      <router-view class="router-view"></router-view>
    </div>
  </div>
</template>

<script>
import IOMixin from "./Controller/IOMixin";
import AuthMixin from "./Controller/AuthMixin";

import Navigation from "./Components/Navigation";
// Main Entry Point
// Checkt beim Laden ob die Userin eingeloggt ist und leitet sie ggf auf die Login Seite um
export default {
  name: "App",
  mixins: [IOMixin, AuthMixin],
  components: {
    Navigation,
  },
  mounted() {
    this.CheckForLogin();
  },
  data() {
    return {
      currentText: "1",
    };
  }
};
</script>

<style>
.router-view {
  width: 100%;
  height: 100%;
}
</style>
