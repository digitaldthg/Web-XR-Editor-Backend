<template>
  <form class="login-form">
    <h1>WebXR Login</h1>
    <template v-if="failed">
      <div class="warning">
        <h1>Ups! Etwas ist schiefgelaufen!</h1>
      </div>
    </template>
    <div class="row margin-bottom">
      <div class="row">
        <label for="username">Username</label>
        <input id="username" type="text" name="email" v-model="user.name" />
      </div>
      <div class="row">
        <label for="pw">Passwort</label>
        <input id="pw" type="password" name="passwort" v-model="user.pw" />
      </div>
    </div>
    <button class="cta-button" @click="Login">Login</button>
  </form>
</template>

<script>
import axios from "axios";
import config from "../../../main.config";

//@group Page
// LoginSeite
export default {
  name: "LoginPage",
  data() {
    return {
      failed: false,
      user: {
        name: "",
        pw: "",
      },
    };
  },
  mounted() {
    console.log("Login");
  },
  methods: {
    /**
     * Meldet den User anhand seines namens und passwords an
     */
    Login(e) {
      e.preventDefault(e);
      axios
        .post(config.CMS_BASE_URL + "/auth/local", {
          identifier: this.user.name,
          password: this.user.pw,
        })
        .then((response) => {
          this.$store.commit("UserAuth", response.data);

          this.$router.push({
            path: "Home",
          });
        })
        .catch((error) => {
          // Handle error.
          this.failed = true;
          console.log("An error occurred:", error.response);
        });
    },
  },
};
</script>

<style lang="scss">
.login-form {
  width: 300px;
  height: initial;
  padding: 1rem;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  display: inline-block;

  h1 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }
}

input {
  font-size: 1rem;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
