<template>
  <nav class="main-nav">
    <template v-if="this.$store.state.loggedIn && this.$store.state.user != null">
      <div class="user-main">
        <router-link to="/Home">{{this.$store.state.user.username}}</router-link>
      </div>
    </template>
    <div class="user-action">      
      <template v-if="this.$store.state.loggedIn">
        <router-link @click.native="Logout" to="/Login">Logout</router-link>
      </template>

      <template v-if="!this.$store.state.loggedIn && this.$router.currentRoute.name != 'Login'">
        <router-link to="/Login">Login</router-link>
      </template>
    </div>
  </nav>

</template>

<script>
export default {
  name : "Navigation",
  methods:{
    Logout(){
      this.$store.commit("Logout");
    }
  }
}
</script>
