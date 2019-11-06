<template>
  <div v-if="items">
    <div class="table-wrap">
      <h4 v-if="!year">
        {{ this.month[this.order._id.month - 1] + " " + this.order._id.year }}
      </h4>
      <h4 v-if="year">
        {{ this.order._id.year }}
      </h4>
    </div>
    <b-table
      sticky-header
      class="table-wrap"
      :busy="loading"
      head-variant="dark"
      :items="items"
      :fields="field"
    />
    <b-card class="footer"><b>Total Sales:</b> {{ totalSales }}</b-card>
  </div>
</template>

<script>
import services from "@/services/services";

export default {
  props: ["order", "year"],
  data() {
    return {
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      loading: false,
      items: null,
      totalSales: 0,
      field: [
        { key: "item[0].name", label: "Name", sortable: true },
        {
          key: "item[0].attr",
          label: "Type",
          formatter: (value, key, item) => value[item._id.index].type
        },
        {
          key: "item",
          label: "Price",
          formatter: (value, key, item) => value[0].attr[item._id.index].price
        },
        { key: "totalQuantity", sortable: true },
        { key: "totalPrice", sortable: true }
      ]
    };
  },
  beforeMount() {
    if (!this.order) {
      this.$router.go(-1);
    }
  },
  mounted() {
    if (this.year) {
      this.getItemsByYear();
    } else {
      this.getItemsByMonth();
    }
  },
  methods: {
    getTotal() {
      let total = 0;
      this.items.forEach(item => {
        total += item.totalPrice;
      });
      this.totalSales = total;
    },
    async getItemsByMonth() {
      this.loading = true;
      let res = await services.fetchItemsByMonth({
        month: this.order._id.month,
        year: this.order._id.year
      });
      this.items = res.data;
      this.getTotal();
      this.loading = false;
    },
    async getItemsByYear() {
      this.loading = true;
      let res = await services.fetchItemsByYear({
        year: this.order._id.year
      });
      this.items = res.data;
      this.getTotal();
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
  max-height: 600px;
}
.footer {
  background-color: rgba(188, 188, 198, 0.993);
  width: 60%;
  margin: 0 auto;
  text-align: right;
  margin-top: 5px;
}
</style>
