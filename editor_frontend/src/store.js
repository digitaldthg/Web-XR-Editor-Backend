import Vue from 'vue'
import Vuex from 'vuex'
import Utils from './Common/Utils';
import Project from './Controller/ProjectController';
import IOMixins from './Controller/IOMixin';

Vue.use(Vuex);

export const store = new Vuex.Store({
  mixins: {
    mutations: [IOMixins]
  },
  state: {
    jwt: null,
    user: null,
    loggedIn: false,
    currentProjekt: null,
    slideIndex: 0,
    slideContainerIndex: 0,
    xr: null,
    selectedMesh: null,
    tmp: {
      // projekt : {
      // 5:{
      //     name : "test"
      // }
      // }
    }
  },
  mutations: {
    Logout(state, data) {
      Utils.DeleteCookie("jwt");
      state.loggedIn = false;
      state.jwt = null;
      state.user = null;
    },
    UserAuth(state, data) {

      console.log("store", data);
      var stateCopy = Object.assign({}, state);

      state.jwt = data.jwt;
      state.user = data.user;
      state.loggedIn = true;
      Utils.SetCookie("jwt", data.jwt, 1);
    },
    SetJWT(state, jwt) {
      state.jwt = jwt;
      state.loggedIn = true;
      Utils.SetCookie("jwt", jwt, 1);
    },
    SetUser(state, user) {
      state.user = user;
    },
    SetProjekt(state, projectData) {
      if (projectData == null) {
        state.currentProjekt = null;
        return;
      }
      var projekt = new Project(projectData);
      state.currentProjekt = projekt;

    },
    ApplyXR(state, xr) {
      state.xr = xr;
    },
    SetTmp(state, tmp) {
      state.tmp = tmp;
    },
    SetSlideIndex(state, index) {
      state.slideIndex = index;
    },
    SetSlideContainerIndex(state, index) {
      state.slideContainerIndex = index;
    },
    SetSelection(state, mesh) {
      state.selectedMesh = mesh
    }
  }
})
