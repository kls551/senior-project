<template>
  <div style="margin-top: 100px;">
    <b-container>
      <b-row>
        <b-col />
        <b-col>
          <b-form @reset="getUser" v-if="user">
            <b-form-group
              id="input-group-1"
              label="Email address:"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="user.email"
                type="email"
                required
                placeholder="Enter email"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Name:" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="user.name"
                required
                placeholder="Enter name"
              ></b-form-input>
            </b-form-group>

            <div v-if="!userProps">
              <b-form-group
                id="input-group-3"
                label="Old Password:"
                label-for="input-3"
              >
                <b-form-input
                  id="input-3"
                  v-model="user.oldPassword"
                  type="password"
                  placeholder="Enter Old Password"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-4"
                label="New Password:"
                label-for="input-4"
              >
                <b-form-input
                  id="input-4"
                  v-model="user.password"
                  type="password"
                  placeholder="Enter New Password"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-6"
                label="Confirm Password:"
                label-for="input-6"
              >
                <b-form-input
                  id="input-6"
                  v-model="user.conPassword"
                  type="password"
                  placeholder="Re-enter New Password"
                ></b-form-input>
              </b-form-group>
            </div>

            <b-form-group v-if="admin">
              <b-form-radio
                v-model="user.admin"
                name="admin-radio"
                :value="true"
              >
                Admin
              </b-form-radio>
              <b-form-radio
                v-model="user.admin"
                name="admin-radio"
                :value="false"
              >
                Not admin
              </b-form-radio>
            </b-form-group>

            <b-button @click="updateUser" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </b-col>
        <b-col />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import services from "@/services/services";

export default {
  props: ["userProps"],
  data() {
    return {
      user: null,
      admin: JSON.parse(localStorage.getItem("admin"))
    };
  },
  async mounted() {
    await this.getUser();
  },
  methods: {
    async updateUser() {
      let res = await services.updateUser(this.user);
      if (res.data.success) {
        this.$swal("Updated", "", "success");
        if (!this.userProps) {
          localStorage.setItem("admin", res.data.user.admin);
          localStorage.setItem("username", res.data.user.name);
        }
      }
    },
    async getUser() {
      let user;
      if (!this.userProps) {
        user = await services.getUser({
          username: localStorage.getItem("username")
        });
      } else {
        user = await services.getUser({
          username: this.userProps.name
        });
      }
      this.user = user.data;
    }
  }
};
</script>
