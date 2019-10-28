<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error">
          <b-alert show>{{ error.message }}</b-alert>
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
          <b-form-input id="username" v-model.trim="login.username" />
        </b-form-group>
        <b-form-group
          id="fieldsetHorizontal"
          horizontal
          :label-cols="4"
          breakpoint="md"
          label="Enter Password"
        >
          <b-form-input type="password" v-model.trim="login.password" />
        </b-form-group>
        <b-button type="submit" variant="primary">Login</b-button>
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
    async onSubmit(evt) {
      evt.preventDefault();

      try {
        let response = await axios.post(
          "http://localhost:8081/login",
          this.login
        );
        if (response.data.success === true) {
          localStorage.setItem("jwtToken", response.data.token);
          localStorage.setItem("admin", response.data.admin);
          localStorage.setItem("username", response.data.name);
          this.$router.push({
            name: "users"
          });
        }
      } catch (e) {
        this.$swal("Error Logging in", e.toString(), "error");
        this.errors.push(e);
      }
    }
  }
};
</script>


<style scoped>
form {
  margin-top: 100px;
}
</style>
