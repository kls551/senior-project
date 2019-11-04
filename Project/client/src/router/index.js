import Vue from "vue";
import Router from "vue-router";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import Users from "@/components/Users";
import Items from "@/components/Items";
import AddItem from "@/components/AddItem";
import Login from "@/components/Login";
import Order from "@/components/Order";
import SingleItem from "@/components/SingleItem";
import Cart from "@/components/Cart";
import Home from "@/components/Home";
import Profile from "@/components/Profile";
import OrderAgg from "@/components/OrderAgg";

Vue.use(Router);
Vue.use(VueMaterial);

export const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      props: true
    },
    {
      path: "/items",
      name: "items",
      component: Items
    },
    {
      path: "/items/add",
      component: AddItem,
      name: "additem"
    },
    {
      path: "/users",
      component: Users,
      name: "users"
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/order",
      name: "order",
      component: Order
    },
    {
      path: "/item",
      name: "singleItem",
      component: SingleItem,
      props: true
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart
    },
    {
      path: "/order/aggregate",
      name: "orderAgg",
      component: OrderAgg,
      props: true
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login") {
    if (localStorage.getItem("jwtToken")) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
