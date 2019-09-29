<template>
  <div>
    <!-- <md-toolbar class="md-accent" md-elevation="1">
      <h3 class="md-title" style="flex: 1">Users</h3>
      <md-button v-bind:to="{ name: 'Items' }" class="md-primary">Items</md-button>
    </md-toolbar>-->
    <b-table head-variant="dark" class="table-wrap" striped hover :items="users" :fields="fields"></b-table>

    <!-- <div class="users">
      <div v-if="users.length > 0" class="table-wrap">
        <div>
          <router-link v-bind:to="{ name: 'adduser' }" class>Add User</router-link>
        </div>
        <table>
          <tr>
            <td>Name</td>
            <td>Password</td>
            <td>Admin</td>
            <td width="100" align="center">Action</td>
          </tr>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.password }}</td>
            <td>{{ user.admin }}</td>

            <td align="center">
              <router-link v-bind:to="{ name: 'edititem', params: { id: user._id } }">Edit</router-link>|
              <a href="#" @click="deleteItem(user._id)">Delete</a>
            </td>
          </tr>
        </table>
      </div>
      <div v-else>
        There are no users.. Lets add one now
        <br />
        <br />
        <router-link v-bind:to="{ name: 'adduser' }" class="add_item_link">Add User</router-link>
      </div>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
import services from "@/services/services";
export default {
  name: "users",
  data() {
    return {
      fields: [{key: 'name', sortable: true}, 'password', 'admin'],
      users: []
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const response = await services.fetchUsers();
      this.users = response.data.users;
      console.log(this.users);
    },
    async deleteItem(id) {
      const $this = this;
      $this
        .$swal({
          name: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(function() {
          services.deleteUser(id);
          $this.$router.go({
            path: "/"
          });
        });
    }
  }
};
</script>
<style type="text/css">
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
}
</style>
