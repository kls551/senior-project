// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import { router } from "./router";
import BootstrapVue from "bootstrap-vue";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import VueGraph from "vue-graph";

import {
  faPlusCircle,
  faShoppingBasket,
  faPortrait
} from "@fortawesome/free-solid-svg-icons";

library.add([faPlusCircle, faShoppingBasket, faPortrait]);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue);
Vue.use(VueGraph);
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
