<template>
  <div>
    <div style="text-align: center">
      <b-spinner
        style="display: inline-block"
        v-if="loading"
        variant="primary"
        type="grow"
        label="Spinning"
      ></b-spinner>
    </div>
    <b-table
      v-if="!loading"
      head-variant="dark"
      class="table-wrap"
      :items="orders"
      :fields="fields"
    >
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-table
          class="table-dark"
          :items="row.item.table"
          :fields="innerFields"
        />
      </template>
    </b-table>
  </div>
</template>

<script>
import services from "@/services/services";
export default {
  data() {
    return {
      fields: [
        { key: "seller.name", label: "Cashier", sortable: true },
        { key: "orderDate", sortable: true },
        { key: "orderTime", sortable: true },
        { key: "totalAmount", sortable: true },
        { key: "revenue", sortable: true },
        "show_details"
      ],
      items: [],
      orders: [],
      loading: false,
      innerFields: ["name", "type", "price", "quantity", "itemTotal"]
    };
  },
  mounted() {
    this.getItems();
  },
  methods: {
    processData(data) {
      data.forEach(order => {
        let orderDate = new Date(order.orderDate);
        order.orderDate = orderDate.toDateString();
        order.orderTime =
          orderDate.getHours().toString() +
          ":" +
          orderDate.getMinutes().toString();
        order.items.forEach(item => {
          let info = {
            name: item.item.name,
            type: item.item.attr[item.index].type,
            price: item.price,
            quantity: item.quantity,
            itemTotal: item.price * item.quantity
          };
          if (!order.table) {
            order.table = [info];
          } else {
            order.table.push(info);
          }
        });
      });
      return data;
    },
    async getItems() {
      this.loading = true;
      const response = await services.fetchOrders();
      console.log(response.data);

      this.orders = this.processData(response.data);
      console.log(this.orders);
      this.loading = false;
    }
  }
};
</script>

<style type="text/css" scoped>
.table-wrap {
  width: 60%;
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
}
.full-table {
  margin: 20px;
  width: 100%;
}
.button {
  align-items: left;
}
</style>
