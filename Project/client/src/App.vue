<template>
  <div id="app">
    <md-toolbar class="md-primary" md-elevation="1">
      <md-button v-bind:to="{ name: 'users' }" class="md-primary">Users</md-button>
      <md-button v-bind:to="{ name: 'Items' }" class="md-primary">Items</md-button>
      <md-button v-bind:to="{ name: 'Login' }" class="md-primary">Login</md-button>
      <md-button v-bind:to="{ name: 'Order' }" class="md-primary">Order</md-button>
      <div class="md-toolbar-section-end">
        <md-button @click="logout()" class="md-primary">Logout</md-button>
      </div>
    </md-toolbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    logout () {
      localStorage.removeItem('jwtToken')
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
