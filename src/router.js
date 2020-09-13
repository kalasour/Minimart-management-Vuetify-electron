import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
    },
    {
      path: "/stock",
      name: "stock",
      component: () => import("./components/Stock.vue"),
    },
    {
      path: "/customers",
      name: "Customers",
      component: () => import("./components/Customers.vue"),
    },
    {
      path: "/report",
      name: "Report",
      component: () => import("./components/Report.vue"),
    },
    {
      path: "/order_list",
      name: "OrderList",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/order",
      name: "order",
      component: () => import("./views/Order.vue"),
    },
    {
      path: "/reportTicket",
      name: "ReportTicket",
      component: () => import("./components/ReportTicket.vue"),
    },
    {
      path: "/sum_sale",
      name: "SumSale",
      component: () => import("./components/SumSale.vue"),
    },
    {
      path: "/sum_ticket",
      name: "SumTicket",
      component: () => import("./components/SumTicket.vue"),
    },
    {
      path: "/profit_sale",
      name: "ProfitSale",
      component: () => import("./components/ProfitSale.vue"),
    },
    {
      path: "/print",
      name: "print",
      component: () => import("./components/Print.vue"),
    },
    {
      path: "/openTicket",
      name: "openTicket",
      component: () => import("./views/OpenTicket.vue"),
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
