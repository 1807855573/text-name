import Vue from 'vue'
import Router from 'vue-router'

import routes from './routes';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

let url = ["/music"]

router.beforeEach((to,from,next)=>{
    if(url.includes(to.path)){
      let token = localStorage.getItem("token")
      if(token){
        next()
      }else{
        next("/login")
      }
    }else{
      next()
    }
})

export default router