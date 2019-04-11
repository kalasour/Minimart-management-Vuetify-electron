import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/stock',
      name: 'stock',
      component: ()=>import('./components/Stock.vue')
    },{
      path: '/customers',
      name: 'Customers',
      component: ()=>import('./components/Customers.vue')
    },{
      path: '/report',
      name: 'Report',
      component: ()=>import('./components/Report.vue')
    },{
      path: '/print',
      name: 'print',
      component: ()=>import('./components/Print.vue')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
