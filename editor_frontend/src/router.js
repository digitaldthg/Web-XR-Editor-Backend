import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './Pages/Login';
import Projekte from './Pages/Projekte';
import Editor from './Pages/Editor.vue';
import vueConfig from '../vue.config';
import Utils from './Common/Utils';

Vue.use(VueRouter)

const router = new VueRouter({
  base: vueConfig.publicPath,
  mode: "hash",
  routes: [
    {
      path: '/Login',
      name: "Login",
      component: Login
    }, {
      path: '/Home',
      name: "Home",
      component: Projekte
    }, {
      path: '/Editor/:id/:slideContainerIndex?/:slideIndex?',
      name: "Editor",
      component: Editor
    }, {
      path: '/',
      redirect: {
        name: 'Home'
      }
    }
  ]
});


export default router;


//Löst: Duplicate Routing zum selben Path
//Für mehr Info siehe: https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = router.push;
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }

  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err
    }

    return Promise.reject(err)
  })
}


