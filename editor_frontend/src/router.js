import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './Pages/Login';
import Projekte from './Pages/Projekte';
import Editor from './Pages/Editor.vue';
import vueConfig from '../vue.config';

Vue.use(VueRouter)

const router = new VueRouter({
  base: vueConfig.publicPath,
  mode:"hash",
  routes: [
    { 
      path: '/Login',
      name: "Login",
      component: Login
    },
    { 
      path: '/Home',
      name: "Home",
      component: Projekte
    },
    { 
      path: '/Editor/:id/:slideContainerIndex?/:slideIndex?',
      name: "Editor",
      component: Editor
    },


    { 
      path: '/', 
      redirect: { 
        name: 'Home' 
      }
    }
  ]
})

export default router