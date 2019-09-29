<template>
  <div>
    <b-table :items="orders" :fields="fields" striped>
      <template slot="show_details" slot-scope="row">
        <b-button
          size="sm"
          @click="row.toggleDetails"
          class="mr-2"
        >{{ row.detailsShowing ? 'Hide' : 'Show'}} Details</b-button>

        <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
        <!-- <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
          Details via check
        </b-form-checkbox>-->
      </template>

      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Items:</b>
            </b-col>
            <b-col>{{ row.item.items.name }}</b-col>
            <b-col sm="3" class="text-sm-right">
              <b>Items:</b>
            </b-col>
            <b-col>{{ row.item.items.name }}</b-col>
          </b-row>

          <!-- <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Is Active:</b></b-col>
            <b-col>{{ row.item.isActive }}</b-col>
          </b-row>-->

          <!-- <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button> -->
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
import services from '@/services/services'
export default {
  data () {
    return {
      fields: ['orderDate', 'totalAmount', 'show_details'],
      items: [],
      orders: [
        { isActive: true, age: 40, orderDate: '2/20/2019', totalAmount: 200 },
        { isActive: false, age: 21, orderDate: '2/2/2019', totalAmount: 100 },
        {
          isActive: false,
          age: 89,
          orderDate: '8/18/2010',
          totalAmount: 30
        },
        { isActive: true, age: 38, orderDate: '2/3/2010', totalAmount: 60 }
      ]
    }
  },
  mounted () {
    this.getItems()
  },
  methods: {
    async getItems () {
      const response = await services.fetchItems()
      this.items = response.data.items
      this.orders.map(order => {
        order.items = response.data.items[0]
        return order
      })
      console.log(this.orders)
    }
  }
}
</script>
