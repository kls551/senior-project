import Vue from 'vue'
import Router from 'vue-router'
import Items from '@/components/Items'
import additem from '@/components/AddItem'
import edititem from '@/components/EditItem'
import adduser from '@/components/AddUser'
import VueMaterial from 'vue-material'
import Users from '@/components/users'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Order from '@/components/Order'

Vue.use(Router)
Vue.use(VueMaterial)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Items',
      component: Items
    },
    {
      path: '/items/add',
      component: additem,
      name: 'additem'
    },
    {
      path: '/items/:id/edit',
      component: edititem,
      name: 'edititem'
    },
    {
      path: '/users/add',
      component: adduser,
      name: 'adduser'
    },
    {
      path: '/users',
      component: Users,
      name: 'users'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    }
  ]
})
