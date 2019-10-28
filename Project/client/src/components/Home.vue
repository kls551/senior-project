<template>
  <b-container>
    <b-row>
      <b-col />
      <b-col align-self="center">
        <h3 style="color: gray;">WELCOME {{ login }}</h3>
      </b-col>
      <b-col />
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      login: localStorage.getItem("username").toUpperCase()
    };
  }
};
</script>
