<template>
  <div class="items">
    <h1>Add Item</h1>
    <div class="form">
      <div>
        <input type="text" name="name" placeholder="NAME" v-model="name" />
      </div>
      <div>
        <input type="text" name="password" placeholder="PASSWORD" v-model="password" />
      </div>
      <div>
        <button class="app_item_btn" @click="addItem">Add</button>
        <button class="app_item_btn" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import services from '@/services/services'
export default {
  name: 'additem',
  data () {
    return {
      name: '',
      password: '',
      admin: false
    }
  },
  methods: {
    cancel () {
      this.$router.push({ name: 'Items' })
    },
    async addItem () {
      await services.addUser({
        name: this.name,
        password: this.password,
        admin: true
      })
      this.$swal('Great!', `A user has been added!`, 'success')
      this.$router.push({ name: 'users' })
    }
  }
}
</script>

<style type="text/css">
.form input,
.form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_item_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 260px;
  border: none;
  cursor: pointer;
}
</style>
