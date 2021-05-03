<template>
  <div id="app" :class="'template-'+ this.$route.name">
    <Navigation/>

    <div class="main-app">
      <router-view class="router-view"></router-view>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import Utils from './Common/Utils';
import IOMixin from './Controller/IOMixin';
import config from '../../main.config';
import Navigation from './Components/Navigation';


export default {
  name: 'App',
  mixins : [IOMixin],
  components: {
    Navigation
  },
  mounted(){

    this.CheckForLogin();


    

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

.router-view {
  width: 100%;
  height: 100%;
}
</style>
