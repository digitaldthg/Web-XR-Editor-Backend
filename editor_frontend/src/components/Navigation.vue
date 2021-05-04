<template>
  <nav class="main-nav">
    <template v-if="this.$store.state.loggedIn && this.$store.state.user != null">
      <div class="user-main">
        <router-link to="/Home"><AccountIcon />{{this.$store.state.user.username}}</router-link>
      </div>
    </template>
    <div class="user-action">      
      <template v-if="this.$store.state.loggedIn">
        <router-link @click.native="Logout" to="/Login" title="Logout"><LogoutIcon/></router-link>
      </template>

      <template v-if="!this.$store.state.loggedIn && this.$router.currentRoute.name != 'Login'">
        <router-link to="/Login">Login</router-link>
      </template>
    </div>
  </nav>

</template>

<script>
import LogoutIcon from '../Images/Icons/logout.svg';
import AccountIcon from '../Images/Icons/account.svg';

export default {
  name : "Navigation",
  components:{
    LogoutIcon,
    AccountIcon
  },
  methods:{
    Logout(){
      this.$store.commit("Logout");
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-main,.user-action{
    padding: .5rem;
    
    border-radius: 10px;
   // box-shadow: 0 0 0 1px rgba(0, 0 ,0 , .2);
    background: #fff;

    svg{
      vertical-align:middle;
    }
  }
  .user-action{
    margin-right: .25rem;
  }
  .user-main{
    margin-left: .25rem;
    svg{
      margin-right:.5rem;
    }
  }
</style>