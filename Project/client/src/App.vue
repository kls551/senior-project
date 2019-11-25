<template>
  <div id="app">
    <md-toolbar md-elevation="1">
      <div v-if="isLogin()">
        <md-button :to="{ name: 'profile' }" v-if="isLogin()">
          <font-awesome-icon icon="portrait" size="2x" />
        </md-button>
        <md-button v-bind:to="{ name: 'users' }">Users</md-button>
        <md-button v-bind:to="{ name: 'items' }">Items</md-button>
        <md-button v-bind:to="{ name: 'order' }">Order</md-button>
      </div>
      <div class="md-toolbar-section-end">
        <md-button :to="{ name: 'cart' }" v-if="isLogin()">
          <font-awesome-icon icon="shopping-basket" size="2x" />
        </md-button>
        <md-button v-if="!isLogin()" v-bind:to="{ name: 'home' }">
          Home
        </md-button>
        <md-button v-if="!isLogin()" v-bind:to="{ name: 'login' }">
          Login
        </md-button>
        <md-button v-if="isLogin()" to @click="logout()">Logout</md-button>
      </div>
    </md-toolbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    isLogin() {
      if (localStorage.getItem("jwtToken")) {
        return true;
      }
      return false;
    },
    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("admin");
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style>
.icon {
  color: gray;
}
</style>
