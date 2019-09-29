<template>
  <div class="items">
    <h1>Edit Item</h1>
    <div class="form">
      <div>
        <input type="text" name="name" placeholder="NAME" v-model="name" />
      </div>
      <div>
        <input type="text" name="brand" placeholder="BRAND" v-model="brand" />
      </div>
      <div>
        <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
      </div>
      <div>
        <button class="app_item_btn" @click="updateItem">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import services from '@/services/services'
export default {
  name: 'edititem',
  data () {
    return {
      name: '',
      description: '',
      brand: ''
    }
  },
  mounted () {
    this.getItem()
  },
  methods: {
    async getItem () {
      const response = await services.getItem({
        id: this.$route.params.id
      })
      this.name = response.data.name
      this.brand = response.data.brand
      this.description = response.data.description
      // this.$router.push({ name: 'Posts' })
    },
    async updateItem () {
      await services.updateItem({
        id: this.$route.params.id,
        name: this.name,
        description: this.description,
        brand: this.brand
      })
      this.$swal('Great!', `Your item has been updated!`, 'success')
      this.$router.push({ name: 'Items' })
    }
  }
}
</script>
<style type='text/css'>
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
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
