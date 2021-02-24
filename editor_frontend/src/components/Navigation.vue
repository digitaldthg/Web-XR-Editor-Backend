<template>
  <nav>
    <template v-if="this.$store.state.loggedIn">
      <div class="user-main">
        {{this.$store.state.user.username}}
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

<style scoped>
nav{
  width: 100%;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 0 0.5rem 0 rgba(0,0,0,.2);
  display: flex;
  justify-content: space-between;
}
</style>