import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './Pages/Login';
import Userprofile from './Pages/Userprofile';
import Projekt from './Pages/Projekt'

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
      path: '/Userprofile',
      name: "Userprofil",
      component: Userprofile
    },
    { 
      path: '/Projekt/:id',
      name: "Projekt",
      component: Projekt
    },


    // /*{ 
    //   path: '/', 
    //   redirect: { 
    //     name: 'Idle' 
    //   }
    // }*/
  ]
})

export default router