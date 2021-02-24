import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './Pages/Login';
import Userprofile from './Pages/Userprofile';

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
      path: '/Projekte',
      name: "Userprofil",
      component: Userprofile
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