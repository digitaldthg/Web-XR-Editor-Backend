<template>
  <nav class="main-nav">
    <template
      v-if="this.$store.state.loggedIn && this.$store.state.user != null"
    >
      <div class="user-main">
        <router-link to="/Home"
          ><AccountIcon />{{ this.$store.state.user.username }}</router-link
        >
      </div>
      <template
        v-if="$store.state.currentProjekt != null && $route.name == 'Editor'"
      >
        <TextField
          class="width-6 align-center"
          htmlTag="h1"
          :object="$store.state.currentProjekt"
          :path="'projekts.Name'"
        />
      </template>
    </template>
    <div class="user-action">
      <template v-if="this.$store.state.loggedIn">
        <router-link @click.native="Logout" to="/Login" title="Logout"
          ><LogoutIcon
        /></router-link>
      </template>

      <template
        v-if="
          !this.$store.state.loggedIn &&
            this.$router.currentRoute.name != 'Login'
        "
      >
        <router-link to="/Login">Login</router-link>
      </template>
    </div>
  </nav>
</template>

<script>
import LogoutIcon from "../Images/Icons/logout.svg";
import AccountIcon from "../Images/Icons/account.svg";
import TextField from "./TextField.vue";
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";

export default {
  name: "Navigation",
  mixins: [DataBehaviourMixin],
  components: {
    LogoutIcon,
    AccountIcon,
    TextField,
  },
  data() {
    return {
      name: this.$store.state.currentProjekt?.Name,
    };
  },
  methods: {
    Logout() {
      this.$store.commit("Logout");
    },
    HandleValueChange(e) {
      this.SetValue({
        object: this.$store.state.currentProjekt,
        path: "projekts.Name",
        value: e.target.value,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.user-main,
.user-action {
  padding: 0.5rem;

  border-radius: 10px;
  background: #fff;

  svg {
    vertical-align: middle;
  }
}
.user-action {
  margin-right: 0.25rem;
}
.user-main {
  margin-left: 0.25rem;
  svg {
    margin-right: 0.5rem;
  }
}
</style>
