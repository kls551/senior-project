<template>
  <div>
    <div class="table-wrap button" v-if="isAdmin()">
      <b-button v-b-modal.modal-1 pill variant="primary">Add User</b-button>
    </div>

    <b-modal id="modal-1" title="Add User" @hidden="resetForm()">
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
      @row-clicked="showUser"
    >
      <template v-slot:cell(Delete)="data" v-if="isAdmin()">
        <b-button
          size="sm"
          pill
          variant="outline-danger"
          @click="deleteUser(data)"
        >
          Delete User
        </b-button>
      </template>
    </b-table>
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
    resetForm() {
      this.form = {
        email: "",
        name: "",
        password: "",
        admin: false
      };
    },
    isAdmin() {
      return localStorage.getItem("admin") === "true";
    },
    async deleteUser(row) {
      let res = await services.deleteUser(row.item._id);
      if (res.status === 200) {
        this.$swal("User deleted", "", "success");
        this.getUsers();

      } else {
        console.log(res);
        this.$swal("Error deleting", "", "error");
      }
    },
    showUser(user) {
      if (localStorage.getItem("admin") === 'true') {
        this.$router.push({
          name: "profile",
          path: `/profile/${user._id}`,
          params: { userProps: user }
        });
      }
    },
    async onSubmit(evt) {
      evt.preventDefault();
      try {
        let result = await services.addUser(this.form);
        if (result.status === 200) {
          this.$swal("Great!", `A user has been added!`, "success");
          this.$bvModal.hide("modal-1");
          this.getUsers();
        }
      } catch (error) {
        this.$swal("Error!", error.response.data, "error");
      }
      this.resetForm();

    },
    async getUsers() {
      const response = await services.fetchUsers();
      this.users = response.data.users;
      if (this.isAdmin()) {
        this.fields.push("Delete");
        this.users.forEach(element => {
          element.delete = this.deleteItem;
        });
      }
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
