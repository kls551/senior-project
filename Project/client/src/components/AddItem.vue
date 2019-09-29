<template>
  <div class="items">
    <h1>Add Item</h1>
    <div class="form">
      <div>
        <input type="text" name="name" placeholder="NAME" v-model="name" />
      </div>
      <div>
        <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
      </div>
      <div>
        <input type="text" name="brand" placeholder="BRAND" v-model="brand" />
      </div>
      <div>
        <input type="number" name="weight" placeholder="WEIGHT" v-model="weight" />
      </div>
      <div>
        <input type="text" name="type" placeholder="TYPE" v-model="type" />
      </div>
      <div>
        <input type="number" name="price" placeholder="PRICE" v-model="price" />
      </div>
      <div>
        <input type="number" name="quantity" placeholder="QUANTITY" v-model="quantity" />
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
      description: '',
      brand: '',
      weight: '',
      type: '',
      price: '',
      quantity: ''
    }
  },
  methods: {
    cancel () {
      this.$router.push({ name: 'Items' })
    },
    async addItem () {
      await services.addItem({
        name: this.name,
        description: this.description,
        brand: this.brand,
        weight: this.weight,
        type: this.type,
        price: this.price,
        busQuantity: this.busQuantity,
        quantity: this.quantity
      })
      this.$swal('Great!', `Your item has been added!`, 'success')
      this.$router.push({ name: 'Items' })
    }
  }
}
</script>

<style type="text/css">
</style>
