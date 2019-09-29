<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error">
          <b-alert show>{{error.message}}</b-alert>
        </div>
      </div>
      <b-form @submit="onSubmit">
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          :label-cols="4"
          breakpoint="md"
          label="Enter Username"
        >
          <b-form-input id="username" v-model.trim="login.username"></b-form-input>
        </b-form-group>
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          :label-cols="4"
          breakpoint="md"
          label="Enter Password"
        >
          <b-form-input type="password" id="password" v-model.trim="login.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Login</b-button>
        <b-button type="button" variant="success" @click.stop="register()">Register</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      login: {},
      errors: []
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      axios
        .post(`http://localhost:8081/login/`, this.login)
        .then(response => {
          localStorage.setItem("jwtToken", response.data.token);
          this.$router.push({
            name: "users"
          });
        })
        .catch(e => {
          console.log(e);
          this.errors.push(e);
        });
    },
    register() {
      this.$router.push({
        name: "Register"
      });
    }
  }
};
</script>


<style>
form {
  margin-top: 100px;
}
</style>
