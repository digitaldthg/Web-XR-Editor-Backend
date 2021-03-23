import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './Pages/Login';
import Userprofile from './Pages/Userprofile';
import Projekt from './Pages/Projekt'
import Editor from './Pages/Editor';

Vue.use(VueRouter)

const router = new VueRouter({
  mode:"history",
  routes: [
    { 
      path: '/Login',
      name: "Login",
      component: Login
    },
    { 
      path: '/Home',
      name: "Home",
      component: Userprofile
    },
    { 
      path: '/Projekt/:id',
      name: "Projekt",
      component: Projekt
    },
    { 
      path: '/Editor/:id',
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