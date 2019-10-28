<template>
  <div>
    <div class="table-wrap button">
      <b-button v-b-modal.modal-1 pill variant="primary">Add User</b-button>
    </div>

    <b-modal id="modal-1" title="Add User">
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-1" label="Email address:">
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            required
            placeholder="Enter name"
          />
        </b-form-group>

        <b-form-group id="input-group-3" label="Password:" label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-radio v-model="form.admin" name="some-radios" value="true">
            is admin
          </b-form-radio>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-modal>

    <b-table
      head-variant="dark"
      class="table-wrap"
      striped
      hover
      :items="users"
      :fields="fields"
    />

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
    </div>-->
  </div>
</template>

<script>
/* eslint-disable */
import services from "@/services/services";
import axios from "axios";
export default {
  name: "users",
  data() {
    return {
      fields: [
        { key: "name", sortable: true },
        { key: "email", sortable: true },
        { key: "admin", sortable: true }
      ],
      users: [],
      form: {
        email: "",
        name: "",
        password: "",
        admin: false
      }
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      console.log(JSON.stringify(this.form));
      try {
        let result = await services.addUser(this.form);
        if (result.status === 200) {
          this.$swal("Great!", `A user has been added!`, "success");
          this.getUsers();
        }
      } catch (error) {
        this.$swal("Error!", error.response.data, "error");
      }
    },
    async getUsers() {
      const response = await services.fetchUsers();
      this.users = response.data.users;
      console.log(this.users);
      this.users.forEach(element => {
        element.delete = this.deleteItem;
      });
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
<style type="text/css" scoped>
.table-wrap {
  width: 60%;
  margin: 0 auto;
  margin-top: 20px;
}
.button {
  align-items: left;
}
</style>
