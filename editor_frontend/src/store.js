import Vue from 'vue'
import Vuex from 'vuex'
import Utils from './Common/Utils';
import Project from './Controller/ProjectController';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
      jwt: null,
      user : null,
      loggedIn : false,
      currentProjekt: null,
      tmp:{
        // projekt : {
        //   5:{
        //     name : "test"
        //   } 
        // }
      }
    },

    actions: {

    },

    mutations: {
      Logout(state,data){
        Utils.DeleteCookie("jwt");
        state.loggedIn = false;
        state.jwt = null;
        state.user = null;
      },
      UserAuth(state, data){

        console.log("store", data);

        state.jwt = data.jwt;
        state.user = data.user;
        
        Utils.SetCookie("jwt", data.jwt, 1);
      },
      SetJWT(state,jwt){
        state.jwt = jwt;
        state.loggedIn = true;
        Utils.SetCookie("jwt", jwt, 1);
      },
      SetUser(state,user){
        state.user = user;
      },
      SetProjekt(state,projectData){
        if(projectData == null){
          state.currentProjekt = null;
          return;
        }
        var project = new Project(projectData);
        state.currentProjekt = project;
      },
      SetTmp(state,tmp){
        state.tmp = tmp;
      }
      
    }

})