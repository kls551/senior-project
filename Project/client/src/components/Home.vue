<template>
  <b-container fluid>
    <b-row>
      <b-col />
      <b-col align-self="center" v-if="token">
        <h3 style="color: gray;">WELCOME {{ login }}</h3>
      </b-col>
      <b-col align-self="center" v-if="!token">
        <h3 style="color: gray;">INVENTORY MANAGEMENT</h3>
        <p>
          Hi, my name is Kyaw Soe, and this is an inventory management system
          developed for a small business.
        </p>
        <p>
          This is my Senior Project in Cal Poly, San Luis Obispo. Special thanks
          to Professor Alexander Dekhtyar for acting as the sole advisor for
          this project.
        </p>
        <p>
          Technologies Used:
        </p>
        <p>Front End: VueJS, Boostrap Vue, ChartJs, Vue ChartJs</p>
        <p>Back End: NodeJS, MongoDb</p>
      </b-col>
      <b-col />
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      login: localStorage.getItem("username").toUpperCase(),
      token: localStorage.getItem("jwtToken")
    };
  }
};
</script>
