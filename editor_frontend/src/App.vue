<template>
  <main id="app">
    <Navigation/>
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>

import axios from 'axios';
import Utils from './Common/Utils';
import IOMixin from './Controller/IOMixin';
import config from '../../main.config';
import Navigation from './components/Navigation.vue';


export default {
  name: 'App',
  mixins : [IOMixin],
  components: {
    Navigation
  },
  mounted(){

    this.CheckForLogin()

  },
  data(){
    return {
      currentText : "1"
    }
  },
  methods:{
    CheckForLogin(){
      const jwtCookie = Utils.GetCookie("jwt");
      if(
          (jwtCookie == null) &&
          this.$router.currentRoute.name != "Login"
        ){
        this.GoToLogin()
      }else if(jwtCookie != null){
        console.log(jwtCookie, this.$store.state.jwt);
        this.$store.commit("SetJWT", jwtCookie );

        this.Get(config.CMS_BASE_URL + "/users/me").then((response)=>{
          this.$store.commit("SetUser" , response.data);
        });
      }else if(this.$router.currentRoute.name != "Login"){
        this.GoToLogin()
      }
    },
    GoToLogin(){
      this.$router.push({ 
        path: 'Login',
      });
    },    
    ChangeTextField ({ type, target }){
      this.currentText = target.value;
    },
   

  }
}
</script>

<style>
@import url("./scss/stylesheet.scss");


</style>
