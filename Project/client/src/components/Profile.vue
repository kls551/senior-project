<template>
  <div style="margin-top: 100px;">
    <b-container>
      <b-row>
        <b-col />
        <b-col>
          <b-form @submit="submit" @reset="getUser" v-if="user">
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

            <b-button type="submit" variant="primary">Submit</b-button>
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
  data() {
    return {
      user: null,
      admin: JSON.parse(localStorage.getItem("admin"))
    };
  },
  async mounted() {
    await this.getUser();
    console.log(this.user);
  },
  methods: {
    async submit() {
      console.log(this.user);
    },
    async getUser() {
      let user = await services.getUser({
        username: localStorage.getItem("username")
      });
      this.user = user.data;
    }
  }
};
</script>
